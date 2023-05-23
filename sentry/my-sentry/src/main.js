import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as Sentry from '@sentry/vue'

const app = createApp(App)

app.use(router).mount('#app')

Sentry.init({
    app,
    dsn: 'https://5f6d16a291e44119a8483ccb198adc68@o4505232974282752.ingest.sentry.io/4505233058168832',
    integrations: [
        new Sentry.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router)
        }),
        new Sentry.Replay()
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
})