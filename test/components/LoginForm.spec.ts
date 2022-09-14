import { fireEvent, render, waitFor } from '@testing-library/vue'
import type * as VueRouter from 'vue-router'
import LoginForm from '~/components/LoginForm.vue'
import * as loginAPI from '~/api/userManagement'

const replace = vi.fn()
vi.mock('vue-router', async () => ({
  ...await vi.importActual<typeof VueRouter>('vue-router'),
  useRouter: () => ({
    replace,
  }),
}))

describe('LoginForm', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('填写表单进行登录', () => {
    vi.spyOn(loginAPI, 'login').mockImplementation(vi.fn().mockResolvedValue({
      token: 'acbdefgfedbca123',
    }))

    afterEach(() => {
      localStorage.removeItem('token')
    })

    test('输入用户名和密码进行登录可以登录成功, 将 token 存储到本地存储中', async () => {
      const { getByPlaceholderText, getByTestId } = render(LoginForm)
      expect(localStorage.getItem('token')).toBeNull()

      await fireEvent.update(getByPlaceholderText('用户名'), 'jeanmay')
      await fireEvent.update(getByPlaceholderText('密码'), 'password123456')
      await fireEvent.submit(getByTestId('form'))

      // await waitFor(() => expect(localStorage.getItem('token')).toBe('acbdefgfedbca123'))
      expect(localStorage.getItem('token')).toBe('acbdefgfedbca123')
    })

    test('输入用户名和密码进行登录可以登录成功, 1 秒后调用 router.replace()', async () => {
      const { getByPlaceholderText, getByTestId } = render(LoginForm)
      expect(replace).not.toHaveBeenCalled()

      await fireEvent.update(getByPlaceholderText('用户名'), 'jeanmay')
      await fireEvent.update(getByPlaceholderText('密码'), 'password123456')
      await fireEvent.submit(getByTestId('form'))
      // 确保定时器已调用
      // await waitFor(() => expect(localStorage.getItem('token')).not.toBeNull())
      vi.advanceTimersByTime(1000)

      // await waitFor(() => expect(replace).toHaveBeenCalledTimes(1))
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).toHaveBeenCalledWith('/address/shipAddress')
    })

    test('提交表单时按钮被禁用', async () => {
      const { getByPlaceholderText, getByTestId } = render(LoginForm)
      expect(getByTestId('button')).toBeEnabled()

      await fireEvent.update(getByPlaceholderText('用户名'), 'jeanmay')
      await fireEvent.update(getByPlaceholderText('密码'), 'password123456')
      await fireEvent.submit(getByTestId('form'))

      // await waitFor(() => expect(getByTestId('button')).toBeDisabled())
      expect(getByTestId('button')).toBeDisabled()
    })

    test('提交表单失败后按钮被启用', async () => {
      vi.mocked(loginAPI.login).mockImplementation(vi.fn().mockRejectedValue('rejected'))
      const { getByPlaceholderText, getByTestId } = render(LoginForm)
      expect(getByTestId('button')).toBeEnabled()

      await fireEvent.update(getByPlaceholderText('用户名'), 'jeanmay')
      await fireEvent.update(getByPlaceholderText('密码'), 'password123456')
      await fireEvent.submit(getByTestId('form'))

      // await waitFor(() => expect(getByTestId('button')).toBeDisabled())
      expect(getByTestId('button')).toBeEnabled()
    })
  })

  describe('表单验证', () => {
    test('未填写表单项用户名和密码失焦时会进行提示', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(LoginForm)
      expect(queryByText('请填写用户名')).toBeNull()
      expect(queryByText('请填写密码')).toBeNull()

      await fireEvent.touch(getByPlaceholderText('用户名'))
      expect(getByText('请填写用户名')).toBeInTheDocument()
      await fireEvent.touch(getByPlaceholderText('密码'))
      expect(getByText('请填写密码')).toBeInTheDocument()
    })

    test('提交时未输入用户名或密码会进行提示', async () => {
      const { getByText, queryByText } = render(LoginForm)
      expect(queryByText('请填写用户名')).toBeNull()
      expect(queryByText('请填写密码')).toBeNull()

      await fireEvent.click(getByText('登录'))

      expect(getByText('请填写用户名')).toBeInTheDocument()
      expect(getByText('请填写密码')).toBeInTheDocument()
    })
  })
})
