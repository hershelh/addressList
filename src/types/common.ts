export interface ResponseType<T = any> {
  code: number
  data: T
  msg: string
}
