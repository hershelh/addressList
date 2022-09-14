<script setup lang="ts">
import { ref } from 'vue'
import { areaList } from '@vant/area-data'
import { Toast } from 'vant'
import type { AreaColumnOption } from 'vant'
import { useRouter } from 'vue-router'
import { useAddressStore } from '~/stores/address'
import type { AddressForm, AddressInfo } from '~/types/addressManagement'

const props = defineProps<{
  isEdit: string
}>()

const router = useRouter()
const store = useAddressStore()

const addressForm = ref<AddressForm>({
  name: '',
  mobilePhone: '',
  detailAddress: '',
  area: '',
  tag: 0,
  defaultFlag: false,
})

if (props.isEdit === 'true')
  addressForm.value = { ...store.currentAddressInfo as AddressInfo }

const isShowAreaPicker = ref(false)

// 确认选择省市区后，获取各个省市区的 name，并传入 addressForm 对象
const confirmArea = (area: AreaColumnOption[]) => {
  addressForm.value.area = area.reduce((preName, { name }) => preName + name, '')
  isShowAreaPicker.value = false
}

// 表单验证
const formValidator = {
  name: (val: string) => {
    if (!val.length)
      return '请填写收货人姓名'
    return true
  },
  mobilePhone: (val: string) => {
    const phoneReg = /^1[3456789]\d{9}$/
    if (!phoneReg.test(`${addressForm.value.mobilePhone}`))
      return '请输入正确的手机号码'
    return true
  },
  area: (val: string) => {
    if (!val.length)
      return '请选择所在地区'
    return true
  },
  detailAddress: (val: string) => {
    if (!val.length)
      return '请输入详细地址'
    return true
  },
}

const isSubmitButtonDisabled = ref(false)

// 提交表单
const submitAddressForm = async () => {
  isSubmitButtonDisabled.value = true
  Toast.loading('保存中')

  if (props.isEdit === 'true') {
    try {
      await store.editAddress({
        ...addressForm.value,
        addressId: store.currentAddressId,
      })
      Toast('保存成功')
      setTimeout(() => {
        router.back()
      }, 1000)
    }
    catch {
      isSubmitButtonDisabled.value = false
    }
  }
  else {
    try {
      await store.addAddress(addressForm.value)
      Toast('添加成功')
      setTimeout(() => {
        router.back()
      }, 1000)
    }
    catch {
      isSubmitButtonDisabled.value = false
    }
  }
}
</script>

<template>
  <div class="address-form">
    <van-form class="address-form__body" data-testid="form" @submit="submitAddressForm">
      <van-cell-group inset>
        <van-field
          v-model="addressForm.name"
          label="收货人"
          data-test="address-form__name"
          size="large"
          placeholder="请填写收货人姓名"
          clearable
          maxlength="10"
          :rules="[{ validator: formValidator.name }]"
        />
        <van-field
          v-model="addressForm.mobilePhone"
          label="手机号码"
          data-test="address-form__mobile-phone"
          size="large"
          placeholder="手机号码"
          type="tel"
          clearable
          maxlength="11"
          :rules="[{ validator: formValidator.mobilePhone }]"
        />
        <van-field
          :model-value="addressForm.area"
          label="地区选择"
          data-test="address-form__area"
          size="large"
          placeholder="点击选择省市区"
          readonly
          :rules="[{ validator: formValidator.area }]"
          @click-input="isShowAreaPicker = true"
        />
        <van-field
          v-model="addressForm.detailAddress"
          label="详细地址"
          data-test="address-form__detail-address"
          size="large"
          clearable
          type="textarea"
          autosize
          placeholder="详细地址"
          maxlength="30"
          :rules="[{ validator: formValidator.detailAddress }]"
        />
        <van-field label="标签" size="large">
          <template #input>
            <van-radio-group v-model="addressForm.tag" direction="horizontal" checked-color="#68cb90">
              <van-radio :name="0" shape="square" data-test="address-form__tag">
                无
              </van-radio>
              <van-radio :name="1" shape="square" data-test="address-form__tag">
                家
              </van-radio>
              <van-radio :name="2" shape="square" data-test="address-form__tag">
                公司
              </van-radio>
              <van-radio :name="3" shape="square" :style="{ marginTop: '4px' }" data-test="address-form__tag">
                学校
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field label="设置为默认地址" size="large">
          <template #input>
            <van-switch v-model="addressForm.defaultFlag" data-test="address-form__default-flag" size="20" active-color="#68cb90" />
          </template>
        </van-field>
      </van-cell-group>
      <div class="address-form__submit-button">
        <van-button
          data-test="address-form__submit"
          round
          size="large"
          color="#68cb90"
          type="primary"
          native-type="submit"
          :disabled="isSubmitButtonDisabled"
        >
          保存
        </van-button>
      </div>
    </van-form>
    <van-popup
      v-model:show="isShowAreaPicker"
      position="bottom"
      @click-overlay="isShowAreaPicker = false"
    >
      <van-area
        :area-list="areaList"
        title="选择省市区"
        @confirm="confirmArea"
        @cancel="isShowAreaPicker = false"
      />
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.address-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 88vw;
  height: 60vh;
  padding: 30px 0;
  border-radius: 25px;
  background-color: #fff;
  &__body {
    display: flex;
    flex-direction: column;
    gap: 80px;
  }
  &__submit-button {
    width: 200px;
    align-self: center;
  }
}
</style>
