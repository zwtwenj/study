# sentry中一些数据采集的方法

    参考https://juejin.cn/post/6957475955858210823

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
            // fill其实就是拦截的一个封装originalSend就是原来的send方法
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

        fetch通过拦截整个方法（需要讨论，reject的情况）