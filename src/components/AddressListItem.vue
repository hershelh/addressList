<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import type { AddressInfo } from '~/types/addressManagement'
import { encodePhoneNumber } from '~/utils'

const props = defineProps<{
  addressInfo: AddressInfo
}>()
const emits = defineEmits<{
  (e: 'longTouch'): void
}>()

const router = useRouter()
const addressStore = useStore()

// 抛出长按事件
let loop: number
const touchStart = () => {
  loop = setTimeout(() => {
    emits('longTouch')
  }, 1000)
}

const clearTimer = () => {
  clearTimeout(loop)
}

const toEditAddress = () => {
  addressStore.commit('setCurrentAddressId', props.addressInfo.addressId)
  router.push('/address/editAddress?isEdit=true')
}
</script>

<template>
  <div class="address" data-testid="item" @touchstart="touchStart" @touchend="clearTimer" @touchmove="clearTimer" @click="toEditAddress">
    <div class="address__header">
      <div class="address__header__tag-box">
        <van-tag
          v-if="props.addressInfo.defaultFlag"
          size="large"
          type="success"
          color="#82df91"
        >
          默认
        </van-tag>
        <van-tag
          v-if="props.addressInfo.tag !== 0"
          size="large"
          type="success"
          color="#ff975c"
        >
          {{ ['家', '公司', '学校'][props.addressInfo.tag - 1] }}
        </van-tag>
        <span
          class="address__header__title van-ellipsis"
        >
          {{ props.addressInfo.area }}
        </span>
      </div>
    </div>
    <div class="address__body">
      <div class="address__body__detail">
        <span class="address__body__detail__address van-multi-ellipsis--l2">
          {{
            props.addressInfo.detailAddress
          }}
        </span>
        <span class="address__body__detail__name van-ellipsis">
          {{
            props.addressInfo.name
          }}
        </span>
        <span
          class="address__body__detail__phone-number"
        >
          {{ encodePhoneNumber(`${props.addressInfo.mobilePhone}`) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.address {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 22px;
  width: 80vw;
  padding: 18px;
  padding-bottom: 30px;
  border-radius: 10px;
  background-color: #fff;
  &__header {
    display: flex;
    gap: 20px;
    &__tag-box {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    &__title {
      font-weight: 700;
    }
  }
  &__body {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-right: 20px;
    &__detail {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      max-width: 60%;
      color: #a8a8a8;
      font-weight: 700;
      &__address {
        flex-basis: 100%;
      }
      &__name {
        flex: 0 0 4em;
      }
    }
  }
}
</style>
