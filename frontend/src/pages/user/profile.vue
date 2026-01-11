<template>
  <view class="container">
    <!-- 未登录状态 -->
    <view v-if="!isLoggedin" class="login-required">
      <view class="login-icon">👋</view>
      <text class="title">欢迎来到星契集</text>
      <text class="subtitle">登录后享受更多个性化服务</text>

      <view class="login-options">
        <!-- 微信登录按钮 -->
        <view class="wechat-login-btn" @click="handleWechatLogin">
          <text class="wechat-icon">💬</text>
          <text>微信一键登录</text>
        </view>

        <!-- 分隔线 -->
        <view class="divider">
          <view class="line"></view>
          <text class="divider-text">或</text>
          <view class="line"></view>
        </view>

        <!-- 传统登录 -->
        <button class="btn" @click="goToLogin">账号密码登录</button>

        <!-- 注册引导 -->
        <view class="register-link">
          <text class="link-text" @click="goToRegister">还没有账号？立即注册</text>
        </view>
      </view>
    </view>

    <!-- 已登录状态 -->
    <view v-else class="logged-in">
      <view class="profile">
        <view class="avatar">
          <image v-if="userInfo?.avatar" :src="userInfo.avatar" class="avatar-image" mode="aspectFill" />
          <text v-else class="avatar-text">{{ userInfo?.nickname?.charAt(0) || 'U' }}</text>
        </view>
        <text class="nickname">{{ userInfo?.nickname || '未设置' }}</text>
        <text class="user-id" v-if="userInfo?.wechatOpenId">💬 已绑定微信</text>
      </view>

      <view class="info" v-if="userInfo">
        <view class="info-item">
          <text class="label">农历生日</text>
          <text class="value">{{ userInfo.lunarDate || '未计算' }}</text>
        </view>

        <view class="info-item">
          <text class="label">星座</text>
          <text class="value">{{ userInfo.zodiacSign || '未计算' }}</text>
        </view>

        <view class="info-item">
          <text class="label">五行</text>
          <text class="value">{{ userInfo.fiveElements || '未计算' }}</text>
        </view>

        <view class="info-item">
          <text class="label">性别</text>
          <text class="value">{{ userInfo.gender === 'male' ? '男' : userInfo.gender === 'female' ? '女' : '未设置' }}</text>
        </view>

        <view class="info-item">
          <text class="label">个人简介</text>
          <text class="value">{{ userInfo.bio || '未设置' }}</text>
        </view>
      </view>

      <view class="actions">
        <button class="btn" @click="calculateAstrology">计算星盘</button>
        <button class="btn btn-secondary" @click="goToSettings">编辑资料</button>

        <!-- 微信绑定/解绑 -->
        <button v-if="!userInfo?.wechatOpenId" class="btn btn-wechat" @click="handleBindWechat">
          绑定微信账号
        </button>
        <button v-else class="btn btn-wechat-unbind" @click="handleUnbindWechat">
          解绑微信账号
        </button>

        <button class="btn btn-logout" @click="logout">退出登录</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const userInfo = ref<any>(null)
const loading = ref(false)

// 计算登录状态
const isLoggedin = computed(() => {
  return !!userStore.token && !!userStore.userInfo
})

onMounted(() => {
  if (isLoggedin.value) {
    userInfo.value = userStore.userInfo
  }
})

// 微信登录
async function handleWechatLogin() {
  loading.value = true

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

    userStore.setToken(res.token)
    userStore.setUserInfo(res.user)
    userInfo.value = res.user

    if (res.isNewUser) {
      uni.showToast({ title: '欢迎新用户！', icon: 'success' })
      // 新用户需要完善生日信息
      setTimeout(() => {
        uni.navigateTo({ url: '/pages/user/edit-profile' })
      }, 1500)
    } else {
      uni.showToast({ title: '登录成功', icon: 'success' })
    }
  } catch (error: any) {
    if (error.errMsg && error.errMsg.includes('getUserProfile:fail')) {
      uni.showToast({ title: '需要授权才能使用微信登录', icon: 'none' })
    } else {
      uni.showToast({ title: error.message || '微信登录失败', icon: 'none' })
    }
  } finally {
    loading.value = false
  }
}

// 绑定微信
async function handleBindWechat() {
  try {
    const loginRes: any = await new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject
      })
    })

    await api.auth.bindWechat({ code: loginRes.code })

    // 重新获取用户信息
    const profileRes: any = await api.auth.getProfile()
    userStore.setUserInfo(profileRes.user)
    userInfo.value = profileRes.user

    uni.showToast({ title: '微信绑定成功', icon: 'success' })
  } catch (error: any) {
    uni.showToast({ title: error.message || '绑定失败', icon: 'none' })
  }
}

// 解绑微信
async function handleUnbindWechat() {
  uni.showModal({
    title: '提示',
    content: '确定要解绑微信账号吗？解绑后需要绑定其他登录方式',
    success: async (res) => {
      if (res.confirm) {
        try {
          // 调用解绑API
          const res: any = await api.auth.unbindWechat()

          // 更新用户信息
          userStore.setUserInfo(res.user)
          userInfo.value = res.user

          uni.showToast({ title: '解绑成功', icon: 'success' })
        } catch (error: any) {
          uni.showToast({ title: error.message || '解绑失败', icon: 'none' })
        }
      }
    }
  })
}

// 计算星盘
async function calculateAstrology() {
  if (!userInfo.value?.id) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  try {
    const res: any = await api.astrology.calculate(userInfo.value.id)
    userInfo.value = res.user
    userStore.setUserInfo(res.user)
    uni.showToast({ title: '计算成功', icon: 'success' })
  } catch (error: any) {
    uni.showToast({ title: error.message || '计算失败', icon: 'none' })
  }
}

// 退出登录
function logout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/user/profile' })
        }, 1000)
      }
    }
  })
}

// 跳转相关页面
function goToLogin() {
  uni.navigateTo({ url: '/pages/auth/login' })
}

function goToRegister() {
  uni.navigateTo({ url: '/pages/auth/register' })
}

function goToSettings() {
  uni.navigateTo({ url: '/pages/user/edit-profile' })
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: #f8f9fa;
}

// 未登录状态
.login-required {
  text-align: center;
  padding-top: 120rpx;

  .login-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
  }

  .title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }

  .subtitle {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 60rpx;
  }

  .login-options {
    background: white;
    border-radius: 20rpx;
    padding: 40rpx;
    margin: 0 20rpx;

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
      margin-bottom: 30rpx;

      &:active {
        transform: scale(0.98);
        background: #06AD56;
      }

      .wechat-icon {
        font-size: 40rpx;
        margin-right: 12rpx;
      }
    }

    .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 30rpx 0;

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

    .btn {
      width: 100%;
      height: 88rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12rpx;
      font-size: 32rpx;
      font-weight: bold;
    }

    .register-link {
      margin-top: 30rpx;

      .link-text {
        font-size: 28rpx;
        color: #667eea;
      }
    }
  }
}

// 已登录状态
.logged-in {
  .profile {
    text-align: center;
    margin-bottom: 60rpx;

    .avatar {
      width: 160rpx;
      height: 160rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 30rpx;
      overflow: hidden;
      border: 4rpx solid white;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

      .avatar-image {
        width: 100%;
        height: 100%;
      }

      .avatar-text {
        font-size: 80rpx;
        color: white;
        font-weight: bold;
      }
    }

    .nickname {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
    }

    .user-id {
      font-size: 24rpx;
      color: #07C160;
      background: #e8f5e9;
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      display: inline-block;
    }
  }

  .info {
    background: white;
    border-radius: 20rpx;
    padding: 40rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .info-item {
      margin-bottom: 30rpx;
      padding-bottom: 30rpx;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .label {
        display: block;
        font-size: 28rpx;
        color: #999;
        margin-bottom: 10rpx;
      }

      .value {
        display: block;
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
      }
    }
  }

  .actions {
    .btn {
      width: 100%;
      height: 88rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12rpx;
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .btn-secondary {
      background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    }

    .btn-wechat {
      background: #07C160;
    }

    .btn-wechat-unbind {
      background: #ff9800;
    }

    .btn-logout {
      background: #ff6b6b;
      margin-top: 20rpx;
    }
  }
}
</style>