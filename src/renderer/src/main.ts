import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.config.globalProperties.$t = window.i18n.t
app.mount('#app')
