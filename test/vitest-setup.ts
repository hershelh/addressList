import '@testing-library/jest-dom/extend-expect'

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout'],
  })
})

afterEach(() => {
  vi.useRealTimers()
})
