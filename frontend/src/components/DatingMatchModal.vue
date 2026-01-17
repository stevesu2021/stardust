<template>
  <view class="match-modal" v-if="visible" @tap="closeModal">
    <view class="modal-content" @tap.stop>
      <!-- 关闭按钮 -->
      <view class="close-btn" @tap="closeModal">
        <text class="close-icon">×</text>
      </view>

      <!-- 标题 -->
      <view class="modal-header">
        <text class="header-icon">💕</text>
        <text class="header-title">缘分匹配</text>
        <text class="header-subtitle">从100位异性中为你精选最佳匹配</text>
      </view>

      <!-- 加载状态 -->
      <view class="loading-container" v-if="loading">
        <view class="loading-spinner"></view>
        <text class="loading-text">正在为你寻找最佳缘分...</text>
      </view>

      <!-- 匹配结果 -->
      <view class="match-results" v-else-if="matches.length > 0">
        <view
          v-for="(match, index) in matches"
          :key="match.user.id"
          class="match-card"
          :class="`card-${index}`"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          <!-- 排名徽章 -->
          <view class="rank-badge" :class="`rank-${index}`">
            <text class="rank-number">{{ index + 1 }}</text>
          </view>

          <!-- 匹配度分数 -->
          <view class="match-score" :class="`score-${index}`">
            <text class="score-value">{{ match.score }}</text>
            <text class="score-label">%</text>
          </view>

          <!-- 用户头像 -->
          <view class="avatar-section">
            <image
              v-if="match.user.avatar"
              :src="match.user.avatar"
              class="user-avatar"
              mode="aspectFill"
            />
            <view v-else class="user-avatar placeholder">
              <text class="avatar-text">{{ match.user.nickname?.[0] || '?' }}</text>
            </view>
            <!-- 星座图标 -->
            <view class="zodiac-icon">{{ getZodiacIcon(match.user.zodiacSign) }}</view>
          </view>

          <!-- 用户信息 -->
          <view class="user-info">
            <text class="user-name">{{ match.user.nickname || '匿名用户' }}</text>
            <view class="user-tags">
              <text class="tag zodiac-tag">{{ match.user.zodiacSign || '未知星座' }}</text>
              <text class="tag gender-tag">
                {{ match.user.gender === 'male' ? '♂ 男' : '♀ 女' }}
              </text>
            </view>
            <text class="user-bio" v-if="match.user.bio">{{ match.user.bio }}</text>
          </view>

          <!-- 聊天按钮 -->
          <view class="chat-btn" @tap="startChat(match.user)">
            <text class="chat-icon">💬</text>
            <text class="chat-text">发起聊天</text>
          </view>
        </view>
      </view>

      <!-- 无结果状态 -->
      <view class="no-results" v-else>
        <text class="no-results-icon">😔</text>
        <text class="no-results-text">暂无匹配用户</text>
        <text class="no-results-hint">请先完善您的个人资料</text>
      </view>

      <!-- 底部提示 -->
      <view class="modal-footer" v-if="!loading && matches.length > 0">
        <text class="footer-text">基于星座配对 + 五行八字综合计算</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  startChat: [userId: string]
}>()

const loading = ref(false)
const matches = ref<any[]>([])

// 星座图标映射
const zodiacIcons: Record<string, string> = {
  '白羊座': '♈',
  '金牛座': '♉',
  '双子座': '♊',
  '巨蟹座': '♋',
  '狮子座': '♌',
  '处女座': '♍',
  '天秤座': '♎',
  '天蝎座': '♏',
  '射手座': '♐',
  '摩羯座': '♑',
  '水瓶座': '♒',
  '双鱼座': '♓'
}

function getZodiacIcon(sign: string) {
  return zodiacIcons[sign] || '⭐'
}

async function loadMatches() {
  loading.value = true
  matches.value = []
  try {
    const result: any = await api.dating.topMatches()
    matches.value = result
  } catch (error: any) {
    uni.showToast({
      title: error.message || '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function closeModal() {
  emit('close')
}

function startChat(user: any) {
  emit('startChat', user.id)
  closeModal()
}

// 监听显示状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadMatches()
  }
})

import { watch } from 'vue'
</script>

<style lang="scss" scoped>
.match-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  width: 680rpx;
  max-height: 80vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 32rpx;
  padding: 40rpx 30rpx;
  position: relative;
  overflow-y: auto;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  .close-icon {
    font-size: 60rpx;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1;
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 40rpx;

  .header-icon {
    display: block;
    font-size: 80rpx;
    margin-bottom: 16rpx;
    animation: heartbeat 1.5s ease-in-out infinite;
  }

  @keyframes heartbeat {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  .header-title {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 8rpx;
  }

  .header-subtitle {
    display: block;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.6);
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;

  .loading-spinner {
    width: 80rpx;
    height: 80rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.1);
    border-top-color: #ff6b9d;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    margin-top: 24rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.match-results {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.match-card {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 24rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  animation: cardAppear 0.5s ease forwards;
  opacity: 0;

  &.card-0 {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 107, 157, 0.15) 100%);
    border-color: rgba(255, 215, 0, 0.3);
  }

  &.card-1 {
    background: linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(156, 39, 176, 0.15) 100%);
    border-color: rgba(192, 192, 192, 0.3);
  }

  &.card-2 {
    background: linear-gradient(135deg, rgba(205, 127, 50, 0.15) 0%, rgba(255, 87, 34, 0.15) 100%);
    border-color: rgba(205, 127, 50, 0.3);
  }
}

@keyframes cardAppear {
  from {
    transform: translateY(40rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.rank-badge {
  position: absolute;
  top: -8rpx;
  left: -8rpx;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24rpx;
  z-index: 2;

  &.rank-0 {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    box-shadow: 0 4rpx 12rpx rgba(255, 215, 0, 0.5);
    .rank-number {
      color: #8b4513;
    }
  }

  &.rank-1 {
    background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
    box-shadow: 0 4rpx 12rpx rgba(192, 192, 192, 0.5);
    .rank-number {
      color: #555;
    }
  }

  &.rank-2 {
    background: linear-gradient(135deg, #cd7f32 0%, #ffa726 100%);
    box-shadow: 0 4rpx 12rpx rgba(205, 127, 50, 0.5);
    .rank-number {
      color: #fff;
    }
  }
}

.match-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  flex-shrink: 0;

  &.score-0 {
    background: linear-gradient(135deg, #ffd700 0%, #ff6b9d 100%);
  }

  &.score-1 {
    background: linear-gradient(135deg, #c0c0c0 0%, #9c27b0 100%);
  }

  &.score-2 {
    background: linear-gradient(135deg, #cd7f32 0%, #ff5722 100%);
  }

  .score-value {
    font-size: 32rpx;
    font-weight: bold;
    color: #fff;
    line-height: 1;
  }

  .score-label {
    font-size: 16rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.avatar-section {
  position: relative;
  flex-shrink: 0;

  .user-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    border: 3rpx solid rgba(255, 255, 255, 0.2);

    &.placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar-text {
        font-size: 40rpx;
        font-weight: bold;
        color: #fff;
      }
    }
  }

  .zodiac-icon {
    position: absolute;
    bottom: -4rpx;
    right: -4rpx;
    width: 36rpx;
    height: 36rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.3);
  }
}

.user-info {
  flex: 1;
  min-width: 0;

  .user-name {
    display: block;
    font-size: 28rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 8rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-tags {
    display: flex;
    gap: 8rpx;
    margin-bottom: 8rpx;

    .tag {
      padding: 4rpx 12rpx;
      border-radius: 12rpx;
      font-size: 20rpx;

      &.zodiac-tag {
        background: rgba(103, 126, 234, 0.3);
        color: #a8b4ff;
      }

      &.gender-tag {
        background: rgba(255, 107, 157, 0.3);
        color: #ffb3d1;
      }
    }
  }

  .user-bio {
    display: block;
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.6);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.chat-btn {
  padding: 16rpx 24rpx;
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;

  &:active {
    opacity: 0.8;
  }

  .chat-icon {
    font-size: 28rpx;
  }

  .chat-text {
    font-size: 24rpx;
    color: #fff;
    font-weight: bold;
  }
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;

  .no-results-icon {
    font-size: 100rpx;
    margin-bottom: 24rpx;
  }

  .no-results-text {
    font-size: 28rpx;
    color: #fff;
    margin-bottom: 12rpx;
  }

  .no-results-hint {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.6);
  }
}

.modal-footer {
  text-align: center;
  margin-top: 32rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);

  .footer-text {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
