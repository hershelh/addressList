import type { AxiosResponse } from 'axios'
import { router } from '~/main'

export const service = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 3000,
})

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token)
      config.headers!.Authorization = `Bearer ${token}`
    return config
  },
  (err) => {
    Toast(err || '请求错误')
    return Promise.reject(new Error(err))
  },
)
const jumpToLogin = () => {
  router.replace('/')
}
interface ResponseType<T = null> {
  code: number
  data: T
  msg: string
}

service.interceptors.response.use(
  ({ data: { code, data, msg } }: AxiosResponse<ResponseType>) => {
    if (code === 200)
      return data
    if (code === 401) {
      Toast(msg)
      setTimeout(jumpToLogin, 1000)
      return
    }
    Toast(msg)
    return Promise.reject(msg)
  },
  (err) => {
    Toast(err || '响应错误')
    return Promise.reject(new Error(err))
  },
)

