import { describe, expect, test } from 'vitest'
import { encodePhoneNumber } from '~/utils'

describe('encodePhoneNumber', () => {
  test('输入手机号码，对中间四位进行编码', () => {
    expect(encodePhoneNumber('13511223344')).toBe('135****3344')
  })
})
