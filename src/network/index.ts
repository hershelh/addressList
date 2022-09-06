import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import type { ResponseType } from '~/types/common'
import 'vant/es/Toast/style'

export const service = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 3000,
})

export const baseURL = 'https://www.tkoath.top/agripro'

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
  const router = useRouter()
  router.replace('/')
  localStorage.removeItem('token')
}

service.interceptors.response.use(
  ({ data: { code, data, msg } }: AxiosResponse<ResponseType>) => {
    if (code === 200)
      return data
    if (code === 401)
      jumpToLogin()
    Toast(msg)
    return Promise.reject(msg)
  },
  (err) => {
    Toast(err || '响应错误')
    return Promise.reject(new Error(err))
  },
)

