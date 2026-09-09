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
        <view class="avatar" @click="showAvatarOptions">
          <image v-if="userInfo?.avatar" :src="userInfo.avatar" class="avatar-image" mode="aspectFill" />
          <text v-else class="avatar-text">{{ userInfo?.nickname?.charAt(0) || 'U' }}</text>
          <view class="avatar-edit-icon">📷</view>
        </view>
        <text class="nickname">{{ userInfo?.nickname || '未设置' }}</text>
        <text class="phone-number" v-if="userInfo?.phone">{{ userInfo.phone }}</text>
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

        <view class="info-item full-width">
          <text class="label">五行命理</text>
          <FiveElementsChart :data="fiveElementsData" v-if="fiveElementsData" />
          <text class="value" v-else>未计算</text>
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
import { onShow } from '@dcloudio/uni-app'
import FiveElementsChart from '@/components/FiveElementsChart.vue'

const userStore = useUserStore()
const userInfo = ref<any>(null)
const loading = ref(false)

// 解析五行数据
const fiveElementsData = computed(() => {
  if (!userInfo.value?.fiveElements) return null
  try {
    return JSON.parse(userInfo.value.fiveElements)
  } catch {
    return null
  }
})

// 计算登录状态
const isLoggedin = computed(() => {
  return !!userStore.token && !!userStore.userInfo
})

onMounted(() => {
  if (isLoggedin.value) {
    userInfo.value = userStore.userInfo
  }
})

onShow(() => {
  // tab 页会被框架缓存（onMounted 只执行一次），每次显示时必须重新同步 store 里的登录状态，
  // 否则在登录页登录成功后切回本页仍显示未登录
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
    // 重新获取完整的用户信息，避免丢失 bio 等字段
    const updatedUser: any = await api.auth.getProfile()
    userInfo.value = updatedUser.user
    userStore.setUserInfo(updatedUser.user)
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

// 显示头像选项
function showAvatarOptions() {
  const items = ['从相册选择', 'AI 生成头像']
  if (userInfo.value?.avatar) {
    items.push('删除头像')
  }

  uni.showActionSheet({
    itemList: items,
    success: (res) => {
      if (res.tapIndex === 0) {
        // 从相册选择
        chooseFromAlbum()
      } else if (res.tapIndex === 1) {
        // AI 生成头像
        generateAiAvatar()
      } else if (res.tapIndex === 2) {
        // 删除头像
        deleteAvatar()
      }
    }
  })
}

// 从相册选择头像
function chooseFromAlbum() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      uploadAvatar(tempFilePath)
    }
  })
}

// 上传头像
async function uploadAvatar(filePath: string) {
  uni.showLoading({ title: '上传中...' })

  try {
    const res: any = await api.avatar.upload(filePath)
    // 添加时间戳防止缓存，确保头像立即更新
    const avatarUrl = res.avatar.includes('?') ? `${res.avatar}&t=${Date.now()}` : `${res.avatar}?t=${Date.now()}`
    // 创建新对象避免响应式问题
    const updatedUser = { ...userInfo.value, avatar: avatarUrl }
    userInfo.value = updatedUser
    userStore.setUserInfo(updatedUser)
    uni.showToast({ title: '上传成功', icon: 'success' })
  } catch (error: any) {
    uni.showToast({ title: error.message || '上传失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

// AI 生成头像
async function generateAiAvatar() {
  uni.showModal({
    title: 'AI 生成头像',
    content: 'AI 将根据您的生日、星座等信息为您生成专属头像，生成过程可能需要 10-30 秒，是否继续？',
    success: (res) => {
      if (res.confirm) {
        doGenerateAiAvatar()
      }
    }
  })
}

// 执行 AI 生成
async function doGenerateAiAvatar() {
  uni.showLoading({ title: 'AI 生成中...', mask: true })

  try {
    const res: any = await api.avatar.generate()
    // 添加时间戳防止缓存，确保头像立即更新
    const avatarUrl = res.avatar.includes('?') ? `${res.avatar}&t=${Date.now()}` : `${res.avatar}?t=${Date.now()}`
    // 创建新对象避免响应式问题
    const updatedUser = { ...userInfo.value, avatar: avatarUrl }
    userInfo.value = updatedUser
    userStore.setUserInfo(updatedUser)
    uni.showToast({ title: '生成成功', icon: 'success' })
  } catch (error: any) {
    uni.showToast({ title: error.message || '生成失败，可以重试', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

// 删除头像
function deleteAvatar() {
  uni.showModal({
    title: '提示',
    content: '确定要删除头像吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await api.user.update(userInfo.value.id, { avatar: null })
          userInfo.value.avatar = null
          userStore.setUserInfo(userInfo.value)
          uni.showToast({ title: '删除成功', icon: 'success' })
        } catch (error: any) {
          uni.showToast({ title: error.message || '删除失败', icon: 'none' })
        }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: $sd-bg;
}

// 未登录状态
.login-required {
  text-align: center;
  padding-top: 120rpx;

  .login-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
    color: $sd-gold;
  }

  .title {
    display: block;
    font-family: $sd-font-display;
    font-size: 48rpx;
    font-weight: bold;
    color: $sd-gold-bright;
    letter-spacing: 4rpx;
    margin-bottom: 20rpx;
  }

  .subtitle {
    display: block;
    font-size: 28rpx;
    color: $sd-text-2;
    margin-bottom: 60rpx;
  }

  .login-options {
    background: $sd-bg-elev;
    border: 1rpx solid $sd-stroke;
    border-radius: $sd-radius-lg;
    padding: 40rpx;
    margin: 0 20rpx;

    .wechat-login-btn {
      width: 100%;
      height: 96rpx;
      background: #07c160;
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
        background: #06ad56;
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
        background: $sd-stroke;
      }

      .divider-text {
        margin: 0 24rpx;
        font-size: 24rpx;
        color: $sd-text-3;
      }
    }

    .btn {
      width: 100%;
      height: 88rpx;
      background: linear-gradient(135deg, $sd-gold-bright 0%, $sd-gold 52%, #c9a558 100%);
      color: $sd-gold-ink;
      border-radius: 12rpx;
      font-size: 32rpx;
      font-weight: bold;

      &::after {
        border: none;
      }
    }

    .register-link {
      margin-top: 30rpx;

      .link-text {
        font-size: 28rpx;
        color: $sd-gold;
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
      background: linear-gradient(135deg, rgba(232, 195, 106, 0.4) 0%, rgba(47, 66, 138, 0.7) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 30rpx;
      overflow: hidden;
      border: 4rpx solid rgba(232, 195, 106, 0.45);
      box-shadow: 0 0 40rpx rgba(232, 195, 106, 0.18);
      position: relative;

      .avatar-image {
        width: 100%;
        height: 100%;
      }

      .avatar-text {
        font-size: 80rpx;
        color: $sd-gold-bright;
        font-weight: bold;
      }

      .avatar-edit-icon {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 48rpx;
        height: 48rpx;
        background: rgba(11, 14, 31, 0.72);
        border: 1rpx solid $sd-stroke-strong;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        color: $sd-gold;
      }
    }

    .nickname {
      font-size: 36rpx;
      font-weight: bold;
      color: $sd-text;
      margin-bottom: 8rpx;
      display: block;
    }

    .phone-number {
      font-size: 24rpx;
      color: $sd-text-3;
      margin-bottom: 8rpx;
      display: block;
    }

    .user-id {
      font-size: 24rpx;
      color: #63d99a;
      background: rgba(7, 193, 96, 0.12);
      border: 1rpx solid rgba(7, 193, 96, 0.3);
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      display: inline-block;
    }
  }

  .info {
    background: $sd-bg-elev;
    border: 1rpx solid $sd-stroke;
    border-radius: $sd-radius-lg;
    padding: 40rpx;
    margin-bottom: 40rpx;

    .info-item {
      margin-bottom: 30rpx;
      padding-bottom: 30rpx;
      border-bottom: 1rpx solid $sd-stroke;

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .label {
        display: block;
        font-size: 28rpx;
        color: $sd-text-3;
        margin-bottom: 10rpx;
      }

      .value {
        display: block;
        font-size: 32rpx;
        color: $sd-text;
        font-weight: bold;
      }

      &.full-width {
        padding-bottom: 40rpx;
      }
    }
  }

  .actions {
    .btn {
      width: 100%;
      height: 88rpx;
      background: linear-gradient(135deg, $sd-gold-bright 0%, $sd-gold 52%, #c9a558 100%);
      color: $sd-gold-ink;
      border-radius: 12rpx;
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;

      &::after {
        border: none;
      }
    }

    .btn-secondary {
      background: $sd-bg-raise;
      color: $sd-text;
      border: 1rpx solid $sd-stroke-strong;
    }

    .btn-wechat {
      background: #07c160;
      color: white;
    }

    .btn-wechat-unbind {
      background: transparent;
      color: #ffb056;
      border: 1rpx solid rgba(255, 152, 0, 0.5);
    }

    .btn-logout {
      background: transparent;
      color: $sd-cinnabar;
      border: 1rpx solid rgba(237, 90, 107, 0.45);
      margin-top: 20rpx;
    }
  }
}
</style>
