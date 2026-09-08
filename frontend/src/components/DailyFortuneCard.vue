<template>
  <view class="fortune-card" @click="goToDetail">
    <view class="fortune-header">
      <view class="fh-left">
        <text class="fh-kicker">✦</text>
        <text class="fortune-title">今日运势</text>
      </view>
      <text class="fortune-date">{{ todayDate }}</text>
    </view>

    <view v-if="loading" class="fortune-loading">
      <LoadingSkeleton :rows="2" height="30rpx" gap="24rpx" />
    </view>

    <view v-else-if="fortune" class="fortune-content">
      <view class="score-section">
        <view class="score-ring" :class="getScoreClass(fortune.overallScore)">
          <text class="score-value">{{ fortune.overallScore }}</text>
          <text class="score-label">分</text>
        </view>
        <view class="score-info">
          <text class="score-summary">{{ fortune.summary }}</text>
        </view>
      </view>

      <view v-if="fortune.precautions" class="precautions">
        <text class="precautions-label">⚠ 注意事项</text>
        <text class="precautions-text">{{ fortune.precautions }}</text>
      </view>

      <view class="fortune-footer">
        <view class="lucky-items" v-if="fortune.luckyColor || fortune.luckyNumber">
          <view class="lucky-item" v-if="fortune.luckyColor">
            <text class="lucky-icon">◈</text>
            <text class="lucky-label">{{ fortune.luckyColor }}</text>
          </view>
          <view class="lucky-item" v-if="fortune.luckyNumber">
            <text class="lucky-icon">✧</text>
            <text class="lucky-label">{{ fortune.luckyNumber }}</text>
          </view>
          <view class="lucky-item" v-if="fortune.luckyDirection">
            <text class="lucky-icon">➤</text>
            <text class="lucky-label">{{ fortune.luckyDirection }}</text>
          </view>
        </view>
        <text class="more-hint">查看详情 ›</text>
      </view>
    </view>

    <view v-else class="fortune-empty">
      <text class="empty-text">轻触卡片，开启今日星象</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'
import LoadingSkeleton from '@/components/loading-skeleton/loading-skeleton.vue'

const fortune = ref<any>(null)
const loading = ref(false)

const todayDate = computed(() => {
  const now = new Date()
  return `${now.getMonth() + 1}月${now.getDate()}日`
})

onMounted(async () => {
  await loadFortune()
})

async function loadFortune() {
  loading.value = true
  try {
    const res: any = await api.dailyFortune.getToday()
    fortune.value = res
  } catch (error: any) {
    console.error('获取今日运势失败:', error)
  } finally {
    loading.value = false
  }
}

function getScoreClass(score: number) {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  return 'normal'
}

function goToDetail() {
  uni.navigateTo({ url: '/pages/daily-fortune/detail' })
}

// 暴露刷新方法给父组件
defineExpose({ refresh: loadFortune })
</script>

<style lang="scss" scoped>
.fortune-card {
  position: relative;
  background:
    radial-gradient(300rpx 200rpx at 12% -20%, rgba(232, 195, 106, 0.14), transparent 70%),
    $sd-bg-elev;
  border: 1rpx solid $sd-stroke;
  border-radius: $sd-radius-lg;
  padding: 30rpx;
  margin-bottom: 8rpx;
  overflow: hidden;

  &:active {
    opacity: 0.9;
  }
}

.fortune-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;

  .fh-left {
    display: flex;
    align-items: center;
    gap: 10rpx;
  }

  .fh-kicker {
    font-size: 22rpx;
    color: $sd-gold;
  }

  .fortune-title {
    font-family: $sd-font-display;
    font-size: 32rpx;
    font-weight: bold;
    color: $sd-gold-bright;
    letter-spacing: 2rpx;
  }

  .fortune-date {
    font-size: 24rpx;
    color: $sd-text-3;
  }
}

.fortune-loading,
.fortune-empty {
  padding: 30rpx 0;

  .empty-text {
    font-size: 26rpx;
    color: $sd-text-3;
  }
}

.fortune-content {
  .score-section {
    display: flex;
    align-items: center;
    gap: 26rpx;
    margin-bottom: 20rpx;
  }

  .score-ring {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: $sd-bg-raise;
    border: 4rpx solid rgba(232, 195, 106, 0.55);

    &.excellent {
      border-color: $sd-gold-bright;
      box-shadow: 0 0 30rpx rgba(232, 195, 106, 0.35);

      .score-value {
        color: $sd-gold-bright;
      }
    }

    &.good {
      border-color: rgba(111, 191, 143, 0.7);

      .score-value {
        color: $sd-wood;
      }
    }

    .score-value {
      font-size: 46rpx;
      font-weight: bold;
      color: $sd-text;
      line-height: 1;
    }

    .score-label {
      font-size: 20rpx;
      color: $sd-text-3;
      margin-top: 4rpx;
    }
  }

  .score-info {
    flex: 1;

    .score-summary {
      font-size: 27rpx;
      color: $sd-text-2;
      line-height: 1.6;
    }
  }

  .precautions {
    background: rgba(237, 90, 107, 0.08);
    border: 1rpx solid rgba(237, 90, 107, 0.22);
    border-radius: $sd-radius-sm;
    padding: 18rpx;
    margin-bottom: 20rpx;

    .precautions-label {
      display: block;
      font-size: 24rpx;
      font-weight: bold;
      color: $sd-cinnabar;
      margin-bottom: 8rpx;
    }

    .precautions-text {
      display: block;
      font-size: 24rpx;
      color: $sd-text-2;
      line-height: 1.6;
    }
  }

  .fortune-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .lucky-items {
    display: flex;
    gap: 14rpx;
  }

  .lucky-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    background: $sd-bg-raise;
    border: 1rpx solid $sd-stroke;
    padding: 8rpx 18rpx;
    border-radius: $sd-radius-pill;

    .lucky-icon {
      font-size: 20rpx;
      color: $sd-gold;
    }

    .lucky-label {
      font-size: 22rpx;
      color: $sd-text-2;
    }
  }

  .more-hint {
    font-size: 24rpx;
    color: $sd-gold;
  }
}
</style>
