import { createApp } from 'vue'
// import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
// import routes from '~pages'
import { router } from '~/router'
import './styles/main.css'
import 'vant/es/Toast/style'
import 'vant/es/dialog/style'

const app = createApp(App)
app.config.errorHandler = () => {}
// const router = createRouter({
//   history: createWebHashHistory(import.meta.env.BASE_URL),
//   routes,
// })
app.use(createPinia())
app.use(router)
app.mount('#app')
