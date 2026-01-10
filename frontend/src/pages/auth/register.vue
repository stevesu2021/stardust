<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="label">昵称</text>
        <input class="input" v-model="nickname" placeholder="请输入昵称" />
      </view>

      <view class="form-item">
        <text class="label">手机号</text>
        <input class="input" v-model="phone" placeholder="请输入手机号" />
      </view>

      <view class="form-item">
        <text class="label">密码</text>
        <input class="input" v-model="password" type="password" placeholder="请输入密码" />
      </view>

      <view class="form-item">
        <text class="label">性别</text>
        <radio-group @change="onGenderChange">
          <label class="radio">
            <radio value="male" :checked="gender === 'male'" />
            <text>男</text>
          </label>
          <label class="radio">
            <radio value="female" :checked="gender === 'female'" />
            <text>女</text>
          </label>
        </radio-group>
      </view>

      <view class="form-item">
        <text class="label">出生日期</text>
        <picker mode="date" @change="onDateChange">
          <view class="picker">{{ birthDate || '请选择出生日期' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">出生时辰</text>
        <picker mode="selector" :range="hours" @change="onHourChange">
          <view class="picker">{{ birthHour !== null ? hours[birthHour] : '请选择出生时辰' }}</view>
        </picker>
      </view>

      <button class="btn" @click="handleRegister" :loading="loading">注册</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const nickname = ref('')
const phone = ref('')
const password = ref('')
const gender = ref('male')
const birthDate = ref('')
const birthYear = ref(0)
const birthMonth = ref(0)
const birthDay = ref(0)
const birthHour = ref<number | null>(null)
const loading = ref(false)
const userStore = useUserStore()

const hours = [
  '子时 (23:00-01:00)',
  '丑时 (01:00-03:00)',
  '寅时 (03:00-05:00)',
  '卯时 (05:00-07:00)',
  '辰时 (07:00-09:00)',
  '巳时 (09:00-11:00)',
  '午时 (11:00-13:00)',
  '未时 (13:00-15:00)',
  '申时 (15:00-17:00)',
  '酉时 (17:00-19:00)',
  '戌时 (19:00-21:00)',
  '亥时 (21:00-23:00)'
]

function onGenderChange(e: any) {
  gender.value = e.detail.value
}

function onDateChange(e: any) {
  birthDate.value = e.detail.value
  const [year, month, day] = e.detail.value.split('-')
  birthYear.value = parseInt(year)
  birthMonth.value = parseInt(month)
  birthDay.value = parseInt(day)
}

function onHourChange(e: any) {
  birthHour.value = e.detail.value
}

async function handleRegister() {
  if (!nickname.value || !phone.value || !password.value || !birthDate.value || birthHour.value === null) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res: any = await api.auth.register({
      nickname: nickname.value,
      phone: phone.value,
      password: password.value,
      gender: gender.value,
      birthYear: birthYear.value,
      birthMonth: birthMonth.value,
      birthDay: birthDay.value,
      birthHour: birthHour.value
    })
    
    userStore.setToken(res.token)
    userStore.setUserInfo(res.user)
    
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  } catch (error: any) {
    uni.showToast({ title: error.message || '注册失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 60rpx 40rpx;
}

.form {
  .form-item {
    margin-bottom: 40rpx;

    .label {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
    }

    .input {
      width: 100%;
      height: 88rpx;
      background: white;
      border-radius: 12rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
      border: 1rpx solid #e5e5e5;
    }

    .picker {
      width: 100%;
      height: 88rpx;
      background: white;
      border-radius: 12rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
      border: 1rpx solid #e5e5e5;
      line-height: 88rpx;
    }

    .radio {
      margin-right: 40rpx;
      font-size: 28rpx;
    }
  }

  .btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12rpx;
    font-size: 32rpx;
    margin-top: 40rpx;
  }
}
</style>