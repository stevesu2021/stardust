<template>
  <view class="container">
    <view class="messages">
      <view class="message" v-for="msg in messages" :key="msg.id" :class="{ 'own': msg.senderId === currentUserId }">
        <view class="message-content">
          <text class="text">{{ msg.content }}</text>
        </view>
        <text class="time">{{ formatTime(msg.createdAt) }}</text>
      </view>
    </view>

    <view class="input-area">
      <input class="input" v-model="messageText" placeholder="输入消息..." />
      <button class="send-btn" @click="sendMessage">发送</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const messages = ref<any[]>([])
const messageText = ref('')
const currentUserId = ref('')
const otherUserId = ref('')
const userStore = useUserStore()

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  otherUserId.value = currentPage.options?.userId || ''
  currentUserId.value = userStore.userInfo?.id || ''
  
  if (otherUserId.value) {
    loadMessages()
  }
})

async function loadMessages() {
  try {
    const res: any = await api.dating.messages(currentUserId.value, otherUserId.value)
    messages.value = res
  } catch (error: any) {
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
  }
}

async function sendMessage() {
  if (!messageText.value) {
    return
  }

  try {
    await api.dating.sendMessage({
      senderId: currentUserId.value,
      receiverId: otherUserId.value,
      content: messageText.value
    })
    
    messageText.value = ''
    loadMessages()
  } catch (error: any) {
    uni.showToast({ title: error.message || '发送失败', icon: 'none' })
  }
}

function formatTime(time: string) {
  const date = new Date(time)
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.messages {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;

  .message {
    margin-bottom: 20rpx;

    &.own {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .message-content {
        background: #667eea;
        color: white;
      }
    }

    &:not(.own) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .message-content {
        background: white;
        color: #333;
      }
    }

    .message-content {
      padding: 20rpx;
      border-radius: 12rpx;
      max-width: 70%;

      .text {
        font-size: 28rpx;
        line-height: 1.6;
      }
    }

    .time {
      font-size: 22rpx;
      color: #999;
      margin-top: 10rpx;
    }
  }
}

.input-area {
  display: flex;
  padding: 20rpx;
  background: white;
  border-top: 1rpx solid #e5e5e5;

  .input {
    flex: 1;
    height: 70rpx;
    background: #f5f5f5;
    border-radius: 35rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
    margin-right: 20rpx;
  }

  .send-btn {
    width: 120rpx;
    height: 70rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 35rpx;
    font-size: 28rpx;
  }
}
</style>