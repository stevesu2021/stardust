<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="label">手机号/邮箱</text>
        <input class="input" v-model="identifier" placeholder="请输入手机号或邮箱" />
      </view>

      <view class="form-item">
        <text class="label">密码</text>
        <input class="input" v-model="password" type="password" placeholder="请输入密码" />
      </view>

      <button class="btn" @click="handleLogin" :loading="loading">登录</button>

      <view class="links">
        <text class="link" @click="goToRegister">还没有账号？去注册</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const userStore = useUserStore()

async function handleLogin() {
  if (!identifier.value || !password.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res: any = await api.auth.login({
      identifier: identifier.value,
      password: password.value
    })
    
    userStore.setToken(res.token)
    userStore.setUserInfo(res.user)
    
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  } catch (error: any) {
    uni.showToast({ title: error.message || '登录失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function goToRegister() {
  uni.navigateTo({ url: '/pages/auth/register' })
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
    margin-top: 40rpx;

    .link {
      font-size: 28rpx;
      color: #667eea;
    }
  }
}
</style>