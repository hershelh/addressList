import matchers from '@testing-library/jest-dom/matchers'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { cleanup } from '@testing-library/vue'

expect.extend(matchers)

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout'],
  })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
