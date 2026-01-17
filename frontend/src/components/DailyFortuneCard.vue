<template>
  <view class="fortune-card" @click="goToDetail">
    <view class="fortune-header">
      <text class="fortune-title">今日运势</text>
      <text class="fortune-date">{{ todayDate }}</text>
    </view>

    <view v-if="loading" class="fortune-loading">
      <text class="loading-text">加载中...</text>
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
        <text class="precautions-label">⚠️ 注意事项</text>
        <text class="precautions-text">{{ fortune.precautions }}</text>
      </view>

      <view class="fortune-footer">
        <view class="lucky-items" v-if="fortune.luckyColor || fortune.luckyNumber">
          <view class="lucky-item" v-if="fortune.luckyColor">
            <text class="lucky-icon">🎨</text>
            <text class="lucky-label">{{ fortune.luckyColor }}</text>
          </view>
          <view class="lucky-item" v-if="fortune.luckyNumber">
            <text class="lucky-icon">🔢</text>
            <text class="lucky-label">{{ fortune.luckyNumber }}</text>
          </view>
          <view class="lucky-item" v-if="fortune.luckyDirection">
            <text class="lucky-icon">🧭</text>
            <text class="lucky-label">{{ fortune.luckyDirection }}</text>
          </view>
        </view>
        <text class="more-hint">点击查看详情 →</text>
      </view>
    </view>

    <view v-else class="fortune-empty">
      <text class="empty-text">点击查看今日运势</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'

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
defineExpose({
  refresh: loadFortune
})
</script>

<style lang="scss" scoped>
.fortune-card {
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(253, 203, 110, 0.3);
}

.fortune-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;

  .fortune-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #634200;
  }

  .fortune-date {
    font-size: 24rpx;
    color: rgba(99, 66, 0, 0.7);
  }
}

.fortune-loading,
.fortune-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx 0;

  .loading-text,
  .empty-text {
    font-size: 28rpx;
    color: #634200;
  }
}

.fortune-content {
  .score-section {
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-bottom: 20rpx;

    .score-ring {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 4rpx solid #634200;

      &.excellent {
        background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
        border-color: #ff6b6b;
        .score-value { color: white; }
        .score-label { color: rgba(255, 255, 255, 0.9); }
      }

      &.good {
        background: linear-gradient(135deg, #a8e6cf 0%, #55efc4 100%);
        border-color: #55efc4;
        .score-value { color: white; }
        .score-label { color: rgba(255, 255, 255, 0.9); }
      }

      .score-value {
        font-size: 48rpx;
        font-weight: bold;
        color: #634200;
        line-height: 1;
      }

      .score-label {
        font-size: 20rpx;
        color: #634200;
        margin-top: 4rpx;
      }
    }

    .score-info {
      flex: 1;

      .score-summary {
        font-size: 28rpx;
        color: #634200;
        line-height: 1.5;
      }
    }
  }

  .precautions {
    background: rgba(99, 66, 0, 0.08);
    border-radius: 12rpx;
    padding: 16rpx;
    margin-bottom: 20rpx;

    .precautions-label {
      display: block;
      font-size: 24rpx;
      font-weight: bold;
      color: #634200;
      margin-bottom: 8rpx;
    }

    .precautions-text {
      display: block;
      font-size: 24rpx;
      color: rgba(99, 66, 0, 0.8);
      line-height: 1.5;
    }
  }

  .fortune-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .lucky-items {
      display: flex;
      gap: 16rpx;

      .lucky-item {
        display: flex;
        align-items: center;
        gap: 6rpx;
        background: rgba(255, 255, 255, 0.6);
        padding: 8rpx 16rpx;
        border-radius: 20rpx;

        .lucky-icon {
          font-size: 20rpx;
        }

        .lucky-label {
          font-size: 22rpx;
          color: #634200;
        }
      }
    }

    .more-hint {
      font-size: 24rpx;
      color: rgba(99, 66, 0, 0.7);
    }
  }
}
</style>
