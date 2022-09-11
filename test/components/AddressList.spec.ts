import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, getByText as getByContainerText, render, waitFor } from '@testing-library/vue'
import { createStore } from 'vuex'
import type * as Vuex from 'vuex'
import { defineComponent } from 'vue'
import AddressList from '~/components/AddressList.vue'
import type { AddressInfo } from '~/types/addressManagement'

vi.mock('vue-router')

describe('AddressList', () => {
  interface State {
    addressInfoList: AddressInfo[]
  }
  let store: Vuex.Store<State>
  let mockedAddressInfoList: AddressInfo[] = []

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

    store = createStore<State>({
      state: {
        addressInfoList: [],
      },
      actions: {
        getAddressInfoList({ state }) {
          state.addressInfoList.length = 0
          state.addressInfoList.push(...mockedAddressInfoList)
        },

        deleteAddress({ state }, id: string) {
          const index = state.addressInfoList.findIndex(({ addressId }) => (addressId === id))
          state.addressInfoList.splice(index, 1)
        },
      },
    })
  })

  test('获取并展示地址列表信息', async () => {
    const { findAllByTestId } = render(AddressList, {
      global: {
        provide: {
          store,
        },
      },
    })

    expect(await findAllByTestId('item')).toHaveLength(3)
  })

  test('获取地址列表后，会抛出 fetch 事件，如果列表不为空，参数为 true', async () => {
    const { emitted } = render(AddressList, {
      global: {
        provide: {
          store,
        },
      },
    })

    await waitFor(() => expect(emitted()).toHaveProperty('fetch'))
    expect(emitted('fetch')[0]).toEqual([true])
  })

  test('获取地址列表后，会抛出 fetch 事件，如果列表为空，参数为 false', async () => {
    mockedAddressInfoList.length = 0
    const { emitted } = render(AddressList, {
      global: {
        provide: {
          store,
        },
      },
    })

    await waitFor(() => expect(emitted()).toHaveProperty('fetch'))
    expect(emitted('fetch')[0]).toEqual([false])
  })

  test('地址列表项变化时，会抛出 fetch 事件，如果列表项数减少到 0 ，事件参数为 false ，否则为 true', async () => {
    const { emitted } = render(AddressList, {
      global: {
        provide: {
          store,
        },
      },
    })
    await waitFor(() => expect(emitted('fetch')).toHaveLength(2))

    store.state.addressInfoList.pop()
    await waitFor(() => expect(emitted('fetch')).toHaveLength(3))
    expect(emitted('fetch')[2]).toEqual([true])

    store.state.addressInfoList.pop()
    await waitFor(() => expect(emitted('fetch')).toHaveLength(4))
    expect(emitted('fetch')[3]).toEqual([true])

    store.state.addressInfoList.pop()
    await waitFor(() => expect(emitted('fetch')).toHaveLength(5))
    expect(emitted('fetch')[4]).toEqual([false])
  })

  test('监听到 Item 组件的 longTouch 事件后弹出弹窗，点击确定即可删除该 Item', async () => {
    mockedAddressInfoList.splice(0, 2)
    // eslint-disable-next-line vue/one-component-per-file
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
    const { findAllByTestId, queryAllByTestId } = render(AddressList, {
      global: {
        provide: {
          store,
        },
        stubs: {
          AddressListItem,
        },
      },
    })
    expect(await findAllByTestId('item')).toHaveLength(1)

    await fireEvent.click(getByContainerText(document.body, '确认'))

    await waitFor(() => expect(queryAllByTestId('item')).toHaveLength(0))
  })

  test('监听到 Item 组件的 longTouch 事件后弹出弹窗，点击取消不会删除该列表项', async () => {
    mockedAddressInfoList.splice(0, 2)
    // eslint-disable-next-line vue/one-component-per-file
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
    const { findAllByTestId, queryAllByTestId } = render(AddressList, {
      global: {
        provide: {
          store,
        },
        stubs: {
          AddressListItem,
        },
      },
    })
    expect(await findAllByTestId('item')).toHaveLength(1)

    await fireEvent.click(getByContainerText(document.body, '取消'))

    await waitFor(() => expect(queryAllByTestId('item')).toHaveLength(1))
  })
})
