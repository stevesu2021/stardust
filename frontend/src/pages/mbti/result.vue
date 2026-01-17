<template>
  <view class="result-page">
    <view class="header">
      <text class="title">MBTI 测试结果</text>
    </view>

    <view v-if="loading" class="loading">
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="result" class="result-container">
      <!-- MBTI 类型展示 -->
      <view class="type-card">
        <text class="type-badge">{{ result.mbtiType }}</text>
        <text class="type-name">{{ result.description?.name || '未知类型' }}</text>
        <text class="type-desc">{{ result.description?.description || '' }}</text>
      </view>

      <!-- 维度得分 -->
      <view class="scores-card">
        <text class="card-title">维度得分</text>

        <view class="score-item">
          <view class="score-label">
            <text :class="{ active: result.eScore >= result.iScore }">E 外向</text>
            <text class="score-count">{{ result.eScore }}</text>
          </view>
          <view class="score-bar">
            <view class="bar-left" :style="{ width: (result.eScore / (result.eScore + result.iScore) * 100) + '%' }"></view>
            <view class="bar-right" :style="{ width: (result.iScore / (result.eScore + result.iScore) * 100) + '%' }"></view>
          </view>
          <view class="score-label">
            <text :class="{ active: result.iScore > result.eScore }">I 内向</text>
            <text class="score-count">{{ result.iScore }}</text>
          </view>
        </view>

        <view class="score-item">
          <view class="score-label">
            <text :class="{ active: result.sScore >= result.nScore }">S 实感</text>
            <text class="score-count">{{ result.sScore }}</text>
          </view>
          <view class="score-bar">
            <view class="bar-left" :style="{ width: (result.sScore / (result.sScore + result.nScore) * 100) + '%' }"></view>
            <view class="bar-right" :style="{ width: (result.nScore / (result.sScore + result.nScore) * 100) + '%' }"></view>
          </view>
          <view class="score-label">
            <text :class="{ active: result.nScore > result.sScore }">N 直觉</text>
            <text class="score-count">{{ result.nScore }}</text>
          </view>
        </view>

        <view class="score-item">
          <view class="score-label">
            <text :class="{ active: result.tScore >= result.fScore }">T 思考</text>
            <text class="score-count">{{ result.tScore }}</text>
          </view>
          <view class="score-bar">
            <view class="bar-left" :style="{ width: (result.tScore / (result.tScore + result.fScore) * 100) + '%' }"></view>
            <view class="bar-right" :style="{ width: (result.fScore / (result.tScore + result.fScore) * 100) + '%' }"></view>
          </view>
          <view class="score-label">
            <text :class="{ active: result.fScore > result.tScore }">F 情感</text>
            <text class="score-count">{{ result.fScore }}</text>
          </view>
        </view>

        <view class="score-item">
          <view class="score-label">
            <text :class="{ active: result.jScore >= result.pScore }">J 判断</text>
            <text class="score-count">{{ result.jScore }}</text>
          </view>
          <view class="score-bar">
            <view class="bar-left" :style="{ width: (result.jScore / (result.jScore + result.pScore) * 100) + '%' }"></view>
            <view class="bar-right" :style="{ width: (result.pScore / (result.jScore + result.pScore) * 100) + '%' }"></view>
          </view>
          <view class="score-label">
            <text :class="{ active: result.pScore > result.jScore }">P 感知</text>
            <text class="score-count">{{ result.pScore }}</text>
          </view>
        </view>
      </view>

      <!-- 特质标签 -->
      <view class="traits-card" v-if="result.description?.traits?.length">
        <text class="card-title">性格特质</text>
        <view class="traits-list">
          <text class="trait-tag" v-for="(trait, index) in result.description.traits" :key="index">
            {{ trait }}
          </text>
        </view>
      </view>

      <!-- 适合职业 -->
      <view class="career-card" v-if="result.description?.career?.length">
        <text class="card-title">适合职业</text>
        <view class="career-list">
          <text class="career-item" v-for="(career, index) in result.description.career" :key="index">
            {{ career }}
          </text>
        </view>
      </view>

      <!-- 感情描述 -->
      <view class="relationship-card" v-if="result.description?.relationship">
        <text class="card-title">感情观</text>
        <text class="relationship-text">{{ result.description.relationship }}</text>
      </view>

      <!-- 重新测试按钮 -->
      <view class="actions">
        <button class="btn btn-primary" @click="retakeTest">重新测试</button>
        <button class="btn btn-secondary" @click="goBack">返回首页</button>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-icon">📋</text>
      <text class="empty-text">还没有测试记录</text>
      <button class="btn btn-primary" @click="startTest">开始测试</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'

const result = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  await loadResult()
})

async function loadResult() {
  loading.value = true
  try {
    const res: any = await api.mbti.getResult()
    result.value = res
  } catch (error: any) {
    console.error('加载结果失败:', error)
    // 未测试过，不显示错误
  } finally {
    loading.value = false
  }
}

function startTest() {
  uni.redirectTo({ url: '/pages/mbti/test' })
}

function retakeTest() {
  uni.showModal({
    title: '重新测试',
    content: '确定要重新开始测试吗？之前的测试结果将被覆盖。',
    success: (res) => {
      if (res.confirm) {
        uni.redirectTo({ url: '/pages/mbti/test' })
      }
    }
  })
}

function goBack() {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
.result-page {
  min-height: 100vh;
  background: #f5f6fa;
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
    color: #333;
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;

  .loading-text {
    font-size: 28rpx;
    color: #999;
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
    color: #666;
    margin-bottom: 40rpx;
  }
}

.type-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);

  .type-badge {
    display: inline-block;
    font-size: 72rpx;
    font-weight: bold;
    color: white;
    margin-bottom: 20rpx;
    text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
  }

  .type-name {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: white;
    margin-bottom: 16rpx;
  }

  .type-desc {
    display: block;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
  }
}

.scores-card,
.traits-card,
.career-card,
.relationship-card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

  .card-title {
    display: block;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
  }
}

.score-item {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .score-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8rpx;

    text {
      font-size: 24rpx;
      color: #666;
      transition: all 0.3s;

      &.active {
        color: #667eea;
        font-weight: bold;
      }
    }

    .score-count {
      font-size: 22rpx;
      color: #999;
    }
  }

  .score-bar {
    display: flex;
    height: 12rpx;
    border-radius: 6rpx;
    overflow: hidden;

    .bar-left {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.5s;
    }

    .bar-right {
      background: #e5e5e5;
      transition: width 0.5s;
    }
  }
}

.traits-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;

  .trait-tag {
    padding: 12rpx 24rpx;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: 24rpx;
    font-size: 24rpx;
    color: #667eea;
  }
}

.career-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .career-item {
    padding: 16rpx 28rpx;
    background: #f8f9fa;
    border-radius: 12rpx;
    font-size: 26rpx;
    color: #333;
  }
}

.relationship-text {
  display: block;
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 20rpx;

  .btn {
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
      color: #667eea;
      border: 2rpx solid #667eea;
    }
  }
}
</style>
