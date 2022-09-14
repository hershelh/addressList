import { acceptHMRUpdate, defineStore } from 'pinia'
import type { AddressForm, AddressInfo } from '../types/addressManagement'
import {
  addAddress as add,
  deleteAddress as del,
  editAddress as edit,
  getAddressList,
} from '~/api/addressManagement'

export const useAddressStore = defineStore('address', () => {
  const addressInfoList = ref<AddressInfo[]>([])
  const currentAddressId = ref<AddressInfo['addressId']>('')

  const currentAddressInfo = computed(() => {
    return addressInfoList.value.find(({ addressId }) => addressId === currentAddressId.value)
  })

  const getAddressInfoList = async () => {
    const data = await getAddressList()
    addressInfoList.value = data
  }

  const addAddress = async (addressForm: AddressForm) => {
    const { addressId } = await add(addressForm)
    const index = addressInfoList.value.length
    addressInfoList.value[index] = { ...addressForm, addressId }
  }

  const editAddress = async (addressInfo: AddressInfo) => {
    await edit(addressInfo)
    const index = addressInfoList.value.findIndex(({ addressId }) => addressId === addressInfo.addressId)
    addressInfoList.value[index] = addressInfo
  }

  const deleteAddress = async (addressId: AddressInfo['addressId']) => {
    await del(addressId)
    const index = addressInfoList.value.findIndex(({ addressId: id }) => addressId === id)
    addressInfoList.value.splice(index, 1)
  }

  return {
    addressInfoList,
    currentAddressId,
    currentAddressInfo,
    getAddressInfoList,
    addAddress,
    editAddress,
    deleteAddress,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAddressStore, import.meta.hot))
