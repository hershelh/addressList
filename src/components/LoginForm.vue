<script setup lang="ts">
import type { Login } from '~/types/userManagement'

const router = useRouter()

const loginForm = reactive<Login>({
  username: '',
  password: '',
})

const isSubmitButtonDisabled = ref(false)

const submitLogin = async () => {
  isSubmitButtonDisabled.value = true
  Toast.loading('登录中')
  try {
    const { token } = await login(loginForm)
    localStorage.setItem('token', token)
    Toast('登录成功')
    setTimeout(() => {
      router.replace('/address/shipAddress')
    }, 1000)
  }
  catch {
    isSubmitButtonDisabled.value = false
  }
}
</script>

<template>
  <div class="login-form">
    <van-form class="login-form__body" data-testid="form" @submit="submitLogin">
      <van-cell-group inset>
        <van-field
          v-model="loginForm.username"
          data-test="login__username-input"
          size="large"
          label="用户名"
          placeholder="用户名"
          clearable
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="loginForm.password"
          data-test="login__password-input"
          size="large"
          type="password"
          label="密码"
          placeholder="密码"
          clearable
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div class="login-form__body__submit-button">
        <van-button
          data-test="login__submit-button"
          round
          size="large"
          color="#68cb90"
          native-type="submit"
          type="primary"
          data-testid="button"
          :disabled="isSubmitButtonDisabled"
        >
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 88vw;
  height: 40vh;
  padding: 30px 0;
  border-radius: 25px;
  background-color: #fff;
  &__body {
    display: flex;
    flex-direction: column;
    gap: 150px;
    &__submit-button {
      width: 200px;
      align-self: center;
    }
  }
}
</style>
