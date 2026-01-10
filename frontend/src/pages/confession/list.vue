<template>
  <view class="container">
    <view class="list">
      <view class="item" v-for="item in list" :key="item.id">
        <view class="item-header">
          <text class="nickname">{{ item.user?.nickname || '匿名' }}</text>
          <text class="time">{{ formatTime(item.createdAt) }}</text>
        </view>
        <view class="item-content">
          <text class="content">{{ item.content }}</text>
          <text class="target">致: {{ item.targetName }}</text>
        </view>
        <view class="item-footer" v-if="item.isMatched">
          <text class="matched">💕 已匹配</text>
        </view>
      </view>
    </view>

    <view class="fab" @click="create">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'

const list = ref<any[]>([])

onMounted(() => {
  loadList()
})

async function loadList() {
  try {
    const res: any = await api.confession.public()
    list.value = res
  } catch (error: any) {
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
  }
}

function create() {
  uni.navigateTo({ url: '/pages/confession/create' })
}

function formatTime(time: string) {
  const date = new Date(time)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}

.list {
  .item {
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .nickname {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
      }

      .time {
        font-size: 24rpx;
        color: #999;
      }
    }

    .item-content {
      margin-bottom: 20rpx;

      .content {
        display: block;
        font-size: 30rpx;
        color: #333;
        margin-bottom: 10rpx;
      }

      .target {
        display: block;
        font-size: 26rpx;
        color: #667eea;
      }
    }

    .item-footer {
      .matched {
        font-size: 26rpx;
        color: #ff6b6b;
      }
    }
  }
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.4);

  .fab-icon {
    font-size: 60rpx;
    color: white;
    line-height: 1;
  }
}
</style>