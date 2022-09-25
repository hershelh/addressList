import App from './App.vue'
import routes from '~pages'
import './styles/main.css'
import 'vant/es/Toast/style'
import 'vant/es/dialog/style'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.config.errorHandler = () => {}

app.use(createPinia())
  .use(router)
  .mount('#app')
