import { createStore } from 'vuex'
import type { AddressForm, AddressInfo } from '../types/addressManagement'
import {
  addAddress,
  deleteAddress,
  editAddress,
  getAddressList,
} from '~/api/addressManagement'

interface State {
  addressInfoList: AddressInfo[]
  currentAddressInfo: AddressInfo
}

export default createStore<State>({
  state() {
    return {
      addressInfoList: [],
      currentAddressInfo: {
        addressId: '',
        name: '',
        mobilePhone: '',
        detailAddress: '',
        area: '',
        tag: 0,
        defaultFlag: false,
      },
    }
  },

  mutations: {
    setAddressInfoList(
      state,
      addressInfoList: State['addressInfoList'],
    ) {
      state.addressInfoList = addressInfoList
    },

    updateAddressInfoList(
      state,
      payload: { index: number; addressInfo: AddressInfo },
    ) {
      state.addressInfoList[payload.index] = payload.addressInfo
    },

    deleteAddressInfoListItem(
      state,
      payload: number,
    ) {
      state.addressInfoList.splice(payload, 1)
    },

    setCurrentAddressInfo(state, addressInfo: State['currentAddressInfo']) {
      state.currentAddressInfo = addressInfo
    },

    resetCurrentAddressInfo(state) {
      state.currentAddressInfo = {
        addressId: '',
        name: '',
        mobilePhone: '',
        detailAddress: '',
        area: '',
        tag: 0,
        defaultFlag: false,
      }
    },
  },

  actions: {
    async getAddressInfoList({ commit }) {
      const data = await getAddressList()
      commit('setAddressInfoList', data)
    },

    async addAddress({ state, commit }, payload: AddressForm) {
      const { addressId } = await addAddress(payload)
      commit('updateAddressInfoList', {
        index: state.addressInfoList.length,
        addressInfo: {
          addressId,
          ...payload,
        },
      })
    },

    async editAddress({ commit }, payload: { index: number; addressInfo: AddressInfo }) {
      await editAddress(payload.addressInfo)
      commit('updateAddressInfoList', payload.addressInfo)
    },

    async deleteAddress({ commit }, payload: { addressId: string; index: number }) {
      await deleteAddress(payload.addressId)
      commit('deleteAddressInfoListItem', payload.index)
    },
  },
})
