<script setup lang="ts">
import AddressForm from '~/components/AddressForm.vue'

const route = useRoute()
const router = useRouter()

const isEdit = route.query.isEdit
const index = route.query.index

const back = () => {
  router.back()
}
</script>

<template>
  <div class="edit-address">
    <van-nav-bar
      title="编辑收货地址"
      left-arrow
      @click-left="back"
    />
    <AddressForm :is-edit="isEdit as string" :index="index as string" class="edit-address__form" />
  </div>
</template>

<style lang="scss" scoped>
.edit-address {
    display: flex;
    flex-flow: column wrap;
    gap: 30px;
    width: 100vw;
    height: 100vh;
    background-color: #e3e3e3;
    box-sizing: border-box;
    &__form {
      align-self: center;
    }
}
</style>
