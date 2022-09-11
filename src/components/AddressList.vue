<script setup lang="ts">
import { Dialog, Toast } from 'vant'
import { useStore } from 'vuex'
import AddressListItem from './AddressListItem.vue'
import type { AddressState } from '~/types/addressManagement'

const emits = defineEmits<{
  (e: 'fetch', fetchStatus: boolean): void
}>()

const addressStore = useStore<AddressState>()

const addressInfoList = computed(() => addressStore.state.addressInfoList)
watch(
  () => addressInfoList.value.length,
  (val) => {
    emits('fetch', !!val)
  },
)

// 获取地址列表
addressStore.dispatch('getAddressInfoList')
  .then(() => {
    emits('fetch', !!addressInfoList.value.length)
  })
  .catch(() => {
    emits('fetch', false)
  })

const deleteAddressListItem = (addressId: string) => {
  Dialog.confirm({
    title: '提示',
    message: '确认删除？',
  }).then(async () => {
    Toast.loading('删除中...')
    await addressStore.dispatch('deleteAddress', addressId)
    Toast('删除成功! ')
  })
    .catch(() => {
    })
}
</script>

<template>
  <div class="address-list">
    <template v-for="addressInfo in addressInfoList" :key="addressInfo.addressId">
      <AddressListItem
        :address-info="addressInfo"
        data-test="address-item"
        data-testid="item"
        @long-touch="deleteAddressListItem(addressInfo.addressId)"
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
