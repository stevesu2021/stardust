<template>
  <view class="chat-page">
    <!-- 消息列表区域 -->
    <scroll-view
      class="messages-container"
      scroll-y
      :scroll-into-view="scrollIntoView"
      :scroll-with-animation="true"
    >
      <view class="messages-list">
        <view
          v-for="msg in messages"
          :key="msg.id"
          class="message-item"
          :class="{ 'own': msg.senderId === currentUserId }"
        >
          <view class="message-bubble">
            <text class="message-text">{{ msg.content }}</text>
          </view>
          <text class="message-time">{{ formatTime(msg.createdAt) }}</text>
        </view>

        <!-- 空状态提示 -->
        <view v-if="messages.length === 0" class="empty-state">
          <text class="empty-icon">💬</text>
          <text class="empty-text">开始聊天吧</text>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 - 固定在底部 -->
    <view class="input-container">
      <view class="input-wrapper">
        <input
          class="message-input"
          v-model="messageText"
          placeholder="说点什么..."
          :confirm-type="'send'"
          @confirm="sendMessage"
        />
        <view class="send-btn" @click="sendMessage">
          <text class="send-icon">发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const messages = ref<any[]>([])
const messageText = ref('')
const currentUserId = ref('')
const otherUserId = ref('')
const scrollIntoView = ref('')
const userStore = useUserStore()

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  otherUserId.value = currentPage.options?.otherUserId || currentPage.options?.userId || ''
  currentUserId.value = userStore.userInfo?.id || ''

  if (otherUserId.value) {
    loadMessages()
  }
})

async function loadMessages() {
  try {
    const res: any = await api.dating.messages(currentUserId.value, otherUserId.value)
    messages.value = res
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  } catch (error: any) {
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
  }
}

async function sendMessage() {
  if (!messageText.value.trim()) {
    return
  }

  const content = messageText.value
  messageText.value = ''

  try {
    await api.dating.sendMessage({
      senderId: currentUserId.value,
      receiverId: otherUserId.value,
      content
    })
    await loadMessages()
  } catch (error: any) {
    messageText.value = content // 恢复内容
    uni.showToast({ title: error.message || '发送失败', icon: 'none' })
  }
}

function scrollToBottom() {
  if (messages.value.length > 0) {
    scrollIntoView.value = 'msg-' + messages.value[messages.value.length - 1].id
  }
}

function formatTime(time: string) {
  const date = new Date(time)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style lang="scss" scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 70vh;
  background: #f5f6fa;
}

// 消息列表区域
.messages-container {
  flex: 1;
  overflow: hidden;
}

.messages-list {
  padding: 16rpx;
  min-height: 100%;
}

.message-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20rpx;

  &.own {
    align-items: flex-end;

    .message-bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom-right-radius: 8rpx;
    }

    .message-time {
      text-align: right;
    }
  }

  &:not(.own) {
    align-items: flex-start;

    .message-bubble {
      background: white;
      color: #333;
      border-bottom-left-radius: 8rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    }

    .message-time {
      text-align: left;
    }
  }
}

.message-bubble {
  padding: 16rpx 20rpx;
  border-radius: 16rpx;
  max-width: 70%;
  word-break: break-all;
}

.message-text {
  font-size: 26rpx;
  line-height: 1.5;
}

.message-time {
  font-size: 20rpx;
  color: #999;
  margin-top: 6rpx;
  padding: 0 6rpx;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;

  .empty-icon {
    font-size: 70rpx;
    margin-bottom: 16rpx;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 26rpx;
    color: #999;
  }
}

// 输入区域 - 固定在底部
.input-container {
  flex-shrink: 0;
  background: white;
  border-top: 1rpx solid #e5e5e5;
  padding: 44rpx 20rpx 12rpx 20rpx;
  padding-bottom: calc(12rpx + env(safe-area-inset-bottom));
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.message-input {
  flex: 1;
  height: 64rpx;
  background: #f5f5f5;
  border-radius: 32rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
  color: #333;

  &::placeholder {
    color: #999;
  }
}

.send-btn {
  flex-shrink: 0;
  width: 100rpx;
  height: 64rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.8;
  }

  .send-icon {
    font-size: 24rpx;
    color: white;
    font-weight: 500;
  }
}
</style>
