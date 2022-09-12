import { afterEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, getByText as getByContainerText, render, waitFor } from '@testing-library/vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AddressForm from '~/components/AddressForm.vue'

vi.mock('vue-router')
vi.mock('vuex')

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
  })
}

describe('AddressForm', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('新增收货地址', () => {
    test('正确填写表单并提交后分发 store 的 addAddress 事件', async () => {
      const dispatch = vi.fn()
      vi.mocked(useStore, {
        partial: true,
      }).mockImplementation(() => ({
        dispatch,
      }))
      const { getByPlaceholderText, getByText, getByRole, getByTestId } = renderAddressForm()
      expect(dispatch).toHaveBeenCalledTimes(0)

      await fireEvent.update(getByPlaceholderText('请填写收货人姓名'), addressInfo.name)
      await fireEvent.update(getByPlaceholderText('手机号码'), addressInfo.mobilePhone)
      await fireEvent.click(getByPlaceholderText('点击选择省市区'))
      await fireEvent.click(getByContainerText(document.body, '确认'))
      await fireEvent.update(getByPlaceholderText('详细地址'), addressInfo.detailAddress)
      await fireEvent.click(getByText('家'))
      await fireEvent.click(getByRole('switch'))
      await fireEvent.submit(getByTestId('form'))

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith('addAddress', addressInfo)
    })

    test('正确填写表单并提交成功后，1 秒后调用 router.back()', async () => {
      const back = vi.fn()
      vi.mocked(useRouter, {
        partial: true,
      }).mockImplementation(() => ({
        back,
      }))
      const dispatch = vi.fn()
      vi.mocked(useStore, {
        partial: true,
      }).mockImplementation(() => ({
        dispatch,
      }))
      const { getByPlaceholderText, getByText, getByRole, getByTestId } = renderAddressForm()
      expect(back).not.toHaveBeenCalled()

      await fireEvent.update(getByPlaceholderText('请填写收货人姓名'), addressInfo.name)
      await fireEvent.update(getByPlaceholderText('手机号码'), addressInfo.mobilePhone)
      await fireEvent.click(getByPlaceholderText('点击选择省市区'))
      await fireEvent.click(getByContainerText(document.body, '确认'))
      await fireEvent.update(getByPlaceholderText('详细地址'), addressInfo.detailAddress)
      await fireEvent.click(getByText('家'))
      await fireEvent.click(getByRole('switch'))
      await fireEvent.submit(getByTestId('form'))
      vi.advanceTimersByTime(1000)

      expect(back).toHaveBeenCalledTimes(1)
    })
  })

  describe('修改收货地址', () => {
    test('展示待修改表单的信息', () => {
      vi.mocked(useStore, {
        partial: true,
      }).mockImplementation(() => ({
        getters: {
          currentAddressInfo: addressInfo,
        },
      }))
      const { getByRole, getByDisplayValue, getAllByRole } = renderAddressForm('true')

      expect(getByDisplayValue(addressInfo.name)).toBeInTheDocument()
      expect(getByDisplayValue(addressInfo.mobilePhone)).toBeInTheDocument()
      expect(getByDisplayValue(addressInfo.area)).toBeInTheDocument()
      expect(getAllByRole('radio')[1]).toBeChecked()
      expect(getAllByRole('radio')[0]).not.toBeChecked()
      expect(getAllByRole('radio')[2]).not.toBeChecked()
      expect(getAllByRole('radio')[3]).not.toBeChecked()
      expect(getByRole('switch')).toBeChecked()
    })

    test('正确修改表单并提交后分发 store 的 editAddress 事件', async () => {
      const dispatch = vi.fn()
      vi.mocked(useStore, {
        partial: true,
      }).mockImplementation(() => ({
        getters: {
          currentAddressInfo: {
            name: '测试人',
            mobilePhone: '13455667788',
            detailAddress: '羊村',
            area: '广东省广州市天河区',
            tag: 0,
            defaultFlag: false,
          },
        },
        dispatch,
      }))
      const { getByPlaceholderText, getByText, getByRole, getByTestId } = renderAddressForm('true')
      expect(dispatch).toHaveBeenCalledTimes(0)

      await fireEvent.update(getByPlaceholderText('请填写收货人姓名'), addressInfo.name)
      await fireEvent.update(getByPlaceholderText('手机号码'), addressInfo.mobilePhone)
      await fireEvent.click(getByPlaceholderText('点击选择省市区'))
      await fireEvent.click(getByContainerText(document.body, '确认'))
      await fireEvent.update(getByPlaceholderText('详细地址'), addressInfo.detailAddress)
      await fireEvent.click(getByText('家'))
      await fireEvent.click(getByRole('switch'))
      await fireEvent.submit(getByTestId('form'))

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith('editAddress', addressInfo)
    })

    test('正确修改表单并提交成功后，1 秒后调用 router.back()', async () => {
      const back = vi.fn()
      vi.mocked(useRouter, {
        partial: true,
      }).mockImplementation(() => ({
        back,
      }))
      const dispatch = vi.fn()
      vi.mocked(useStore, {
        partial: true,
      }).mockImplementation(() => ({
        getters: {
          currentAddressInfo: {
            name: '测试人',
            mobilePhone: '13455667788',
            detailAddress: '羊村',
            area: '广东省广州市天河区',
            tag: 0,
            defaultFlag: false,
          },
        },
        dispatch,
      }))
      const { getByPlaceholderText, getByText, getByRole, getByTestId } = renderAddressForm('true')
      expect(back).not.toHaveBeenCalled()

      await fireEvent.update(getByPlaceholderText('请填写收货人姓名'), addressInfo.name)
      await fireEvent.update(getByPlaceholderText('手机号码'), addressInfo.mobilePhone)
      await fireEvent.click(getByPlaceholderText('点击选择省市区'))
      await fireEvent.click(getByContainerText(document.body, '确认'))
      await fireEvent.update(getByPlaceholderText('详细地址'), addressInfo.detailAddress)
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
