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
        <picker mode="date" :value="birthDate || '1996-01-01'" @change="onDateChange">
          <view class="picker">{{ birthDate || '请选择出生日期' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">出生时辰</text>
        <picker mode="selector" :range="hours" @change="onHourChange">
          <view class="picker">{{ birthHour !== null ? hours[birthHour] : '请选择出生时辰' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">出生省份</text>
        <picker mode="selector" :range="provinces" @change="onProvinceChange">
          <view class="picker">{{ birthProvince || '请选择出生省份' }}</view>
        </picker>
      </view>

      <button class="btn" @click="handleRegister" :loading="loading">注册</button>

      <view class="links">
        <text class="link" @click="goToLogin">已有账号？去登录</text>
      </view>
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
const birthProvince = ref('')
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

// 中国省级行政区
const provinces = [
  '北京', '天津', '上海', '重庆',
  '河北', '山西', '辽宁', '吉林', '黑龙江',
  '江苏', '浙江', '安徽', '福建', '江西', '山东',
  '河南', '湖北', '湖南', '广东', '海南',
  '四川', '贵州', '云南', '陕西', '甘肃', '青海',
  '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆',
  '香港', '澳门'
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

function onProvinceChange(e: any) {
  birthProvince.value = provinces[e.detail.value]
}

function goToLogin() {
  uni.navigateTo({ url: '/pages/auth/login' })
}

async function handleRegister() {
  // 表单验证
  if (!nickname.value || !nickname.value.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }

  if (!phone.value || !phone.value.trim()) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }

  if (!password.value || password.value.length < 6) {
    uni.showToast({ title: '密码至少6位', icon: 'none' })
    return
  }

  if (!birthDate.value) {
    uni.showToast({ title: '请选择出生日期', icon: 'none' })
    return
  }

  if (birthHour.value === null) {
    uni.showToast({ title: '请选择出生时辰', icon: 'none' })
    return
  }

  if (!birthProvince.value) {
    uni.showToast({ title: '请选择出生省份', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res: any = await api.auth.register({
      nickname: nickname.value.trim(),
      phone: phone.value.trim(),
      password: password.value,
      gender: gender.value,
      birthYear: birthYear.value,
      birthMonth: birthMonth.value,
      birthDay: birthDay.value,
      birthHour: birthHour.value,
      birthProvince: birthProvince.value
    })

    console.log('注册成功，响应数据:', res)

    // 显示成功提示
    uni.showToast({ title: '注册成功，请登录', icon: 'success' })

    // 延迟跳转到登录页面，让用户看到成功提示
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/auth/login' })
    }, 1500)
  } catch (error: any) {
    console.error('注册错误:', error)

    // 提取错误信息
    let errorMsg = '注册失败，请稍后重试'
    if (error.message) {
      errorMsg = error.message
    } else if (error.errMsg) {
      errorMsg = error.errMsg
    } else if (error.data && error.data.message) {
      errorMsg = error.data.message
    }

    uni.showToast({ title: errorMsg, icon: 'none', duration: 3000 })
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

  .links {
    text-align: center;
    margin-top: 30rpx;

    .link {
      font-size: 28rpx;
      color: #667eea;
    }
  }
}
</style>