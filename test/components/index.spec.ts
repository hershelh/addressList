import { render } from '@testing-library/vue'
import { useRouter } from 'vue-router'
import Index from '~/pages/index.vue'

vi.mock('vue-router')

describe('index', () => {
  const replace = vi.fn()

  beforeEach(() => {
    vi.mocked(useRouter, {
      partial: true,
    }).mockImplementation(() => ({
      replace,
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('如果本地存储中有 token 则自动登录', () => {
    localStorage.setItem('token', '12345')
    render(Index)
    expect(replace).not.toHaveBeenCalled()

    vi.advanceTimersByTime(2000)

    expect(replace).toHaveBeenCalledTimes(1)

    localStorage.removeItem('token')
  })

  test('如果本地存储中无 token 则不进行自动登录', () => {
    render(Index)
    expect(replace).not.toHaveBeenCalled()

    vi.advanceTimersByTime(2000)

    expect(replace).toHaveBeenCalledTimes(0)
  })
})
