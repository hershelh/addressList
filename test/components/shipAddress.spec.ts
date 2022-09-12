import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'
import ShipAddress from '~/pages/addressManagement/shipAddress.vue'

vi.mock('vue-router')

const renderShipAddress = (fetchStatues = true) => {
  const AddressList = defineComponent({
    emits: ['fetch'],
    setup(props, { emit }) {
      const fetch = async () => {
        emit('fetch', fetchStatues)
      }
      fetch()
    },
    template: '<div />',
  })
  return render(ShipAddress, {
    global: {
      stubs: {
        AddressList,
      },
    },
  })
}

describe('shipAddress', () => {
  const push = vi.fn()
  const replace = vi.fn()

  beforeEach(() => {
    vi.mocked(useRouter, {
      partial: true,
    }).mockImplementation(() => ({
      push,
      replace,
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('退出登录', async () => {
    localStorage.setItem('token', '12345')
    const { getByText } = renderShipAddress()
    expect(localStorage.getItem('token')).not.toBeNull()
    expect(replace).not.toHaveBeenCalled()

    await fireEvent.click(getByText('退出登录'))
    await fireEvent.click(screen.getByText('确认'))
    vi.advanceTimersByTime(2000)

    expect(localStorage.getItem('token')).toBeNull()
    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/')
  })

  test('接收 AddressList 的 fetch 事件，若该事件参数为 true，则显示 AddressList 和新增地址按钮、移除 skeleton 和 empty', async () => {
    const { getByTestId, queryByTestId, queryByText } = renderShipAddress()
    expect(getByTestId('list')).not.toBeVisible()
    expect(getByTestId('skeleton')).toBeInTheDocument()
    expect(queryByTestId('empty')).toBeNull()
    expect(queryByText('新增地址')).toBeNull()

    await waitFor(() => expect(queryByTestId('skeleton')).toBeNull())
    expect(getByTestId('list')).toBeVisible()
    expect(queryByTestId('empty')).toBeNull()
    expect(queryByText('新增地址')).not.toBeNull()
  })

  test('接收 AddressList 的 fetch 事件，若该事件参数为 false，则显示新增地址按钮和 empty，移除 skeleton，隐藏 AddressList', async () => {
    const { getByTestId, queryByTestId, queryByText } = renderShipAddress(false)
    expect(getByTestId('list')).not.toBeVisible()
    expect(getByTestId('skeleton')).toBeInTheDocument()
    expect(queryByTestId('empty')).toBeNull()
    expect(queryByText('新增地址')).toBeNull()

    await waitFor(() => expect(queryByTestId('skeleton')).toBeNull())
    expect(getByTestId('list')).not.toBeVisible()
    expect(queryByTestId('empty')).not.toBeNull()
    expect(queryByText('新增地址')).not.toBeNull()
  })

  test('点击新增地址按钮调用 router.push()', async () => {
    const { findByText } = renderShipAddress()
    expect(push).not.toHaveBeenCalled()

    await fireEvent.click(await findByText('新增地址'))

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/address/editAddress?isEdit=false')
  })
})
