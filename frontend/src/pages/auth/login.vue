<template>
  <view class="container">
    <!-- 氛围层（星云 + 星野 + 流星，不可交互） -->
    <view class="sd-nebula" />
    <view class="sd-stars" />
    <view class="sd-shooting-star" />

    <view class="content sd-reveal">
      <!-- 品牌区 -->
      <view class="brand">
        <view class="sd-sigil sd-sigil--lg"><text>✦</text></view>
        <text class="brand-name sd-gold-text">星契集</text>
        <text class="brand-slogan">以星为契 · 遇见注定</text>
      </view>

      <!-- 账密登录表单 -->
      <view class="form-card">
        <view class="form-item">
          <text class="label">手机号/邮箱</text>
          <input
            class="input"
            v-model="identifier"
            placeholder="请输入手机号或邮箱"
            placeholder-style="color: #8d95bd"
          />
        </view>

        <view class="form-item">
          <text class="label">密码</text>
          <input
            class="input"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            placeholder-style="color: #8d95bd"
          />
        </view>

        <StardButton variant="gold" size="lg" block :loading="loading" @click="handleLogin">
          <text>✦ 登录</text>
        </StardButton>
      </view>

      <!-- 分隔线 -->
      <view class="divider">
        <view class="line" />
        <text class="divider-text">或</text>
        <view class="line" />
      </view>

      <!-- 微信一键登录 -->
      <StardButton variant="wechat" block :loading="wechatLoading" @click="handleWechatLogin">
        <view class="wechat-inner">
          <image class="wechat-icon" src="/static/wechat.svg" mode="aspectFit" />
          <text>微信登录</text>
        </view>
      </StardButton>

      <!-- 注册跳转 -->
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
import { relaunch } from '@/utils/navigation'
import StardButton from '@/components/stard-button/stard-button.vue'

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

    // reLaunch：清空页面栈并触发全部页面重新挂载，确保首页/我的等页面的登录状态立即同步
    setTimeout(() => {
      relaunch('/pages/index/index')
    }, 600)
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
        relaunch('/pages/index/index')
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
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: $sd-bg;
}

.content {
  position: relative;
  z-index: 1;
  padding: 100rpx 48rpx 48rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx);
}

// 品牌区
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 64rpx;

  .brand-name {
    font-family: $sd-font-display;
    font-size: 56rpx;
    font-weight: bold;
    letter-spacing: 10rpx;
    line-height: 1.2;
    margin: 30rpx 0 14rpx;
    /* 补偿末字字距，保持视觉居中 */
    padding-left: 10rpx;
  }

  .brand-slogan {
    font-size: 24rpx;
    color: $sd-text-3;
    letter-spacing: 4rpx;
  }
}

// 账密登录表单卡片
.form-card {
  @include sd-card-surface();
  padding: 40rpx 36rpx;
  margin-bottom: 40rpx;

  .form-item {
    margin-bottom: 36rpx;

    .label {
      display: block;
      font-size: 26rpx;
      color: $sd-text-2;
      letter-spacing: 2rpx;
      margin-bottom: 14rpx;
    }

    .input {
      width: 100%;
      height: 88rpx;
      box-sizing: border-box;
      background: $sd-bg-raise;
      border: 1rpx solid $sd-stroke;
      border-radius: $sd-radius;
      padding: 0 28rpx;
      font-size: 28rpx;
      color: $sd-text;
      caret-color: $sd-gold-bright;
    }
  }
}

// 分隔线
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;

  .line {
    flex: 1;
    height: 1rpx;
    background: $sd-stroke;
  }

  .divider-text {
    margin: 0 24rpx;
    font-size: 24rpx;
    color: $sd-text-3;
    letter-spacing: 2rpx;
  }
}

// 微信登录按钮内容
.wechat-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;

  .wechat-icon {
    width: 44rpx;
    height: 44rpx;
  }
}

// 注册跳转
.links {
  text-align: center;
  margin-top: 48rpx;

  .link {
    font-size: 26rpx;
    color: $sd-gold;
    letter-spacing: 2rpx;
  }
}
</style>