<template>
  <view class="chat-page">
    <!-- 氛围层（星云 + 星野，不可交互） -->
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <!-- 消息列表区域 -->
    <scroll-view
      class="messages-container"
      scroll-y
      :scroll-into-view="scrollIntoView"
      :scroll-with-animation="true"
    >
      <view class="messages-list sd-reveal">
        <view
          v-for="msg in messages"
          :key="msg.id"
          :id="'msg-' + msg.id"
          class="message-item"
          :class="{ 'own': msg.senderId === currentUserId }"
        >
          <view class="avatar sd-sigil sd-sigil--sm">
            <text>{{ msg.senderId === currentUserId ? '☉' : '☽' }}</text>
          </view>
          <view class="message-main">
            <view class="message-bubble">
              <text class="message-text">{{ msg.content }}</text>
            </view>
            <text class="message-time">{{ formatTime(msg.createdAt) }}</text>
          </view>
        </view>

        <!-- 空状态提示 -->
        <EmptyState v-if="messages.length === 0" icon="✉" title="开始聊天吧" />
      </view>
    </scroll-view>

    <!-- 输入区域 - 悬浮于底部 -->
    <view class="input-container">
      <view class="input-wrapper">
        <input
          class="message-input"
          v-model="messageText"
          placeholder="说点什么..."
          placeholder-style="color: #8d95bd"
          :confirm-type="'send'"
          @confirm="sendMessage"
        />
        <view class="send-btn" @click="sendMessage">
          <text class="send-icon">✦ 发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'
import EmptyState from '@/components/empty-state/empty-state.vue'

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
    // 标记所有来自对方的消息为已读
    markAllAsRead()
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

async function markAllAsRead() {
  try {
    await api.dating.markAllAsRead(otherUserId.value)
  } catch (error) {
    console.error('标记已读失败:', error)
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
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: $sd-bg;

  /* #ifdef H5 */
  height: calc(100vh - var(--window-top, 44px));
  /* #endif */
}

// 消息列表区域
.messages-container {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.messages-list {
  box-sizing: border-box;
  padding: 28rpx 32rpx 48rpx;
}

// 消息条目（sigil 头像 + 气泡）
.message-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-bottom: 30rpx;

  .avatar {
    flex-shrink: 0;
  }

  .message-main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 68%;
  }

  .message-bubble {
    padding: 18rpx 26rpx;
    border-radius: $sd-radius-lg;
    box-shadow: 0 6rpx 18rpx rgba(4, 6, 18, 0.24);
  }

  .message-text {
    font-size: 26rpx;
    line-height: 1.6;
    color: $sd-text;
    word-break: break-all;
  }

  .message-time {
    margin-top: 8rpx;
    padding: 0 6rpx;
    font-size: 20rpx;
    color: $sd-text-3;
  }

  // 我的消息：金调气泡（悬浮面 + 金描边）
  &.own {
    flex-direction: row-reverse;

    .message-main {
      align-items: flex-end;
    }

    .message-bubble {
      background: $sd-bg-raise;
      border: 1rpx solid rgba(232, 195, 106, 0.26);
      border-bottom-right-radius: $sd-radius-sm;
    }
  }

  // 对方消息：卡片面 + 淡描边
  &:not(.own) {
    .message-bubble {
      background: $sd-bg-elev;
      border: 1rpx solid $sd-stroke;
      border-bottom-left-radius: $sd-radius-sm;
    }
  }
}

// 输入区域 - 悬浮于底部
.input-container {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  background: $sd-bg-nav;
  border-top: 1rpx solid $sd-stroke;
  padding: 20rpx 24rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.message-input {
  flex: 1;
  height: 72rpx;
  background: $sd-bg-raise;
  border: 1rpx solid $sd-stroke;
  border-radius: $sd-radius-pill;
  padding: 0 28rpx;
  font-size: 26rpx;
  color: $sd-text;
  caret-color: $sd-gold-bright;

  &::placeholder {
    color: $sd-placeholder;
  }
}

.send-btn {
  flex-shrink: 0;
  min-width: 116rpx;
  height: 72rpx;
  background: $sd-gold-grad;
  border-radius: $sd-radius-pill;
  box-shadow: $sd-glow-gold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:active {
    transform: scale(0.96);
    opacity: 0.88;
  }

  .send-icon {
    font-size: 24rpx;
    font-weight: bold;
    color: $sd-gold-ink;
  }
}
</style>
