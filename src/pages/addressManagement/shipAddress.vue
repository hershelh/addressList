<script setup lang="ts">
import { Dialog, Toast } from 'vant'
import AddressList from '~/components/AddressList.vue'
import 'vant/es/Toast/style'
import 'vant/es/dialog/style'

const router = useRouter()

// 对地址列表数据的获取状态：为 true 表示获取成功，为 false 表示获取失败或列表为空，为 null 表示正在获取
const fetchStatus = ref<boolean | null>(null)
const setFetchStatus = (status: boolean) => {
  fetchStatus.value = status
}

const toAddAddress = () => {
  router.push('/address/editAddress?isEdit=false')
}

const logOut = () => {
  Dialog.confirm({
    title: '提示',
    message: '确定要退出登录吗？',
  }).then(() => {
    Toast.loading('正在退出登录')
    setTimeout(() => {
      localStorage.removeItem('token')
      router.replace('/')
    }, 2000)
  })
    .catch(() => {
    })
}
</script>

<template>
  <div class="ship-address">
    <van-nav-bar
      class="ship-address__nav-bar"
      title="我的收货地址"
      right-text="退出登录"
      @click-right="logOut"
    />
    <keep-alive>
      <AddressList v-show="fetchStatus" data-test="address-list" @fetch="setFetchStatus" />
    </keep-alive>
    <van-skeleton
      class="ship-address__skeleton"
      title
      row="10"
      :loading="fetchStatus === null"
    />
    <van-empty v-if="fetchStatus === false" data-test="address-empty" description="列表空空如也" />
    <van-button
      v-if="fetchStatus !== null"
      class="ship-address__button"
      size="normal"
      round
      color="#68cb90"
      type="primary"
      @click="toAddAddress"
    >
      新增地址
    </van-button>
  </div>
</template>

<style scoped lang="scss">
.ship-address {
  height: 100vh;
  background-color: #e3e3e3;
  box-sizing: border-box;

  &__nav-bar {
    margin-bottom: 25px;
  }

  &__skeleton {
    :deep(.van-skeleton .van-skeleton__content) {
      .van-skeleton__title,
      .van-skeleton__row {
        background-color: #fff;
      }
    }
  }

  &__button {
    position: fixed;
    bottom: 4vh;
    left: 50%;
    font-size: 20px;
    transform: translateX(-50%);
  }

  :deep(.van-button--normal) {
     width: 180px;
  }
}
</style>
