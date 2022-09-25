import type { AddressInfo } from '~/types/addressManagement'

vi.mock('~/network/apis/addressManagement')

describe('Address Store', () => {
  let mockAddressInfoList: AddressInfo[] = []

  beforeEach(() => {
    mockAddressInfoList = [
      {
        addressId: '1',
        name: '小李',
        mobilePhone: '13511223344',
        detailAddress: '阳光小区23号',
        area: '广东省广州市天河区',
        tag: 1,
        defaultFlag: true,
      },
      {
        addressId: '2',
        name: '大黄',
        mobilePhone: '13511223355',
        detailAddress: '阳光小区24号',
        area: '广东省广州市天河区',
        tag: 2,
        defaultFlag: false,
      },
    ]
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  test('currentAddressInfo', () => {
    const address = useAddressStore()
    address.addressInfoList = mockAddressInfoList

    address.currentAddressId = '1'
    expect(address.currentAddressInfo).toEqual(address.addressInfoList[0])

    address.currentAddressId = '2'
    expect(address.currentAddressInfo).toEqual(address.addressInfoList[1])
  })

  test('getAddressInfoList', async () => {
    vi.mocked(getAddressList).mockImplementation(vi.fn().mockResolvedValue(mockAddressInfoList))
    const address = useAddressStore()

    await address.getAddressInfoList()

    expect(address.addressInfoList).toEqual(mockAddressInfoList)
  })

  test('addAddress', async () => {
    const addressForm = {
      name: '小方',
      mobilePhone: '13511223366',
      detailAddress: '阳光小区25号',
      area: '广东省广州市天河区',
      tag: 3,
      defaultFlag: false,
    }
    vi.mocked(addAddress).mockImplementation(vi.fn().mockResolvedValue({ addressId: '3' }))
    const address = useAddressStore()

    await address.addAddress(addressForm)

    expect(address.addressInfoList[0]).toEqual({
      ...addressForm,
      addressId: '3',
    })
  })

  test('editAddress', async () => {
    const addressInfo = {
      addressId: '2',
      name: '王华',
      mobilePhone: '13511223377',
      detailAddress: '阳光小区26号',
      area: '广东省广州市天河区',
      tag: 0,
      defaultFlag: false,
    }
    vi.mocked(editAddress).mockImplementation(vi.fn().mockResolvedValue('resolved'))
    const address = useAddressStore()
    address.addressInfoList = mockAddressInfoList

    await address.editAddress(addressInfo)

    expect(address.addressInfoList[1]).toEqual(addressInfo)
  })

  test('deleteAddress', async () => {
    vi.mocked(deleteAddress).mockImplementation(vi.fn().mockResolvedValue('resolved'))
    const address = useAddressStore()
    address.addressInfoList = mockAddressInfoList

    await address.deleteAddress('1')

    expect(address.addressInfoList).toHaveLength(1)
    expect(address.addressInfoList[0]).toEqual(mockAddressInfoList[0])
  })

  describe('当 API 调用出错时状态保持原样', () => {
    test('getAddressInfoList 出错', async () => {
      vi.mocked(getAddressList).mockImplementation(vi.fn().mockRejectedValue('rejected'))
      const address = useAddressStore()
      expect(address.addressInfoList).toEqual([])

      await expect(address.getAddressInfoList()).rejects.toThrow('rejected')
      expect(address.addressInfoList).toEqual([])
    })

    test('addAddress 出错', async () => {
      const addressForm = {
        name: '小方',
        mobilePhone: '13511223366',
        detailAddress: '阳光小区25号',
        area: '广东省广州市天河区',
        tag: 3,
        defaultFlag: false,
      }
      vi.mocked(addAddress).mockImplementation(vi.fn().mockRejectedValue('rejected'))
      const address = useAddressStore()
      expect(address.addressInfoList).toHaveLength(0)

      await expect(address.addAddress(addressForm)).rejects.toThrow('rejected')
      expect(address.addressInfoList).toHaveLength(0)
    })

    test('editAddress 出错', async () => {
      const addressInfo = {
        addressId: '2',
        name: '王华',
        mobilePhone: '13511223377',
        detailAddress: '阳光小区26号',
        area: '广东省广州市天河区',
        tag: 0,
        defaultFlag: false,
      }
      vi.mocked(editAddress).mockImplementation(vi.fn().mockRejectedValue('rejected'))
      const address = useAddressStore()
      address.addressInfoList = mockAddressInfoList
      expect(address.addressInfoList[1]).not.toEqual(addressInfo)
      expect(address.addressInfoList[1]).toEqual(mockAddressInfoList[1])

      await expect(address.editAddress(addressInfo)).rejects.toThrow('rejected')
      expect(address.addressInfoList[1]).not.toEqual(addressInfo)
      expect(address.addressInfoList[1]).toEqual(mockAddressInfoList[1])
    })

    test('deleteAddress 出错', async () => {
      vi.mocked(deleteAddress).mockImplementation(vi.fn().mockRejectedValue('rejected'))
      const address = useAddressStore()
      address.addressInfoList = mockAddressInfoList
      expect(address.addressInfoList).toHaveLength(2)
      expect(address.addressInfoList[0]).toEqual(mockAddressInfoList[0])

      await expect(address.deleteAddress('1')).rejects.toThrow('rejected')
      expect(address.addressInfoList).toHaveLength(2)
      expect(address.addressInfoList[0]).toEqual(mockAddressInfoList[0])
    })
  })
})
