import { afterEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import AddressListItem from '~/components/AddressListItem.vue'
import { encodePhoneNumber } from '~/utils'

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

const commit = vi.fn()
vi.mock('vuex', () => ({
  useStore: () => ({
    commit,
  }),
}))

const addressInfo = {
  addressId: '1',
  name: '李先生',
  mobilePhone: '13511334455',
  detailAddress: '中山路阳光小区22号',
  area: '广东省广州市天河区',
  tag: 1,
  defaultFlag: true,
}

const renderAddressListItem = () => {
  return render(AddressListItem, {
    props: {
      addressInfo,
    },
  })
}

describe('AddressListItem', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('展示地址信息', () => {
    const { html } = renderAddressListItem()

    expect(html()).toContain(addressInfo.name)
    expect(html()).toContain(encodePhoneNumber(addressInfo.mobilePhone))
    expect(html()).toContain(addressInfo.detailAddress)
    expect(html()).toContain(addressInfo.area)
    expect(html()).toContain(['', '家', ' 公司', '学校'][addressInfo.tag])
    expect(html()).toContain(addressInfo.defaultFlag ? '默认' : '')
  })

  test('点击后调用 router.push()', async () => {
    const { getByTestId } = renderAddressListItem()
    expect(push).not.toHaveBeenCalled()

    await fireEvent.click(getByTestId('item'))

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/address/editAddress?isEdit=true')
  })

  test('点击后设置 addressStore 的 currentAddressId', async () => {
    const { getByTestId } = renderAddressListItem()
    expect(commit).not.toHaveBeenCalled()

    await fireEvent.click(getByTestId('item'))

    expect(commit).toHaveBeenCalledTimes(1)
    expect(commit).toHaveBeenCalledWith('setCurrentAddressId', addressInfo.addressId)
  })

  test('长按一秒后抛出 longTouch 事件', async () => {
    const { getByTestId, emitted } = renderAddressListItem()
    expect(emitted()).not.toHaveProperty('longTouch')

    await fireEvent.touchStart(getByTestId('item'))
    vi.advanceTimersByTime(1000)

    expect(emitted()).toHaveProperty('longTouch')
  })

  test('长按时如果触摸移动则不进行抛出', async () => {
    const { getByTestId, emitted } = renderAddressListItem()
    expect(emitted()).not.toHaveProperty('longTouch')

    await fireEvent.touchStart(getByTestId('item'))
    await fireEvent.touchMove(getByTestId('item'))
    vi.advanceTimersByTime(1000)

    expect(emitted()).not.toHaveProperty('longTouch')
  })
})
