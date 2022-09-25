import type * as VueRouter from 'vue-router'
import AddressListItem from '~/components/AddressListItem.vue'

const push = vi.fn()
vi.mock('vue-router', async () => ({
  ...await vi.importActual<typeof VueRouter>('vue-router'),
  useRouter: () => ({
    push,
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
    global: {
      plugins: [createTestingPinia()],
    },
  })
}

describe('AddressListItem', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('展示地址信息', () => {
    const { queryByText, getByText } = renderAddressListItem()

    expect(getByText(addressInfo.name)).toBeInTheDocument()
    expect(getByText(encodePhoneNumber(addressInfo.mobilePhone))).toBeInTheDocument()
    expect(getByText(addressInfo.area)).toBeInTheDocument()
    expect(getByText(addressInfo.detailAddress)).toBeInTheDocument()
    expect(getByText('家')).toBeInTheDocument()
    expect(queryByText('公司')).toBeNull()
    expect(queryByText('学校')).toBeNull()
    expect(queryByText('默认')).toBeInTheDocument()
  })

  test('点击后调用 router.push()', async () => {
    const { getByTestId } = renderAddressListItem()
    expect(push).not.toHaveBeenCalled()

    await fireEvent.click(getByTestId('item'))

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/address/editAddress?isEdit=true')
  })

  test('点击后设置 store 的 currentAddressId', async () => {
    const { getByTestId } = renderAddressListItem()
    const address = useAddressStore()
    expect(address.currentAddressId).toBe('')

    await fireEvent.click(getByTestId('item'))

    expect(address.currentAddressId).toBe(addressInfo.addressId)
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
