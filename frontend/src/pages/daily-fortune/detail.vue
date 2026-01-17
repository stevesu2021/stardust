<template>
  <view class="detail-page">
    <view class="header">
      <text class="title">今日运势</text>
      <text class="date">{{ todayDate }}</text>
    </view>

    <view v-if="loading" class="loading">
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="fortune" class="content">
      <!-- 总体得分 -->
      <view class="score-card">
        <view class="score-display" :class="getScoreClass(fortune.overallScore)">
          <text class="score-value">{{ fortune.overallScore }}</text>
          <text class="score-label">总体得分</text>
        </view>
        <view class="score-summary">
          <text class="summary-text">{{ fortune.summary }}</text>
        </view>
      </view>

      <!-- 注意事项 -->
      <view v-if="fortune.precautions" class="card precautions-card">
        <text class="card-title">⚠️ 注意事项</text>
        <text class="card-text">{{ fortune.precautions }}</text>
      </view>

      <!-- 五大运势 -->
      <view class="fortune-aspects">
        <view class="aspect-card career" v-if="fortune.career" @click="toggleDetail('career')">
          <view class="aspect-header">
            <text class="aspect-icon">💼</text>
            <text class="aspect-title">事业运势</text>
            <text class="expand-icon">{{ showDetail.career ? '▲' : '▼' }}</text>
          </view>
          <text class="aspect-text" :class="{ expanded: showDetail.career }">{{ fortune.career }}</text>
        </view>

        <view class="aspect-card love" v-if="fortune.love" @click="toggleDetail('love')">
          <view class="aspect-header">
            <text class="aspect-icon">❤️</text>
            <text class="aspect-title">爱情运势</text>
            <text class="expand-icon">{{ showDetail.love ? '▲' : '▼' }}</text>
          </view>
          <text class="aspect-text" :class="{ expanded: showDetail.love }">{{ fortune.love }}</text>
        </view>

        <view class="aspect-card wealth" v-if="fortune.wealth" @click="toggleDetail('wealth')">
          <view class="aspect-header">
            <text class="aspect-icon">💰</text>
            <text class="aspect-title">财富运势</text>
            <text class="expand-icon">{{ showDetail.wealth ? '▲' : '▼' }}</text>
          </view>
          <text class="aspect-text" :class="{ expanded: showDetail.wealth }">{{ fortune.wealth }}</text>
        </view>

        <view class="aspect-card health" v-if="fortune.health" @click="toggleDetail('health')">
          <view class="aspect-header">
            <text class="aspect-icon">🏥</text>
            <text class="aspect-title">健康运势</text>
            <text class="expand-icon">{{ showDetail.health ? '▲' : '▼' }}</text>
          </view>
          <text class="aspect-text" :class="{ expanded: showDetail.health }">{{ fortune.health }}</text>
        </view>
      </view>

      <!-- 幸运元素 -->
      <view class="lucky-section" v-if="hasLuckyInfo">
        <text class="section-title">🍀 幸运元素</text>
        <view class="lucky-grid">
          <view class="lucky-item" v-if="fortune.luckyColor">
            <text class="lucky-icon">🎨</text>
            <view class="lucky-info">
              <text class="lucky-label">幸运颜色</text>
              <text class="lucky-value">{{ fortune.luckyColor }}</text>
            </view>
          </view>
          <view class="lucky-item" v-if="fortune.luckyNumber">
            <text class="lucky-icon">🔢</text>
            <view class="lucky-info">
              <text class="lucky-label">幸运数字</text>
              <text class="lucky-value">{{ fortune.luckyNumber }}</text>
            </view>
          </view>
          <view class="lucky-item" v-if="fortune.luckyDirection">
            <text class="lucky-icon">🧭</text>
            <view class="lucky-info">
              <text class="lucky-label">幸运方位</text>
              <text class="lucky-value">{{ fortune.luckyDirection }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 今日建议 -->
      <view class="card advice-card" v-if="fortune.advice">
        <text class="card-title">💡 今日建议</text>
        <text class="card-text">{{ fortune.advice }}</text>
      </view>

      <!-- 刷新按钮 -->
      <view class="actions">
        <button class="btn btn-secondary" @click="goBack">返回</button>
        <button class="btn btn-primary" @click="refreshFortune">刷新运势</button>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-icon">📊</text>
      <text class="empty-text">暂无运势数据</text>
      <button class="btn btn-primary" @click="refreshFortune">立即计算</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'

const fortune = ref<any>(null)
const loading = ref(false)
const showDetail = ref({
  career: false,
  love: false,
  wealth: false,
  health: false
})

const todayDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[now.getDay()]
  return `${year}年${month}月${day}日 ${weekday}`
})

const hasLuckyInfo = computed(() => {
  return fortune.value && (fortune.value.luckyColor || fortune.value.luckyNumber || fortune.value.luckyDirection)
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
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function refreshFortune() {
  loading.value = true
  try {
    const res: any = await api.dailyFortune.refresh()
    fortune.value = res
    uni.showToast({ title: '刷新成功', icon: 'success' })
  } catch (error: any) {
    uni.showToast({ title: error.message || '刷新失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function getScoreClass(score: number) {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  return 'normal'
}

function toggleDetail(key: string) {
  showDetail.value[key] = !showDetail.value[key]
}

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  padding: 40rpx;
  padding-bottom: 160rpx;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;

  .title {
    display: block;
    font-size: 44rpx;
    font-weight: bold;
    color: #634200;
    margin-bottom: 8rpx;
  }

  .date {
    display: block;
    font-size: 26rpx;
    color: rgba(99, 66, 0, 0.7);
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;

  .loading-text {
    font-size: 28rpx;
    color: #634200;
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    font-size: 32rpx;
    color: #634200;
    margin-bottom: 40rpx;
  }
}

.content {
  .score-card {
    background: white;
    border-radius: 20rpx;
    padding: 40rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    gap: 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);

    .score-display {
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.excellent {
        background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
        .score-value, .score-label { color: white; }
      }

      &.good {
        background: linear-gradient(135deg, #a8e6cf 0%, #55efc4 100%);
        .score-value, .score-label { color: white; }
      }

      &.normal {
        background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
        .score-value, .score-label { color: white; }
      }

      .score-value {
        font-size: 56rpx;
        font-weight: bold;
        line-height: 1;
      }

      .score-label {
        font-size: 22rpx;
        margin-top: 4rpx;
      }
    }

    .score-summary {
      flex: 1;

      .summary-text {
        font-size: 30rpx;
        color: #333;
        font-weight: 500;
        line-height: 1.5;
      }
    }
  }

  .card {
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);

    .card-title {
      display: block;
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 16rpx;
    }

    .card-text {
      display: block;
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
  }

  .fortune-aspects {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    margin-bottom: 20rpx;

    .aspect-card {
      background: white;
      border-radius: 20rpx;
      padding: 24rpx;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);

      .aspect-header {
        display: flex;
        align-items: center;
        gap: 12rpx;
        margin-bottom: 12rpx;

        .aspect-icon {
          font-size: 32rpx;
        }

        .aspect-title {
          flex: 1;
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
        }

        .expand-icon {
          font-size: 20rpx;
          color: #999;
        }
      }

      .aspect-text {
        display: block;
        font-size: 26rpx;
        color: #666;
        line-height: 1.6;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

        &.expanded {
          display: block;
          -webkit-line-clamp: unset;
        }
      }
    }
  }

  .lucky-section {
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);

    .section-title {
      display: block;
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }

    .lucky-grid {
      display: flex;
      flex-direction: column;
      gap: 16rpx;

      .lucky-item {
        display: flex;
        align-items: center;
        gap: 16rpx;
        padding: 20rpx;
        background: #f8f9fa;
        border-radius: 12rpx;

        .lucky-icon {
          font-size: 36rpx;
        }

        .lucky-info {
          display: flex;
          flex-direction: column;
          gap: 4rpx;

          .lucky-label {
            font-size: 22rpx;
            color: #999;
          }

          .lucky-value {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
          }
        }
      }
    }
  }

  .actions {
    display: flex;
    gap: 20rpx;
    margin-top: 20rpx;

    .btn {
      flex: 1;
      height: 88rpx;
      border-radius: 16rpx;
      font-size: 30rpx;
      font-weight: bold;
      border: none;

      &.btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      &.btn-secondary {
        background: white;
        color: #634200;
      }
    }
  }
}
</style>
