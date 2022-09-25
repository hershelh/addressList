<script setup lang="ts">
const router = useRouter()

if (localStorage.getItem('token')) {
  Toast.loading('自动登录中')
  setTimeout(() => {
    router.replace('/address/shipAddress')
  }, 2000)
}
</script>

<template>
  <div class="index">
    <van-nav-bar
      data-test="login__nav-bar"
      title="登录"
    />
    <LoginForm class="index__login-form" />
  </div>
</template>

<style lang="scss" scoped>
.index {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #e3e3e3;
    box-sizing: border-box;
    &__login-form {
      position: absolute;
      left: 50%;
      top: 20%;
      transform: translate(-50%);
    }
}
</style>

