import type { Screen } from '@testing-library/vue'
import AddressList from '~/components/AddressList.vue'
import type { AddressInfo } from '~/types/addressManagement'

vi.mock('vue-router')

describe('AddressList', () => {
  let mockedAddressInfoList: AddressInfo[] = []

  const renderAddressList = (stubs = false) => {
    const spy = () => {
      return vi.fn(async () => {
        const address = useAddressStore()
        address.addressInfoList.push(...mockedAddressInfoList)
      })
    }

    if (stubs) {
      const AddressListItem = defineComponent({
        emits: ['longTouch'],
        setup(props, { emit }) {
          const emitLongTouch = async () => {
            emit('longTouch')
          }
          emitLongTouch()
        },
        template: '<div />',
      })

      return render(AddressList, {
        global: {
          stubs: {
            AddressListItem,
          },
          plugins: [createTestingPinia({
            createSpy: spy,
          })],
        },
      })
    }
    else {
      return render(AddressList, {
        global: {
          plugins: [createTestingPinia({
            createSpy: spy,
          })],
        },

      })
    }
  }

  beforeEach(() => {
    mockedAddressInfoList = [
      {
        addressId: '1',
        name: '李先生',
        mobilePhone: '13511334455',
        detailAddress: '中山路阳光小区1号',
        area: '广东省广州市天河区',
        tag: 1,
        defaultFlag: true,
      },
      {
        addressId: '2',
        name: '李先生',
        mobilePhone: '13511334455',
        detailAddress: '中山路阳光小区2号',
        area: '广东省广州市天河区',
        tag: 1,
        defaultFlag: false,
      },
      {
        addressId: '3',
        name: '李先生',
        mobilePhone: '13511334455',
        detailAddress: '中山路阳光小区3号',
        area: '广东省广州市天河区',
        tag: 1,
        defaultFlag: false,
      },
    ]
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('获取并展示地址列表信息', async () => {
    const { findAllByTestId } = renderAddressList()

    expect(await findAllByTestId('item')).toHaveLength(3)
  })

  test('获取地址列表后，会抛出 fetch 事件，如果列表不为空，参数为 true', async () => {
    const { emitted } = renderAddressList()

    await waitFor(() => expect(emitted('fetch')).toHaveLength(1))
    expect(emitted('fetch')[0]).toEqual([true])
  })

  test('获取地址列表后，会抛出 fetch 事件，如果列表为空，参数为 false', async () => {
    mockedAddressInfoList.length = 0
    const { emitted } = renderAddressList()

    await waitFor(() => expect(emitted('fetch')).toHaveLength(1))
    expect(emitted('fetch')[0]).toEqual([false])
  })

  test('地址列表项变化时，会抛出 fetch 事件，如果列表项数减少到 0 ，事件参数为 false ，否则为 true', async () => {
    const { emitted } = renderAddressList()
    const address = useAddressStore()
    await waitFor(() => expect(emitted('fetch')).toHaveLength(2))

    address.addressInfoList.pop()
    await waitFor(() => expect(emitted('fetch')).toHaveLength(3))
    expect(emitted('fetch')[2]).toEqual([true])

    address.addressInfoList.pop()
    await waitFor(() => expect(emitted('fetch')).toHaveLength(4))
    expect(emitted('fetch')[3]).toEqual([true])

    address.addressInfoList.pop()
    await waitFor(() => expect(emitted('fetch')).toHaveLength(5))
    expect(emitted('fetch')[4]).toEqual([false])
  })

  test('监听到 Item 组件的 longTouch 事件后弹出弹窗，点击确定即可删除该 Item', async () => {
    mockedAddressInfoList.splice(0, 2)
    const { findAllByTestId, queryAllByTestId } = renderAddressList(true)
    const address = useAddressStore()
    vi.mocked(address.deleteAddress).mockImplementation(vi.fn(async () => {
      address.addressInfoList = []
    }))
    expect(await findAllByTestId('item')).toHaveLength(1)

    await fireEvent.click((screen as unknown as Screen).getByText('确认'))

    expect(address.deleteAddress).toHaveBeenCalledWith('3')
    expect(queryAllByTestId('item')).toHaveLength(0)
  })

  test('监听到 Item 组件的 longTouch 事件后弹出弹窗，点击取消不会删除该列表项', async () => {
    mockedAddressInfoList.splice(0, 2)
    const { findAllByTestId, queryAllByTestId } = renderAddressList(true)
    const address = useAddressStore()
    vi.mocked(address.deleteAddress).mockImplementation(vi.fn(async () => {
      address.addressInfoList = []
    }))
    expect(await findAllByTestId('item')).toHaveLength(1)

    await fireEvent.click((screen as unknown as Screen).getByText('取消'))

    expect(address.deleteAddress).not.toHaveBeenCalled()
    expect(queryAllByTestId('item')).toHaveLength(1)
  })
})
