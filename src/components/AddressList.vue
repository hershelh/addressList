<script setup lang="ts">
import { Dialog, Toast } from 'vant'
import 'vant/es/Toast/style'
import AddressListItem from './AddressListItem.vue'
import addressStore from '~/store/address'
import 'vant/es/dialog/style'

const emits = defineEmits<{
  (e: 'fetch', fetchStatus: boolean): void
}>()

const addressInfoList = computed(() => addressStore.state.addressInfoList)
watch(
  () => addressInfoList.value.length,
  (val) => {
    val === 0 ? emits('fetch', false) : emits('fetch', true)
  },
)

// 获取地址列表
addressStore.dispatch('getAddressInfoList')
  .then(() => {
    addressInfoList.value.length !== 0
      ? emits('fetch', true)
      : emits('fetch', false)
  })
  .catch(() => {
    emits('fetch', false)
  })

const deleteAddressListItem = (addressId: string, index: number) => {
  Dialog.confirm({
    title: '提示',
    message: '确认删除？',
  }).then(async () => {
    Toast.loading('删除中...')
    await addressStore.dispatch('deleteAddress', { addressId, index })
    Toast('删除成功! ')
  })
    .catch(() => {
    })
}

onBeforeUnmount(() => {
  addressStore.commit('setAddressInfoList', [])
})
</script>

<template>
  <div class="address-list">
    <template v-for="addressInfo, index in addressInfoList" :key="addressInfo.addressId">
      <AddressListItem
        :address-info="addressInfo"
        :index="index"
        data-test="address-item"
        @long-touch="deleteAddressListItem(addressInfo.addressId as string, index)"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.address-list {
  display: flex;
  flex-flow: column;
  align-items: center;
  gap: 20px;
  height: 80vh;
  background-color: #e3e3e3;
  overflow: scroll;
}
</style>
