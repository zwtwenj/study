# sentry中一些数据采集的方法

    参考https://juejin.cn/post/6957475955858210823

## 手动上报

    分为captureException和captureMessage

    Sentry.captureException('captureException');
    Sentry.captureMessage('captureMessage');
    // 设置用户信息：
    scope.setUser({ “email”: “xx@xx.cn”})
    // 给事件定义标签：
    scope.setTags({ ‘api’, ‘api/ list / get’})
    // 设置事件的严重性：
    scope.setLevel(‘error’)
    // 设置附加数据：
    scope.setExtra(‘data’, { request: { a: 1, b: 2 })
    // 添加一个面包屑
    Sentry.addBreadcrumb({
        category: "auth",
        message: "Authenticated user ",
        level: Sentry.Severity.Info,
    });
    // 添加一个scope 标题？？？ 当前事务名称用于对Performance产品中的事务进行分组 ，并用错误点注释错误事件。
    Sentry.configureScope(scope => scope.setTransactionName("UserListView"));
    // 局部
    Sentry.withScope(function (scope) {
        scope.setTag("my-tag", "my value");
        scope.setLevel("warning");
        // will be tagged with my-tag="my value"
        Sentry.captureException(new Error("my error"));
    });
    // 设置上下文
    Sentry.setContext("character", {
        name: "Mighty Fighter",
        age: 19,
        attack_type: "melee",
    });

    实现大概是这样
    // 手动触发throw一个报错，然后把报错的信息重置为用户传入的，然后调用callOnHub来触发一个上报
    // captureException是上传一个错误对象
    function captureException(exception, captureContext) {
        var syntheticException;
        try {
            throw new Error('Sentry syntheticException');
        }
        catch (exception) {
            syntheticException = exception;
        }
        return callOnHub('captureException', exception, {
            captureContext: captureContext,
            originalException: exception,
            syntheticException: syntheticException,
        });
    }

    // captureMessage则上传递一个消息，这个消息即可以包含错误信息，也可以是普通消息
    function captureMessage(message, captureContext) {
        var syntheticException;
        try {
            throw new Error(message);
        }
        catch (exception) {
            syntheticException = exception;
        }
        return callOnHub('captureMessage', message, level, tslib_1.__assign({ originalException: message, syntheticException: syntheticException }, context));
    }

## 全局捕获

    1.window.addEventListener('error')
        监控JavaScript运行时错误（包括语法错误）和 资源加载错误

    2.window.addEventListener('unhandledrejection')
        对promise监控unhandledrejection事件，即未被catch的reject状态的promise

    3.document.addEventListener('click')

    4.通过对全局函数进行封装包裹，实现在在调用该函数时自动捕获异常
        如setTimeout、setInterval、requestAnimationFrame等，其实就是通过代理的方式把原来的方法拦截一下在调用真实的方法之前做一些自己的事情

        const prevSetTimeout = window.setTimeout;
        window.setTimeout = function(callback, timeout) {
            const self = this;
            return prevSetTimeout(function() {
                try {
                    callback.call(this);
                } catch (e) {
                    // 捕获到详细的错误，在这里处理日志上报等了逻辑
                    // ...
                    throw e;
                }
            }, timeout);
        }

    5.Vue的Vue.config.errorHandler

        // sentry中对Vue errorHandler的处理
        function vuePlugin(Raven, Vue) {
            var _oldOnError = Vue.config.errorHandler;
            Vue.config.errorHandler = function VueErrorHandler(error, vm, info) {
                // 上报
                Raven.captureException(error, {
                    extra: metaData
                });

                if (typeof _oldOnError === 'function') {
                    // 为什么这么做？
                    _oldOnError.call(this, error, vm, info);
                }
            };
        }
        module.exports = vuePlugin;

        平时自己就可以这么用
        import App from './App.vue'
        const app = createApp(App)
        app.config.errorHandler = function (err, vm, info) {
            console.log(err)
            console.log(vm)
            console.log(info)
        }

    6.React的ErrorBoundary

        ErrorBoundary的定义：如果一个class组件中定义了static getDerivedStateFromError() 或componentDidCatch()这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。当抛出错误后，请使用static getDerivedStateFromError()渲染备用 UI ，使用componentDidCatch()打印错误信息

        // ErrorBoundary的示例
        class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        componentDidCatch(error, info) {
            this.setState({ hasError: true });
            // 在这里可以做异常的上报
            logErrorToMyService(error, info);
        }

        render() {
            if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
            }
            return this.props.children;
        }

        <ErrorBoundary>
        <MyWidget />
        </ErrorBoundary>

    7.请求相关

        xhr通过重写send和open
            function fill(source, name, replacementFactory) {
                var original = source[name];
                var wrapped = replacementFactory(original);
                source[name] = wrapped;
            }
            // xhr
            function instrumentXHR(): void {
                // 保存真实的xhr的原型
                const xhrproto = XMLHttpRequest.prototype;
                // 拦截open方法
                fill(xhrproto, 'open', function (originalOpen: () => void): () => void {
                    return function (this: SentryWrappedXMLHttpRequest, ...args: any[]): void {
                        const xhr = this;
                        const onreadystatechangeHandler = function (): void {
                        if (xhr.readyState === 4) {
                            if (xhr.__sentry_xhr__) {
                                xhr.__sentry_xhr__.status_code = xhr.status;
                            }
                            // // 上报sentry
                            triggerHandlers('xhr', {
                                args,
                                endTimestamp: Date.now(),
                                startTimestamp: Date.now(),
                                xhr,
                            });
                        }
                    };

                    if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
                        // 拦截onreadystatechange方法
                        fill(xhr, 'onreadystatechange', function (original: WrappedFunction): Function {
                            return function (...readyStateArgs: any[]): void {
                                onreadystatechangeHandler();
                                // 返回原来的方法
                                return original.apply(xhr, readyStateArgs);
                            };
                        });
                    } else {
                        xhr.addEventListener('readystatechange', onreadystatechangeHandler);
                    }
                    // 调用原来的方法
                    return originalOpen.apply(xhr, args);
                };
            });
            // fill其实就是拦截的一个封装originalSend就是原来的send方法，还可以重写load方法用来监听资源加载事件
            fill(xhrproto, 'send', function (originalSend: () => void): () => void {
                return function (this: SentryWrappedXMLHttpRequest, ...args: any[]): void {
                        // 上报sentry
                        triggerHandlers('xhr', {
                        args,
                        startTimestamp: Date.now(),
                        xhr: this,
                        });
                        // 返回原来方法
                        return originalSend.apply(this, args);
                    };
                });
            }

            看着太多了，简单来写就是这样
            const xhrPropotype = XMLHttpRequest.prototype
            const oldOpen = xhrPropotype.open
            xhrPropotype.open = function () {
                console.log(arguments)
                oldOpen.apply(this, arguments)
            }

        fetch通过拦截整个方法（需要讨论，reject的情况）
        function instrumentFetch() {
            if (!supportsNativeFetch()) {
                return;
            }
            fill(global$2, 'fetch', function (originalFetch) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var handlerData = {
                        args: args,
                        fetchData: {
                        method: getFetchMethod(args),
                        url: getFetchUrl(args),
                        },
                        startTimestamp: Date.now(),
                    };
                    triggerHandlers('fetch', __assign({}, handlerData));
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    return originalFetch.apply(global$2, args).then(function (response) {
                        triggerHandlers('fetch', __assign(__assign({}, handlerData), { endTimestamp: Date.now(), response: response }));
                        return response;
                    }, function (error) {
                        triggerHandlers('fetch', __assign(__assign({}, handlerData), { endTimestamp: Date.now(), error: error }));
                        throw error;
                    });
                };
            });
        }

        console.xxx
        function instrumentConsole() {
            if (!('console' in global$2)) {
                return;
            }
            ['debug', 'info', 'warn', 'error', 'log', 'assert'].forEach(function (level) {
                if (!(level in global$2.console)) {
                    return;
                }
                fill(global$2.console, level, function (originalConsoleLevel) {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                        }
                        // 上报sentry
                        triggerHandlers('console', { args: args, level: level });
                        // this fails for some browsers. :(
                        if (originalConsoleLevel) {
                            Function.prototype.apply.call(originalConsoleLevel, global$2.console, args);
                        }
                    };
                });
            });
        }