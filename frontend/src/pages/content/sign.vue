<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />
    <view class="sd-shooting-star" />

    <view class="content">
      <!-- 自定义导航头 -->
      <view class="page-header">
        <view class="back-sigil" @click="goBack">‹</view>
        <text class="header-title">每日一签</text>
      </view>

      <!-- 抽签前 -->
      <view v-if="!sign && !drawing" class="draw-stage sd-reveal">
        <view class="sd-sigil sd-sigil--lg big-sigil">❂</view>
        <text class="stage-title">今日星签未定</text>
        <text class="stage-desc">星辰已知你的来意，静心一问，抽一支今日之签</text>
        <StardButton variant="gold" size="lg" @click="draw">✦ 诚心抽取</StardButton>
      </view>

      <!-- 抽签动画 -->
      <view v-if="drawing" class="draw-stage sd-reveal">
        <view class="sd-sigil sd-sigil--lg big-sigil spinning">✶</view>
        <text class="stage-desc">星轨运转中…</text>
      </view>

      <!-- 签文卡 -->
      <view v-if="sign" class="sign-card sd-reveal-1">
        <view class="level-badge" :class="`level-${sign.level}`">{{ levelName }}</view>
        <text class="sign-title">{{ sign.title }}</text>
        <view class="poem-wrap">
          <text class="poem">{{ sign.poem }}</text>
        </view>
        <view class="sd-divider" />
        <text class="interp">{{ sign.interpretation }}</text>
        <view class="chips">
          <text class="sd-chip is-gold">宜 {{ sign.luckyAction }}</text>
          <text class="sd-chip is-cinnabar">忌 {{ sign.avoidAction }}</text>
        </view>
        <text v-if="alreadyDrawn" class="again-tip">今日之签已定，明日再来 ✧</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { api } from '@/api'
import StardButton from '@/components/stard-button/stard-button.vue'

const sign = ref<any>(null)
const drawing = ref(false)
const alreadyDrawn = ref(false)

const LEVEL_NAMES = ['', '上上签', '上签', '中上签', '中签', '中下签', '下下签']
const levelName = computed(() => LEVEL_NAMES[sign.value?.level] || '星签')

function getAnonId(): string {
  // #ifdef H5
  let id = localStorage.getItem('sd-anon-id')
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    localStorage.setItem('sd-anon-id', id)
  }
  return id
  // #endif
  // #ifndef H5
  let id = uni.getStorageSync('sd-anon-id') as string
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    uni.setStorageSync('sd-anon-id', id)
  }
  return id
  // #endif
}

async function fetchSign() {
  try {
    const res: any = await api.content.getSignToday(getAnonId())
    if (res.sign) {
      sign.value = res.sign
      alreadyDrawn.value = !!res.alreadyDrawn
    }
  } catch (e) {
    // 静默，等用户主动抽
  }
}

async function draw() {
  drawing.value = true
  try {
    const res: any = await api.content.getSignToday(getAnonId())
    await new Promise((r) => setTimeout(r, 1200)) // 仪式感停顿
    sign.value = res.sign
    alreadyDrawn.value = !!res.alreadyDrawn
  } catch (e: any) {
    uni.showToast({ title: e.message || '抽取失败', icon: 'none' })
  } finally {
    drawing.value = false
  }
}

function goBack() {
  uni.navigateBack({ fail: () => uni.reLaunch({ url: '/pages/index/index' }) })
}

fetchSign()
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: $sd-bg;
}

.content {
  position: relative;
  z-index: 1;
  padding: 0 32rpx calc(env(safe-area-inset-bottom) + 40rpx);
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: calc(env(safe-area-inset-top) + 24rpx) 0 30rpx;

  .back-sigil {
    @include sd-sigil-base();
    width: 64rpx;
    height: 64rpx;
    font-size: 40rpx;
    line-height: 1;
  }

  .header-title {
    font-family: $sd-font-display;
    font-size: 36rpx;
    font-weight: bold;
    letter-spacing: 3rpx;
    @include sd-gold-text();
  }
}

.draw-stage {
  margin-top: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;

  .big-sigil {
    width: 200rpx;
    height: 200rpx;
    font-size: 90rpx;
  }

  .spinning {
    animation: sd-sign-spin 1.2s linear infinite;
  }

  .stage-title {
    font-family: $sd-font-display;
    font-size: 36rpx;
    font-weight: bold;
    color: $sd-text;
    letter-spacing: 3rpx;
  }

  .stage-desc {
    font-size: 26rpx;
    color: $sd-text-2;
    text-align: center;
    line-height: 1.7;
  }
}

@keyframes sd-sign-spin {
  to {
    transform: rotate(360deg);
  }
}

.sign-card {
  @include sd-card-surface(gold);
  margin-top: 40rpx;
  padding: 56rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: $sd-glow-gold;

  .level-badge {
    padding: 8rpx 32rpx;
    border-radius: $sd-radius-pill;
    font-size: 24rpx;
    font-weight: bold;
    margin-bottom: 24rpx;

    &.level-1 { background: $sd-gold-grad; color: $sd-gold-ink; }
    &.level-2 { background: rgba(232, 195, 106, 0.16); color: $sd-gold-bright; border: 1rpx solid rgba(232, 195, 106, 0.4); }
    &.level-3 { background: rgba(139, 124, 232, 0.16); color: $sd-purple-bright; border: 1rpx solid rgba(139, 124, 232, 0.4); }
    &.level-4 { background: $sd-bg-raise; color: $sd-text-2; border: 1rpx solid $sd-stroke; }
    &.level-5 { background: $sd-bg-raise; color: $sd-text-3; border: 1rpx solid $sd-stroke; }
    &.level-6 { background: rgba(237, 90, 107, 0.12); color: $sd-cinnabar-soft; border: 1rpx solid rgba(237, 90, 107, 0.38); }
  }

  .sign-title {
    font-family: $sd-font-display;
    font-size: 30rpx;
    color: $sd-text-2;
    letter-spacing: 4rpx;
    margin-bottom: 26rpx;
  }

  .poem-wrap {
    padding: 30rpx 0;
  }

  .poem {
    font-family: $sd-font-display;
    font-size: 40rpx;
    font-weight: bold;
    color: $sd-text;
    letter-spacing: 6rpx;
    text-align: center;
    line-height: 1.8;
  }

  .interp {
    font-size: 26rpx;
    color: $sd-text-2;
    text-align: center;
    line-height: 1.7;
    margin-bottom: 30rpx;
  }

  .chips {
    display: flex;
    gap: 20rpx;
  }

  .again-tip {
    margin-top: 30rpx;
    font-size: 22rpx;
    color: $sd-text-3;
  }
}
</style>
