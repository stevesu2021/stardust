<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />
    <view class="sd-shooting-star" />

    <view class="content sd-reveal">
      <!-- 加载骨架 -->
      <view v-if="loading && list.length === 0" class="skeleton-area">
        <LoadingSkeleton :rows="3" height="200rpx" gap="24rpx" />
      </view>

      <!-- 表白卡片流 -->
      <view v-else-if="list.length > 0" class="list">
        <view
          v-for="(item, index) in list"
          :key="item.id"
          class="item"
          :class="'sd-reveal-' + ((index % 4) + 1)"
        >
          <view class="item-header">
            <text class="nickname">{{ item.user?.nickname || '匿名' }}</text>
            <text class="time">{{ formatTime(item.createdAt) }}</text>
          </view>

          <view class="item-content">
            <view class="quote-block">
              <text class="quote-ornament">❝</text>
              <text class="content-text">{{ item.content }}</text>
            </view>
            <text class="target">致: {{ item.targetName }}</text>
          </view>

          <view v-if="item.isMatched" class="item-footer">
            <view class="matched-badge">
              <text class="matched-mark">❥</text>
              <text class="matched-text">已匹配</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空态 -->
      <EmptyState
        v-else
        icon="❥"
        title="红线那端尚无回音"
        desc="发布第一封心事，静候月老牵线"
        action-text="发布表白"
        @action="create"
      />
    </view>

    <!-- 发布表白 -->
    <view class="fab" @click="create">
      <text class="fab-icon">❥</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import EmptyState from '@/components/empty-state/empty-state.vue'
import LoadingSkeleton from '@/components/loading-skeleton/loading-skeleton.vue'

const list = ref<any[]>([])
const loading = ref(false)

onMounted(() => {
  loadList()
})

async function loadList() {
  loading.value = true
  try {
    const res: any = await api.confession.public()
    list.value = res
  } catch (error: any) {
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function create() {
  uni.navigateTo({ url: '/pages/confession/create' })
}

function formatTime(time: string) {
  const date = new Date(time)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
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
  padding: 28rpx 32rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 200rpx);
}

.skeleton-area {
  padding: 8rpx 0 16rpx;
}

.list {
  display: flex;
  flex-direction: column;
}

/* 卡片：左侧 2rpx 朱砂红线 */
.item {
  @include sd-card-surface();
  position: relative;
  padding: 28rpx 28rpx 28rpx 36rpx;
  margin-bottom: 24rpx;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 22rpx;
    bottom: 22rpx;
    width: 2rpx;
    border-radius: 2rpx;
    background: linear-gradient(
      180deg,
      rgba(237, 90, 107, 0) 0%,
      rgba(237, 90, 107, 0.25) 18%,
      rgba(255, 154, 168, 0.85) 50%,
      rgba(237, 90, 107, 0.25) 82%,
      rgba(237, 90, 107, 0) 100%
    );
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18rpx;

    .nickname {
      font-size: 26rpx;
      font-weight: bold;
      color: $sd-text-2;
      letter-spacing: 1rpx;
    }

    .time {
      font-size: 22rpx;
      color: $sd-text-3;
    }
  }

  .item-content {
    margin-bottom: 20rpx;

    /* 表白内容：衬线引用块 */
    .quote-block {
      .quote-ornament {
        display: block;
        font-family: $sd-font-display;
        font-size: 44rpx;
        line-height: 1;
        color: rgba(237, 90, 107, 0.55);
        margin-bottom: 6rpx;
      }

      .content-text {
        display: block;
        font-family: $sd-font-display;
        font-size: 30rpx;
        color: $sd-text;
        line-height: 1.8;
        letter-spacing: 1rpx;
        margin-bottom: 14rpx;
      }
    }

    .target {
      display: block;
      font-size: 24rpx;
      color: $sd-cinnabar-soft;
      letter-spacing: 2rpx;
    }
  }

  .item-footer {
    border-top: 1rpx solid $sd-stroke;
    padding-top: 20rpx;

    .matched-badge {
      display: inline-flex;
      align-items: center;
      gap: 10rpx;
      padding: 8rpx 24rpx;
      border-radius: $sd-radius-pill;
      background: rgba(237, 90, 107, 0.12);
      border: 1rpx solid rgba(237, 90, 107, 0.45);
      box-shadow: $sd-glow-cinnabar;

      .matched-mark {
        font-size: 26rpx;
        color: $sd-cinnabar-soft;
        line-height: 1;
      }

      .matched-text {
        font-size: 24rpx;
        color: $sd-cinnabar-soft;
        letter-spacing: 2rpx;
      }
    }
  }
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: calc(env(safe-area-inset-bottom) + 120rpx);
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: $sd-gold-grad;
  border: 1rpx solid rgba(245, 217, 139, 0.55);
  box-shadow: 0 0 44rpx rgba(232, 195, 106, 0.35), 0 16rpx 36rpx rgba(4, 6, 18, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  &:active {
    transform: scale(0.92);
    opacity: 0.88;
  }

  .fab-icon {
    font-family: $sd-font-display;
    font-size: 46rpx;
    color: $sd-gold-ink;
    line-height: 1;
  }
}
</style>
