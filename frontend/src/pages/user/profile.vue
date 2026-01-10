<template>
  <view class="container">
    <view class="profile">
      <view class="avatar">
        <text class="avatar-text">{{ userInfo?.nickname?.charAt(0) || 'U' }}</text>
      </view>
      <text class="nickname">{{ userInfo?.nickname || '未设置' }}</text>
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
        <text class="label">性别</text>
        <text class="value">{{ userInfo.gender === 'male' ? '男' : '女' }}</text>
      </view>

      <view class="info-item">
        <text class="label">个人简介</text>
        <text class="value">{{ userInfo.bio || '未设置' }}</text>
      </view>
    </view>

    <view class="actions">
      <button class="btn" @click="calculateAstrology">计算星盘</button>
      <button class="btn btn-logout" @click="logout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const userInfo = ref<any>(null)
const userStore = useUserStore()

onMounted(() => {
  userInfo.value = userStore.userInfo
})

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

function logout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/auth/login' })
        }, 1000)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
}

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
  }
}

.info {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;

  .info-item {
    margin-bottom: 30rpx;

    &:last-child {
      margin-bottom: 0;
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
    margin-bottom: 20rpx;
  }

  .btn-logout {
    background: #ff6b6b;
  }
}
</style>