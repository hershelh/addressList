import '@testing-library/jest-dom'

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout'],
  })
})

afterEach(() => {
  vi.useRealTimers()
})
