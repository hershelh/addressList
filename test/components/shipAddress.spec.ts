import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { findByText as findByContainerText, fireEvent, render, waitFor } from '@testing-library/vue'
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'
import ShipAddress from '~/pages/addressManagement/shipAddress.vue'

vi.mock('vue-router')

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
    const { getByText } = render(ShipAddress, {
      global: {
        stubs: {
          AddressList: true,
        },
      },
    })
    expect(localStorage.getItem('token')).not.toBeNull()
    expect(replace).not.toHaveBeenCalled()

    await fireEvent.click(getByText('退出登录'))
    await fireEvent.click(await findByContainerText(document.body, '确认'))
    vi.advanceTimersByTime(2000)

    expect(localStorage.getItem('token')).toBeNull()
    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/')
  })

  test('接收 AddressList 的 fetch 事件，若该事件参数为 true，则显示 AddressList 和新增地址按钮、移除 skeleton 和 empty', async () => {
    // eslint-disable-next-line vue/one-component-per-file
    const AddressList = defineComponent({
      emits: ['fetch'],
      setup(props, { emit }) {
        const fetch = async () => {
          emit('fetch', true)
        }
        fetch()
      },
      template: '<div />',
    })
    const { getByTestId, queryByTestId, queryByText } = render(ShipAddress, {
      global: {
        stubs: {
          AddressList,
        },
      },
    })
    expect(getByTestId('list')).not.toBeVisible()
    getByTestId('skeleton')
    expect(queryByTestId('empty')).toBeNull()
    expect(queryByText('新增地址')).toBeNull()

    await waitFor(() => expect(queryByTestId('skeleton')).toBeNull())
    expect(getByTestId('list')).toBeVisible()
    expect(queryByTestId('empty')).toBeNull()
    expect(queryByText('新增地址')).not.toBeNull()
  })

  test('接收 AddressList 的 fetch 事件，若该事件参数为 false，则显示新增地址按钮和 empty，移除 skeleton，隐藏 AddressList', async () => {
    // eslint-disable-next-line vue/one-component-per-file
    const AddressList = defineComponent({
      emits: ['fetch'],
      setup(props, { emit }) {
        const fetch = async () => {
          emit('fetch', false)
        }
        fetch()
      },
      template: '<div />',
    })
    const { getByTestId, queryByTestId, queryByText } = render(ShipAddress, {
      global: {
        stubs: {
          AddressList,
        },
      },
    })
    expect(getByTestId('list')).not.toBeVisible()
    getByTestId('skeleton')
    expect(queryByTestId('empty')).toBeNull()
    expect(queryByText('新增地址')).toBeNull()

    await waitFor(() => expect(queryByTestId('skeleton')).toBeNull())
    expect(getByTestId('list')).not.toBeVisible()
    expect(queryByTestId('empty')).not.toBeNull()
    expect(queryByText('新增地址')).not.toBeNull()
  })

  test('点击新增地址按钮调用 router.push()', async () => {
    // eslint-disable-next-line vue/one-component-per-file
    const AddressList = defineComponent({
      emits: ['fetch'],
      setup(props, { emit }) {
        emit('fetch', true)
      },
      template: '<div/>',
    })
    const { findByText } = render(ShipAddress, {
      global: {
        stubs: {
          AddressList,
        },
      },
    })
    expect(push).not.toHaveBeenCalled()

    await fireEvent.click(await findByText('新增地址'))

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/address/editAddress?isEdit=false')
  })
})
