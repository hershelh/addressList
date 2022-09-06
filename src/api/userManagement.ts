import { service } from '../network'
import type {
  Login,
  LoginResponseData,
} from '../types/userManagement'

export function login(params: Login): Promise<LoginResponseData> {
  return service.post('/user/login', params)
}
