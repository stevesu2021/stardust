<template>
  <view class="match-modal" v-if="visible" @tap="closeModal">
    <view class="modal-content" @tap.stop>
      <!-- 关闭按钮 -->
      <view class="close-btn" @tap="closeModal">
        <text class="close-icon">×</text>
      </view>

      <!-- 标题 -->
      <view class="modal-header">
        <view class="sd-sigil sd-sigil--cinnabar sd-sigil--lg modal-sigil">
          <text>❥</text>
        </view>
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
          <StardButton variant="cinnabar" size="sm" class="chat-btn" @click="startChat(match.user)">
            ✉ 发起聊天
          </StardButton>
        </view>
      </view>

      <!-- 无结果状态 -->
      <view class="no-results" v-else>
        <text class="no-results-icon">✧</text>
        <text class="no-results-text">暂无匹配用户</text>
        <text class="no-results-hint">请先完善您的个人资料</text>
      </view>

      <!-- 底部提示 -->
      <view class="modal-footer" v-if="!loading && matches.length > 0">
        <text class="footer-text">✧ 基于星座配对 + 五行八字综合计算</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api'
import StardButton from '@/components/stard-button/stard-button.vue'

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
  return zodiacIcons[sign] || '✧'
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
  background: rgba(4, 6, 18, 0.72);
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

/* 弹窗卡片：星夜卡面 + 顶部金渐变光带 */
.modal-content {
  width: 680rpx;
  max-height: 80vh;
  padding: 44rpx 30rpx 36rpx;
  position: relative;
  overflow-y: auto;
  animation: slideUp 0.4s ease;
  @include sd-card-surface();

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4rpx;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(232, 195, 106, 0.9) 32%,
      rgba(232, 195, 106, 0.35) 68%,
      transparent 100%
    );
    box-shadow: 0 0 24rpx rgba(232, 195, 106, 0.45);
  }
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
    font-size: 56rpx;
    color: $sd-text-3;
    line-height: 1;
  }

  &:active {
    opacity: 0.7;
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 36rpx;

  .modal-sigil {
    margin: 0 auto 16rpx;
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
    font-family: $sd-font-display;
    font-size: 40rpx;
    font-weight: bold;
    letter-spacing: 4rpx;
    margin-bottom: 8rpx;
    @include sd-gold-text();
  }

  .header-subtitle {
    display: block;
    font-size: 24rpx;
    color: $sd-text-3;
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
    border: 4rpx solid $sd-stroke;
    border-top-color: $sd-cinnabar;
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
    color: $sd-text-2;
  }
}

.match-results {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.match-card {
  position: relative;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  animation: cardAppear 0.5s ease forwards;
  opacity: 0;
  @include sd-card-surface();

  &.card-0 {
    border-color: rgba(237, 90, 107, 0.4);
    background:
      linear-gradient(160deg, rgba(237, 90, 107, 0.1) 0%, rgba(237, 90, 107, 0.02) 46%),
      $sd-card-grad;
    box-shadow: $sd-glow-cinnabar;
  }

  &.card-1 {
    border-color: $sd-stroke-strong;
  }

  &.card-2 {
    border-color: $sd-stroke-strong;
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

/* 排名徽章：金 → 银 → 铜 */
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
    background: $sd-gold-grad;
    box-shadow: 0 4rpx 16rpx rgba(232, 195, 106, 0.45);

    .rank-number {
      color: $sd-gold-ink;
    }
  }

  &.rank-1 {
    background: linear-gradient(135deg, rgba(237, 239, 250, 0.92) 0%, rgba(166, 174, 203, 0.85) 100%);
    box-shadow: 0 4rpx 16rpx rgba(166, 174, 203, 0.4);

    .rank-number {
      color: $sd-bg-nav;
    }
  }

  &.rank-2 {
    background: linear-gradient(135deg, rgba(192, 154, 107, 0.95) 0%, rgba(184, 148, 74, 0.85) 100%);
    box-shadow: 0 4rpx 16rpx rgba(184, 148, 74, 0.4);

    .rank-number {
      color: $sd-gold-ink;
    }
  }
}

/* 匹配度分数 */
.match-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  flex-shrink: 0;
  background:
    radial-gradient(circle at 50% 34%, rgba(232, 195, 106, 0.18) 0%, rgba(232, 195, 106, 0.04) 58%, transparent 72%),
    $sd-bg-raise;
  border: 1rpx solid rgba(232, 195, 106, 0.4);

  &.score-0 {
    border-color: rgba(232, 195, 106, 0.58);
    box-shadow: $sd-glow-gold;
  }

  &.score-1 {
    border-color: rgba(232, 195, 106, 0.42);
  }

  &.score-2 {
    border-color: rgba(232, 195, 106, 0.34);
  }

  .score-value {
    font-size: 30rpx;
    font-weight: bold;
    color: $sd-gold-bright;
    line-height: 1;
  }

  .score-label {
    font-size: 16rpx;
    color: $sd-text-3;
    line-height: 1;
  }
}

.avatar-section {
  position: relative;
  flex-shrink: 0;

  .user-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    border: 3rpx solid rgba(232, 195, 106, 0.35);

    &.placeholder {
      background: linear-gradient(135deg, rgba(232, 195, 106, 0.35) 0%, rgba(47, 66, 138, 0.6) 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar-text {
        font-size: 40rpx;
        font-weight: bold;
        color: $sd-gold-bright;
      }
    }
  }

  .zodiac-icon {
    position: absolute;
    bottom: -4rpx;
    right: -4rpx;
    width: 36rpx;
    height: 36rpx;
    background: rgba(11, 14, 31, 0.78);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20rpx;
    color: $sd-gold-bright;
    border: 2rpx solid rgba(232, 195, 106, 0.45);
  }
}

.user-info {
  flex: 1;
  min-width: 0;

  .user-name {
    display: block;
    font-size: 28rpx;
    font-weight: bold;
    color: $sd-text;
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
        background: rgba(139, 124, 232, 0.16);
        color: $sd-purple-bright;
      }

      &.gender-tag {
        background: rgba(237, 90, 107, 0.14);
        color: $sd-cinnabar-soft;
      }
    }
  }

  .user-bio {
    display: block;
    font-size: 22rpx;
    color: $sd-text-3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.chat-btn {
  flex-shrink: 0;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;

  .no-results-icon {
    font-size: 100rpx;
    margin-bottom: 24rpx;
    color: $sd-gold;
    opacity: 0.6;
  }

  .no-results-text {
    font-size: 28rpx;
    color: $sd-text;
    margin-bottom: 12rpx;
  }

  .no-results-hint {
    font-size: 24rpx;
    color: $sd-text-3;
  }
}

.modal-footer {
  text-align: center;
  margin-top: 32rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid $sd-stroke;

  .footer-text {
    font-size: 22rpx;
    color: $sd-text-3;
  }
}
</style>
