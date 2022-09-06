import { createApp } from 'vue'
// import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
// import routes from '~pages'
import { router } from '~/router'

import './styles/main.css'

const app = createApp(App)
app.config.errorHandler = () => {}
// const router = createRouter({
//   history: createWebHashHistory(import.meta.env.BASE_URL),
//   routes,
// })
app.use(router)
app.mount('#app')
