<template>
  <view class="container">
    <!-- 氛围层：星云 + 星野 + 流星 -->
    <view class="sd-nebula" />
    <view class="sd-stars" />
    <view class="sd-shooting-star" />

    <!-- 自定义导航头（navigationStyle: custom） -->
    <view class="page-header">
      <view class="back-sigil" @click="goBack">‹</view>
      <text class="header-title">今日运势</text>
    </view>

    <view class="content sd-reveal">
      <!-- 日期 -->
      <view class="date-line">
        <text class="date-mark">☽</text>
        <text class="date-text">{{ todayDate }}</text>
      </view>

      <view v-if="loading" class="loading">
        <text class="loading-text">星象测算中...</text>
      </view>

      <view v-else-if="fortune" class="fortune-content">
        <!-- 总体得分：进度环 -->
        <StardCard variant="gold" glow class="score-card sd-reveal-1">
          <view class="score-display" :class="getScoreClass(fortune.overallScore)">
            <view class="score-ring" :style="{ '--pct': fortune.overallScore * 3.6 + 'deg' }">
              <view class="score-core">
                <text class="score-value">{{ fortune.overallScore }}</text>
                <text class="score-label">总体得分</text>
              </view>
            </view>
          </view>
          <view class="score-summary">
            <text class="summary-text">{{ fortune.summary }}</text>
          </view>
        </StardCard>

        <!-- 注意事项：朱砂条 -->
        <view v-if="fortune.precautions" class="precautions-card sd-reveal-2">
          <view class="precautions-head">
            <text class="warn-mark">⚠</text>
            <text class="precautions-title">注意事项</text>
          </view>
          <text class="precautions-text">{{ fortune.precautions }}</text>
        </view>

        <!-- 四大运势 -->
        <view class="fortune-aspects sd-reveal-2">
          <view class="aspect-card career" v-if="fortune.career" @click="toggleDetail('career')">
            <view class="aspect-header">
              <view class="sd-sigil sd-sigil--sm aspect-sigil"><text>☰</text></view>
              <text class="aspect-title">事业运势</text>
              <text class="expand-icon">{{ showDetail.career ? '▲' : '▼' }}</text>
            </view>
            <text class="aspect-text" :class="{ expanded: showDetail.career }">{{ fortune.career }}</text>
          </view>

          <view class="aspect-card love" v-if="fortune.love" @click="toggleDetail('love')">
            <view class="aspect-header">
              <view class="sd-sigil sd-sigil--sm sd-sigil--cinnabar aspect-sigil"><text>❥</text></view>
              <text class="aspect-title">爱情运势</text>
              <text class="expand-icon">{{ showDetail.love ? '▲' : '▼' }}</text>
            </view>
            <text class="aspect-text" :class="{ expanded: showDetail.love }">{{ fortune.love }}</text>
          </view>

          <view class="aspect-card wealth" v-if="fortune.wealth" @click="toggleDetail('wealth')">
            <view class="aspect-header">
              <view class="sd-sigil sd-sigil--sm aspect-sigil"><text>金</text></view>
              <text class="aspect-title">财富运势</text>
              <text class="expand-icon">{{ showDetail.wealth ? '▲' : '▼' }}</text>
            </view>
            <text class="aspect-text" :class="{ expanded: showDetail.wealth }">{{ fortune.wealth }}</text>
          </view>

          <view class="aspect-card health" v-if="fortune.health" @click="toggleDetail('health')">
            <view class="aspect-header">
              <view class="sd-sigil sd-sigil--sm aspect-sigil aspect-sigil--wood"><text>✚</text></view>
              <text class="aspect-title">健康运势</text>
              <text class="expand-icon">{{ showDetail.health ? '▲' : '▼' }}</text>
            </view>
            <text class="aspect-text" :class="{ expanded: showDetail.health }">{{ fortune.health }}</text>
          </view>
        </view>

        <!-- 幸运元素：胶囊 -->
        <StardCard v-if="hasLuckyInfo" class="lucky-card sd-reveal-3">
          <view class="lucky-head">
            <text class="lucky-mark">✾</text>
            <text class="lucky-title">幸运元素</text>
          </view>
          <view class="lucky-chips">
            <view class="sd-chip is-gold" v-if="fortune.luckyColor">
              <text class="chip-mark">◉</text>
              <text>幸运颜色 · {{ fortune.luckyColor }}</text>
            </view>
            <view class="sd-chip is-gold" v-if="fortune.luckyNumber">
              <text class="chip-mark">✦</text>
              <text>幸运数字 · {{ fortune.luckyNumber }}</text>
            </view>
            <view class="sd-chip is-gold" v-if="fortune.luckyDirection">
              <text class="chip-mark">⌖</text>
              <text>幸运方位 · {{ fortune.luckyDirection }}</text>
            </view>
          </view>
        </StardCard>

        <!-- 今日建议：古籍卷轴 -->
        <StardCard v-if="fortune.advice" class="advice-card sd-reveal-3">
          <view class="advice-head">
            <text class="advice-mark">✶</text>
            <text class="advice-title">今日建议</text>
          </view>
          <view class="sd-divider" />
          <text class="advice-text">{{ fortune.advice }}</text>
        </StardCard>

        <!-- 操作 -->
        <view class="actions">
          <StardButton class="action-btn" variant="ghost" size="lg" @click="goBack">返回</StardButton>
          <StardButton class="action-btn" variant="gold" size="lg" @click="refreshFortune">✦ 刷新运势</StardButton>
        </view>
      </view>

      <!-- 空态 -->
      <view v-else class="empty-wrap">
        <EmptyState icon="❖" title="暂无运势数据" />
        <StardButton class="empty-cta" variant="gold" size="lg" @click="refreshFortune">✦ 立即计算</StardButton>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'
import StardCard from '@/components/stard-card/stard-card.vue'
import StardButton from '@/components/stard-button/stard-button.vue'
import EmptyState from '@/components/empty-state/empty-state.vue'

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
.container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: $sd-bg;
}

/* ---- 自定义导航头（§6.1） ---- */
.page-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: calc(env(safe-area-inset-top) + 24rpx) 32rpx 24rpx;

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
}

.content {
  position: relative;
  z-index: 1;
  padding: 24rpx 32rpx calc(env(safe-area-inset-bottom) + 40rpx);
}

/* ---- 日期 ---- */
.date-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 30rpx;

  .date-mark {
    font-size: 24rpx;
    color: $sd-gold;
  }

  .date-text {
    font-size: 24rpx;
    color: $sd-text-3;
    letter-spacing: 2rpx;
  }
}

/* ---- 加载 ---- */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;

  .loading-text {
    font-size: 26rpx;
    color: $sd-text-3;
    letter-spacing: 3rpx;
  }
}

.fortune-content {
  display: flex;
  flex-direction: column;

  /* ---- 总分环（§6.4：轨道 raise / 填充金渐变 + 光晕） ---- */
  .score-card {
    display: flex;
    align-items: center;
    gap: 34rpx;
    padding: 36rpx 32rpx;
    margin-bottom: 24rpx;
  }

  .score-display {
    flex-shrink: 0;

    .score-ring {
      --pct: 360deg;
      width: 184rpx;
      height: 184rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $sd-bg-raise;
    }

    &.excellent .score-ring {
      background: conic-gradient(
        from -90deg,
        $sd-gold-bright 0deg,
        $sd-gold-deep var(--pct),
        $sd-bg-raise var(--pct) 360deg
      );
      box-shadow: $sd-glow-gold;
    }

    &.good .score-ring {
      background: conic-gradient(
        from -90deg,
        $sd-wood 0deg,
        $sd-wood var(--pct),
        $sd-bg-raise var(--pct) 360deg
      );
      box-shadow: 0 0 32rpx rgba(111, 191, 143, 0.2);
    }

    &.normal .score-ring {
      background: conic-gradient(
        from -90deg,
        $sd-water 0deg,
        $sd-water var(--pct),
        $sd-bg-raise var(--pct) 360deg
      );
      box-shadow: 0 0 32rpx rgba(106, 155, 216, 0.2);
    }

    .score-core {
      width: 142rpx;
      height: 142rpx;
      border-radius: 50%;
      background: $sd-bg-elev;
      border: 1rpx solid $sd-stroke;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .score-value {
      font-family: $sd-font-display;
      font-size: 56rpx;
      font-weight: bold;
      line-height: 1;
      color: $sd-gold-bright;
    }

    &.good .score-value {
      color: $sd-wood;
    }

    &.normal .score-value {
      color: $sd-water;
    }

    .score-label {
      margin-top: 8rpx;
      font-size: 20rpx;
      color: $sd-text-3;
      letter-spacing: 2rpx;
    }
  }

  .score-summary {
    flex: 1;

    .summary-text {
      font-size: 27rpx;
      color: $sd-text-2;
      line-height: 1.7;
    }
  }

  /* ---- 注意事项：朱砂条 ---- */
  .precautions-card {
    border-radius: $sd-radius;
    border: 1rpx solid rgba(237, 90, 107, 0.32);
    border-left: 6rpx solid $sd-cinnabar;
    background:
      linear-gradient(160deg, rgba(237, 90, 107, 0.1) 0%, rgba(237, 90, 107, 0.02) 48%),
      $sd-bg-elev;
    padding: 28rpx;
    margin-bottom: 24rpx;

    .precautions-head {
      display: flex;
      align-items: center;
      gap: 12rpx;
      margin-bottom: 12rpx;

      .warn-mark {
        font-size: 28rpx;
        line-height: 1;
        color: $sd-cinnabar;
      }

      .precautions-title {
        font-family: $sd-font-display;
        font-size: 28rpx;
        font-weight: bold;
        color: $sd-cinnabar-soft;
        letter-spacing: 2rpx;
      }
    }

    .precautions-text {
      display: block;
      font-size: 26rpx;
      color: $sd-text-2;
      line-height: 1.7;
    }
  }

  /* ---- 四大运势 ---- */
  .fortune-aspects {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin-bottom: 24rpx;
  }

  .aspect-card {
    padding: 28rpx;

    &.career,
    &.wealth,
    &.health {
      @include sd-card-surface();
    }

    &.love {
      @include sd-card-surface(cinnabar);
    }

    &:active {
      opacity: 0.85;
    }

    .aspect-header {
      display: flex;
      align-items: center;
      gap: 18rpx;
      margin-bottom: 14rpx;

      .aspect-sigil {
        flex-shrink: 0;
      }

      .aspect-title {
        flex: 1;
        font-family: $sd-font-display;
        font-size: 30rpx;
        font-weight: bold;
        color: $sd-text;
        letter-spacing: 2rpx;
      }

      .expand-icon {
        font-size: 20rpx;
        color: $sd-text-3;
      }
    }

    .aspect-text {
      display: block;
      font-size: 26rpx;
      color: $sd-text-2;
      line-height: 1.7;
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

  .aspect-sigil--wood {
    background:
      radial-gradient(circle at 50% 34%, rgba(111, 191, 143, 0.16) 0%, rgba(111, 191, 143, 0.04) 58%, transparent 72%),
      $sd-bg-raise;
    border: 1rpx solid rgba(111, 191, 143, 0.42);
    color: $sd-wood;
  }

  /* ---- 幸运元素：胶囊 ---- */
  .lucky-card {
    padding: 30rpx;
    margin-bottom: 24rpx;
  }

  .lucky-head {
    display: flex;
    align-items: center;
    gap: 14rpx;
    margin-bottom: 22rpx;

    .lucky-mark {
      font-size: 28rpx;
      line-height: 1;
      color: $sd-gold;
    }

    .lucky-title {
      font-family: $sd-font-display;
      font-size: 30rpx;
      font-weight: bold;
      color: $sd-gold-bright;
      letter-spacing: 3rpx;
    }
  }

  .lucky-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .chip-mark {
      color: $sd-gold;
    }
  }

  /* ---- 今日建议：古籍卷轴 ---- */
  .advice-card {
    padding: 30rpx;
    margin-bottom: 24rpx;
  }

  .advice-head {
    display: flex;
    align-items: center;
    gap: 14rpx;

    .advice-mark {
      font-size: 28rpx;
      line-height: 1;
      color: $sd-gold;
    }

    .advice-title {
      font-family: $sd-font-display;
      font-size: 30rpx;
      font-weight: bold;
      color: $sd-gold-bright;
      letter-spacing: 3rpx;
    }
  }

  .advice-text {
    display: block;
    font-size: 27rpx;
    color: $sd-text-2;
    line-height: 1.75;
  }

  /* ---- 操作 ---- */
  .actions {
    display: flex;
    gap: 20rpx;
    margin-top: 8rpx;

    .action-btn {
      flex: 1;
    }
  }
}

/* ---- 空态 ---- */
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;

  .empty-cta {
    width: 60%;
    margin-top: 30rpx;
  }
}
</style>
