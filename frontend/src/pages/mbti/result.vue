<template>
  <view class="container">
    <!-- 星夜氛围层 -->
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <view class="content sd-reveal">
      <!-- 自定义导航头 -->
      <view class="page-header">
        <view class="back-sigil" @click="goBack">‹</view>
        <text class="header-title">MBTI 测试结果</text>
      </view>

      <view v-if="loading" class="loading">
        <text class="loading-text">加载中...</text>
      </view>

      <view v-else-if="result" class="sd-reveal-1">
        <!-- MBTI 类型展示 -->
        <view class="type-card">
          <view class="sd-sigil sd-sigil--purple sd-sigil--lg type-sigil">
            <text>◈</text>
          </view>
          <text class="type-badge sd-gold-text">{{ result.mbtiType }}</text>
          <text class="type-name">{{ result.description?.name || '未知类型' }}</text>
          <view class="sd-divider" />
          <text class="type-desc">{{ result.description?.description || '' }}</text>
        </view>

        <!-- 维度得分 -->
        <view class="scores-card">
          <text class="card-title">✦ 维度得分</text>

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
          <text class="card-title">✦ 性格特质</text>
          <view class="traits-list">
            <text class="sd-chip is-purple" v-for="(trait, index) in result.description.traits" :key="index">
              {{ trait }}
            </text>
          </view>
        </view>

        <!-- 适合职业 -->
        <view class="career-card" v-if="result.description?.career?.length">
          <text class="card-title">✦ 适合职业</text>
          <view class="career-list">
            <text class="sd-chip is-gold" v-for="(career, index) in result.description.career" :key="index">
              {{ career }}
            </text>
          </view>
        </view>

        <!-- 感情描述 -->
        <view class="relationship-card" v-if="result.description?.relationship">
          <text class="card-title"><text class="title-mark">❥</text> 感情观</text>
          <text class="relationship-text">{{ result.description.relationship }}</text>
        </view>

        <!-- 重新测试按钮 -->
        <view class="actions">
          <button class="btn btn-primary" @click="retakeTest">重新测试</button>
          <button class="btn btn-secondary" @click="goBack">返回首页</button>
        </view>
      </view>

      <!-- 无记录空态 -->
      <EmptyState
        v-else
        icon="❖"
        title="还没有测试记录"
        desc="完成十六型人格问答，解读你的星象人格"
        action-text="开始测试"
        @action="startTest"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import { goToTab } from '@/utils/navigation'
import EmptyState from '@/components/empty-state/empty-state.vue'

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
  goToTab('/pages/index/index')
}
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
  padding: 0 32rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 56rpx);
}

/* ---- 自定义导航头 ---- */
.page-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: calc(env(safe-area-inset-top) + 24rpx) 0 28rpx;
}

.back-sigil {
  @include sd-sigil-base();
  width: 64rpx;
  height: 64rpx;
  font-size: 40rpx;
  line-height: 1;

  &:active {
    transform: scale(0.96);
    opacity: 0.88;
  }
}

.header-title {
  font-family: $sd-font-display;
  font-size: 36rpx;
  font-weight: bold;
  letter-spacing: 3rpx;
  @include sd-gold-text();
}

/* ---- 加载 ---- */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;

  .loading-text {
    font-size: 28rpx;
    color: $sd-text-3;
    letter-spacing: 2rpx;
  }
}

/* ---- 类型主卡：大字衬线 + 鎏金 ---- */
.type-card {
  @include sd-card-surface(purple);
  padding: 48rpx 36rpx 44rpx;
  text-align: center;
  margin-bottom: 28rpx;

  .type-sigil {
    margin: 0 auto 22rpx;
  }

  .type-badge {
    display: block;
    font-family: $sd-font-display;
    font-size: 88rpx;
    font-weight: bold;
    letter-spacing: 8rpx;
    line-height: 1.15;
    margin-bottom: 14rpx;
  }

  .type-name {
    display: block;
    font-family: $sd-font-display;
    font-size: 34rpx;
    font-weight: bold;
    color: $sd-text;
    letter-spacing: 2rpx;
    margin-bottom: 4rpx;
  }

  .type-desc {
    display: block;
    font-size: 26rpx;
    color: $sd-text-2;
    line-height: 1.8;
    text-align: justify;
  }
}

/* ---- 古籍卷轴式段落卡 ---- */
.scores-card,
.traits-card,
.career-card,
.relationship-card {
  @include sd-card-surface();
  padding: 34rpx 30rpx;
  margin-bottom: 24rpx;

  .card-title {
    display: block;
    font-family: $sd-font-display;
    font-size: 30rpx;
    font-weight: bold;
    color: $sd-gold-bright;
    letter-spacing: 3rpx;
    margin-bottom: 26rpx;

    .title-mark {
      color: $sd-cinnabar;
      margin-right: 6rpx;
    }
  }
}

/* ---- 维度得分：紫 / 金双渐变 ---- */
.score-item {
  margin-bottom: 28rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .score-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;

    text {
      font-size: 24rpx;
      color: $sd-text-3;
      transition: color 0.3s;

      &.active {
        color: $sd-purple-bright;
        font-weight: bold;
      }
    }

    .score-count {
      margin-left: 10rpx;
      font-size: 22rpx;
      font-weight: bold;
      color: $sd-gold-bright;
    }
  }

  .score-bar {
    display: flex;
    height: 12rpx;
    background: $sd-bg-raise;
    border-radius: $sd-radius-pill;
    overflow: hidden;

    .bar-left {
      background: $sd-purple-grad;
      box-shadow: $sd-glow-purple;
      transition: width 0.5s;
    }

    .bar-right {
      background: $sd-gold-grad;
      box-shadow: $sd-glow-gold;
      transition: width 0.5s;
    }
  }
}

/* ---- 标签列表 ---- */
.traits-list,
.career-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

/* ---- 感情观段落 ---- */
.relationship-text {
  display: block;
  font-size: 27rpx;
  color: $sd-text-2;
  line-height: 1.8;
  text-align: justify;
}

/* ---- 操作按钮 ---- */
.actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 12rpx;

  .btn {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $sd-radius-pill;
    font-size: 30rpx;
    font-weight: bold;
    border: none;
    margin: 0;

    &::after {
      border: none;
    }

    &.btn-primary {
      background: $sd-purple-grad;
      color: $sd-text;
      box-shadow: $sd-glow-purple;
    }

    &.btn-secondary {
      background: $sd-bg-raise;
      color: $sd-text-2;
      border: 1rpx solid $sd-stroke;
    }
  }
}
</style>
