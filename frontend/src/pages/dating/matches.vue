<template>
  <view class="container">
    <view class="matches">
      <view class="match-card" v-for="item in matches" :key="item.user.id" @click="viewProfile(item.user.id)">
        <view class="match-header">
          <text class="nickname">{{ item.user.nickname || '匿名' }}</text>
          <text class="score">匹配度: {{ item.score }}%</text>
        </view>
        <view class="match-info">
          <text class="info-item" v-if="item.user.zodiacSign">星座: {{ item.user.zodiacSign }}</text>
          <text class="info-item" v-if="item.user.gender">性别: {{ item.user.gender === 'male' ? '男' : '女' }}</text>
        </view>
        <button class="chat-btn" @click.stop="startChat(item.user.id)">聊天</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const matches = ref<any[]>([])
const userStore = useUserStore()

onMounted(() => {
  loadMatches()
})

async function loadMatches() {
  if (!userStore.userInfo?.id) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  try {
    const res: any = await api.dating.matches(userStore.userInfo.id, 10)
    matches.value = res
  } catch (error: any) {
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
  }
}

function viewProfile(userId: string) {
  uni.showToast({ title: '查看用户详情', icon: 'none' })
}

function startChat(userId: string) {
  uni.navigateTo({ url: `/pages/dating/chat?userId=${userId}` })
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}

.matches {
  .match-card {
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .match-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .nickname {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .score {
        font-size: 28rpx;
        color: #667eea;
        font-weight: bold;
      }
    }

    .match-info {
      margin-bottom: 20rpx;

      .info-item {
        display: block;
        font-size: 26rpx;
        color: #666;
        margin-bottom: 10rpx;
      }
    }

    .chat-btn {
      width: 100%;
      height: 70rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12rpx;
      font-size: 28rpx;
    }
  }
}
</style>