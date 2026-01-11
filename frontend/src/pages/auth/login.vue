<template>
  <view class="container">
    <!-- 微信登录区域 -->
    <view class="wechat-section">
      <view class="wechat-login-btn" @click="handleWechatLogin">
        <image class="wechat-icon" src="/static/wechat.svg" mode="aspectFit" />
        <text>微信登录</text>
      </view>
      <view class="divider">
        <view class="line"></view>
        <text class="divider-text">或</text>
        <view class="line"></view>
      </view>
    </view>

    <!-- 传统登录表单 -->
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
const wechatLoading = ref(false)
const userStore = useUserStore()

async function handleLogin() {
  // 表单验证
  if (!identifier.value || !identifier.value.trim()) {
    uni.showToast({ title: '请输入手机号或邮箱', icon: 'none' })
    return
  }

  if (!password.value || password.value.length < 6) {
    uni.showToast({ title: '请输入正确密码', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res: any = await api.auth.login({
      identifier: identifier.value.trim(),
      password: password.value
    })

    // 保存登录状态
    userStore.setToken(res.token)
    userStore.setUserInfo(res.user)

    uni.showToast({ title: '登录成功', icon: 'success' })

    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1000)
  } catch (error: any) {
    console.error('登录错误:', error)

    // 提取错误信息
    let errorMsg = '登录失败，请稍后重试'
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

async function handleWechatLogin() {
  wechatLoading.value = true

  try {
    // 获取微信登录code
    const loginRes: any = await new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject
      })
    })

    // 获取用户信息
    const userInfoRes: any = await new Promise((resolve, reject) => {
      uni.getUserProfile({
        desc: '用于完善用户资料',
        success: resolve,
        fail: reject
      })
    })

    // 调用微信登录API
    const res: any = await api.auth.wechatLogin({
      code: loginRes.code,
      userInfo: userInfoRes.userInfo
    })

    // 保存登录状态
    userStore.setToken(res.token)
    userStore.setUserInfo(res.user)

    if (res.isNewUser) {
      uni.showToast({ title: '欢迎新用户！', icon: 'success' })
      // 新用户引导完善资料
      setTimeout(() => {
        uni.navigateTo({ url: '/pages/user/edit-profile' })
      }, 1500)
    } else {
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        uni.switchTab({ url: '/pages/index/index' })
      }, 1000)
    }
  } catch (error: any) {
    console.error('微信登录错误:', error)

    if (error.errMsg && error.errMsg.includes('getUserProfile:fail')) {
      uni.showToast({ title: '需要授权才能使用微信登录', icon: 'none' })
    } else {
      // 提取错误信息
      let errorMsg = '微信登录失败'
      if (error.message) {
        errorMsg = error.message
      } else if (error.data && error.data.message) {
        errorMsg = error.data.message
      }
      uni.showToast({ title: errorMsg, icon: 'none', duration: 3000 })
    }
  } finally {
    wechatLoading.value = false
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

// 微信登录区域
.wechat-section {
  margin-bottom: 60rpx;

  .wechat-login-btn {
    width: 100%;
    height: 96rpx;
    background: #07C160;
    color: white;
    border-radius: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
    box-shadow: 0 4rpx 20rpx rgba(7, 193, 96, 0.3);
    transition: all 0.3s;

    &:active {
      transform: scale(0.98);
      background: #06AD56;
    }

    .wechat-icon {
      width: 48rpx;
      height: 48rpx;
      margin-right: 12rpx;
    }
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 40rpx 0;

    .line {
      flex: 1;
      height: 1rpx;
      background: #e5e5e5;
    }

    .divider-text {
      margin: 0 24rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
}

// 传统登录表单
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