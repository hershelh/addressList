import type { Screen } from '@testing-library/vue'
import AddressForm from '~/components/AddressForm.vue'

vi.mock('vue-router')

const addressInfo = {
  name: '李先生',
  mobilePhone: '13511334455',
  detailAddress: '中山路阳光小区22号',
  area: '北京市北京市东城区',
  tag: 1,
  defaultFlag: true,
}

const renderAddressForm = (isEdit = 'false') => {
  return render(AddressForm, {
    props: {
      isEdit,
    },
    global: {
      plugins: [createTestingPinia(
        isEdit === 'true'
          ? {
              initialState: {
                address: {
                  addressInfoList: [{ ...addressInfo, addressId: '1' }],
                  currentAddressId: '1',
                },
              },
            }
          : undefined)],
    },
  })
}

describe('AddressForm', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('新增收货地址', () => {
    test('正确填写表单并提交后调用 store 的 addAddress()', async () => {
      const { getByPlaceholderText, getByText, getByRole, getByTestId } = renderAddressForm()
      const address = useAddressStore()
      expect(address.addAddress).toHaveBeenCalledTimes(0)

      await fireEvent.update(getByPlaceholderText('请填写收货人姓名'), addressInfo.name)
      await fireEvent.update(getByPlaceholderText('手机号码'), addressInfo.mobilePhone)
      await fireEvent.click(getByPlaceholderText('点击选择省市区'))
      await fireEvent.click((screen as unknown as Screen).getByText('确认'))
      await fireEvent.update(getByPlaceholderText('详细地址'), addressInfo.detailAddress)
      await fireEvent.click(getByText('家'))
      await fireEvent.click(getByRole('switch'))
      await fireEvent.submit(getByTestId('form'))

      expect(address.addAddress).toHaveBeenCalledTimes(1)
      expect(address.addAddress).toHaveBeenCalledWith(addressInfo)
    })

    test('正确填写表单并提交成功后，1 秒后调用 router.back()', async () => {
      const back = vi.fn()
      vi.mocked(useRouter, {
        partial: true,
      }).mockImplementation(() => ({
        back,
      }))
      const { getByPlaceholderText, getByText, getByRole, getByTestId } = renderAddressForm()
      expect(back).not.toHaveBeenCalled()

      await fireEvent.update(getByPlaceholderText('请填写收货人姓名'), addressInfo.name)
      await fireEvent.update(getByPlaceholderText('手机号码'), addressInfo.mobilePhone)
      await fireEvent.click(getByPlaceholderText('点击选择省市区'))
      await fireEvent.click((screen as unknown as Screen).getByText('确认'))
      await fireEvent.update(getByPlaceholderText('详细地址'), addressInfo.detailAddress)
      await fireEvent.click(getByText('家'))
      await fireEvent.click(getByRole('switch'))
      await fireEvent.submit(getByTestId('form'))
      vi.advanceTimersByTime(1000)

      expect(back).toHaveBeenCalledTimes(1)
    })
  })

  describe('修改收货地址', () => {
    test('展示待修改表单的信息', async () => {
      const { getByRole, getByDisplayValue, getAllByRole } = renderAddressForm('true')

      expect(getByDisplayValue(addressInfo.name)).toBeInTheDocument()
      expect(getByDisplayValue(addressInfo.mobilePhone)).toBeInTheDocument()
      expect(getByDisplayValue(addressInfo.area)).toBeInTheDocument()
      expect(getByDisplayValue(addressInfo.detailAddress)).toBeInTheDocument()
      expect(getAllByRole('radio')[1]).toBeChecked()
      expect(getAllByRole('radio')[0]).not.toBeChecked()
      expect(getAllByRole('radio')[2]).not.toBeChecked()
      expect(getAllByRole('radio')[3]).not.toBeChecked()
      expect(getByRole('switch')).toBeChecked()
    })

    test('正确修改表单并提交后调用 store 的 editAddress()', async () => {
      const newAddressInfo = {
        name: '李华',
        mobilePhone: '13511334488',
        detailAddress: '中山路阳光小区11号',
        area: '北京市北京市东城区',
        tag: 2,
        defaultFlag: false,
      }
      const { getByPlaceholderText, getByText, getByRole, getByTestId } = renderAddressForm('true')
      const address = useAddressStore()
      expect(address.editAddress).toHaveBeenCalledTimes(0)

      await fireEvent.update(getByPlaceholderText('请填写收货人姓名'), newAddressInfo.name)
      await fireEvent.update(getByPlaceholderText('手机号码'), newAddressInfo.mobilePhone)
      await fireEvent.click(getByPlaceholderText('点击选择省市区'))
      await fireEvent.click((screen as unknown as Screen).getByText('确认'))
      await fireEvent.update(getByPlaceholderText('详细地址'), newAddressInfo.detailAddress)
      await fireEvent.click(getByText('公司'))
      await fireEvent.click(getByRole('switch'))
      await fireEvent.submit(getByTestId('form'))

      expect(address.editAddress).toHaveBeenCalledTimes(1)
      expect(address.editAddress).toHaveBeenCalledWith({ ...newAddressInfo, addressId: '1' })
    })

    test('正确修改表单并提交成功后，1 秒后调用 router.back()', async () => {
      const newAddressInfo = {
        name: '李华',
        mobilePhone: '13511334488',
        detailAddress: '中山路阳光小区11号',
        area: '北京市北京市东城区',
        tag: 2,
        defaultFlag: false,
      }
      const back = vi.fn()
      vi.mocked(useRouter, {
        partial: true,
      }).mockImplementation(() => ({
        back,
      }))
      const { getByPlaceholderText, getByText, getByRole, getByTestId } = renderAddressForm('true')
      expect(back).not.toHaveBeenCalled()

      await fireEvent.update(getByPlaceholderText('请填写收货人姓名'), newAddressInfo.name)
      await fireEvent.update(getByPlaceholderText('手机号码'), newAddressInfo.mobilePhone)
      await fireEvent.click(getByPlaceholderText('点击选择省市区'))
      await fireEvent.click((screen as unknown as Screen).getByText('确认'))
      await fireEvent.update(getByPlaceholderText('详细地址'), newAddressInfo.detailAddress)
      await fireEvent.click(getByText('家'))
      await fireEvent.click(getByRole('switch'))
      await fireEvent.submit(getByTestId('form'))
      vi.advanceTimersByTime(1000)

      expect(back).toHaveBeenCalledTimes(1)
    })
  })

  describe('表单验证', () => {
    test('未填写表单项时会进行提示', async () => {
      const { getByPlaceholderText, queryByText, getByText } = renderAddressForm()
      expect(queryByText('请填写收货人姓名')).toBeNull()
      expect(queryByText('请输入正确的手机号码')).toBeNull()
      expect(queryByText('请输入详细地址')).toBeNull()

      await fireEvent.touch(getByPlaceholderText('请填写收货人姓名'))
      expect(getByText('请填写收货人姓名')).toBeInTheDocument()
      await fireEvent.touch(getByPlaceholderText('手机号码'))
      expect(getByText('请输入正确的手机号码')).toBeInTheDocument()
      await fireEvent.touch(getByPlaceholderText('详细地址'))
      expect(getByText('请输入详细地址')).toBeInTheDocument()
    })

    test('提交时未输入表单项会进行提示', async () => {
      const { getByText, queryByText, getByTestId } = renderAddressForm()
      expect(queryByText('请填写收货人姓名')).toBeNull()
      expect(queryByText('请输入正确的手机号码')).toBeNull()
      expect(queryByText('请选择所在地区')).toBeNull()
      expect(queryByText('请输入详细地址')).toBeNull()

      await fireEvent.submit(getByTestId('form'))

      expect(getByText('请填写收货人姓名')).toBeInTheDocument()
      expect(getByText('请输入正确的手机号码')).toBeInTheDocument()
      expect(getByText('请选择所在地区')).toBeInTheDocument()
      expect(getByText('请输入详细地址')).toBeInTheDocument()
    })
  })
})
