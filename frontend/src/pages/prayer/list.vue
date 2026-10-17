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

      <!-- 祈愿卡片流 -->
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
            <text class="content-text">{{ item.content }}</text>
            <text v-if="item.targetName" class="target">致: {{ item.targetName }}</text>
          </view>

          <view class="item-footer">
            <view class="count-badge">
              <text class="count-mark">✧</text>
              <text class="count-num">{{ item.prayerCount }}</text>
            </view>
            <view class="plus-btn" @click="increment(item.id)">
              <text>+1</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空态 -->
      <EmptyState
        v-else
        icon="✧"
        title="祈愿墙尚待点亮"
        desc="写下第一句祈愿，为所爱之人祈福"
        action-text="去祈愿"
        @action="create"
      />
    </view>

    <!-- 发布祈愿 -->
    <view class="fab" @click="create">
      <text class="fab-icon">✦</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { api } from '@/api'
import EmptyState from '@/components/empty-state/empty-state.vue'
import LoadingSkeleton from '@/components/loading-skeleton/loading-skeleton.vue'

const list = ref<any[]>([])
const loading = ref(false)

onMounted(() => {
  loadList()
})

onShow(() => {
  loadList()
})

async function loadList() {
  loading.value = true
  try {
    const res: any = await api.reunitePrayer.public()
    list.value = res
  } catch (error: any) {
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function increment(id: string) {
  try {
    await api.reunitePrayer.increment(id)
    uni.showToast({ title: '祈福成功', icon: 'success' })
    loadList()
  } catch (error: any) {
    uni.showToast({ title: error.message || '操作失败', icon: 'none' })
  }
}

function create() {
  uni.navigateTo({ url: '/pages/prayer/create' })
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

.item {
  @include sd-card-surface();
  padding: 28rpx;
  margin-bottom: 24rpx;

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

    .content-text {
      display: block;
      font-size: 30rpx;
      color: $sd-text;
      line-height: 1.7;
      margin-bottom: 12rpx;
    }

    .target {
      display: block;
      font-size: 24rpx;
      color: $sd-gold;
      letter-spacing: 2rpx;
    }
  }

  .item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 1rpx solid $sd-stroke;

    .count-badge {
      display: inline-flex;
      align-items: center;
      gap: 10rpx;
      padding: 8rpx 24rpx;
      border-radius: $sd-radius-pill;
      background: rgba(232, 195, 106, 0.1);
      border: 1rpx solid rgba(232, 195, 106, 0.42);

      .count-mark {
        font-size: 24rpx;
        color: $sd-gold;
        line-height: 1;
      }

      .count-num {
        font-size: 26rpx;
        font-weight: bold;
        color: $sd-gold-bright;
        line-height: 1;
      }
    }

    .plus-btn {
      padding: 12rpx 36rpx;
      border-radius: $sd-radius-pill;
      border: 1rpx solid rgba(232, 195, 106, 0.55);
      font-size: 26rpx;
      font-weight: bold;
      color: $sd-gold-bright;
      letter-spacing: 2rpx;

      &:active {
        transform: scale(0.96);
        opacity: 0.88;
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
