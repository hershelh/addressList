import { createStore } from 'vuex'
import type { AddressForm, AddressInfo } from '../types/addressManagement'
import {
  addAddress,
  deleteAddress,
  editAddress,
  getAddressList,
} from '~/api/addressManagement'
import type { AddressState } from '~/types/addressManagement'

export default createStore<AddressState>({
  state() {
    return {
      addressInfoList: [],
      currentAddressId: '',
    }
  },

  getters: {
    currentAddressInfo: (state) => {
      return state.addressInfoList.find(({ addressId }) => addressId === state.currentAddressId)
    },
  },

  mutations: {
    setAddressInfoList(
      state,
      addressInfoList: AddressState['addressInfoList'],
    ) {
      state.addressInfoList = addressInfoList
    },

    updateAddressInfoList(
      state,
      addressInfo: AddressInfo,
    ) {
      const index = state.addressInfoList.findIndex(({ addressId }) => addressId === addressInfo.addressId)
      state.addressInfoList[index] = addressInfo
    },

    deleteAddressInfoListItem(
      state,
      id: AddressInfo['addressId'],
    ) {
      const index = state.addressInfoList.findIndex(({ addressId }) => addressId === id)
      state.addressInfoList.splice(index, 1)
    },

    setCurrentAddressId(state, id: AddressState['currentAddressId']) {
      state.currentAddressId = id
    },
  },

  actions: {
    async getAddressInfoList({ commit }) {
      const data = await getAddressList()
      commit('setAddressInfoList', data)
    },

    async addAddress({ commit }, payload: AddressForm) {
      const { addressId } = await addAddress(payload)
      commit('updateAddressInfoList', {
        addressId,
        ...payload,
      })
    },

    async editAddress({ commit }, addressInfo: AddressInfo) {
      await editAddress(addressInfo)
      commit('updateAddressInfoList', addressInfo)
    },

    async deleteAddress({ commit }, addressId: AddressInfo['addressId']) {
      await deleteAddress(addressId)
      commit('deleteAddressInfoListItem', addressId)
    },
  },
})
