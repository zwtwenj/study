import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as Sentry from '@sentry/vue'

const app = createApp(App)
console.log(a)

app.use(router).mount('#app')

Sentry.init({
    app,
    dsn: 'https://c986fd23926a4615a6f965be9e7ef384@o4505232974282752.ingest.sentry.io/4505232977428480',
    integrations: [
        new Sentry.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        }),
        new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

myUndefinedFunction()