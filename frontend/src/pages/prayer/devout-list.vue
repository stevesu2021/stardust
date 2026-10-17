<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <view class="content sd-reveal">
      <!-- 题铭 -->
      <view class="header sd-reveal-1">
        <text class="title">虔诚祈祷</text>
        <text class="subtitle">向神灵祈愿，寻求庇佑</text>
      </view>

      <!-- 加载骨架 -->
      <view v-if="loading && list.length === 0" class="skeleton-area">
        <LoadingSkeleton :rows="3" height="240rpx" gap="24rpx" />
      </view>

      <!-- 祈祷卡片流 -->
      <view v-else-if="list.length > 0" class="list">
        <view
          v-for="(item, index) in list"
          :key="item.id"
          class="item"
          :class="'sd-reveal-' + ((index % 4) + 1)"
        >
          <view class="item-header">
            <view class="user-info">
              <image v-if="item.user?.avatar" :src="item.user.avatar" class="avatar" mode="aspectFill" />
              <view v-else class="avatar-placeholder">{{ item.user?.nickname?.[0] || '匿' }}</view>
              <text class="nickname">{{ item.isAnonymous ? (item.user?.anonymousNickname || '匿名') : (item.user?.nickname || '匿名') }}</text>
            </view>
            <text class="time">{{ formatTime(item.createdAt) }}</text>
          </view>

          <view class="item-content">
            <text class="content-text">{{ item.content }}</text>
            <view v-if="item.category" class="category-info">
              <text class="category-label">分类</text>
              <text class="category-value">{{ getCategoryName(item.category) }}</text>
            </view>
            <view v-if="item.deities" class="deities-info">
              <text class="deities-label">祈愿：</text>
              <text class="deities-value">{{ getDeitiesNames(item.deities) }}</text>
            </view>
          </view>

          <view class="item-footer">
            <view class="support-section" @click="supportPrayer(item.id)">
              <view class="support-sigil">
                <text>☾</text>
              </view>
              <text class="support-count">{{ item.supports || 0 }}</text>
              <text class="support-text">支持</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空态 -->
      <EmptyState
        v-else
        icon="☾"
        title="还没有祈祷记录"
        desc="点击下方按钮开始祈愿"
        action-text="开始祈愿"
        @action="create"
      />
    </view>

    <!-- 发布祈祷 -->
    <view class="fab" @click="create">
      <text class="fab-icon">☾</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { api } from '@/api'
import { useUserStore } from '@/store/user'
import EmptyState from '@/components/empty-state/empty-state.vue'
import LoadingSkeleton from '@/components/loading-skeleton/loading-skeleton.vue'

const userStore = useUserStore()
const list = ref<any[]>([])
const loading = ref(false)

// 分类映射
const categoryMap: Record<string, string> = {
  'category_1': '综合护佑/万能型',
  'category_2': '求子/护佑孩童',
  'category_3': '求财/商业兴旺',
  'category_4': '学业/功名/考试',
  'category_5': '姻缘/爱情',
  'category_6': '健康/祛病/长寿',
  'category_7': '武运/忠义/护法',
  'category_8': '农业/丰收/风调雨顺',
  'category_9': '出行/航海/平安',
  'category_10': '占卜/命运/神谕'
}

onMounted(() => {
  loadList()
})

onShow(() => {
  loadList()
})

async function loadList() {
  loading.value = true
  try {
    const res: any = await api.devoutPrayer.getDevoutList()
    list.value = res
  } catch (error: any) {
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function supportPrayer(id: string) {
  try {
    await api.devoutPrayer.support(id)
    uni.showToast({ title: '支持成功', icon: 'success' })
    loadList()
  } catch (error: any) {
    uni.showToast({ title: error.message || '操作失败', icon: 'none' })
  }
}

function create() {
  uni.navigateTo({ url: '/pages/prayer/devout-create' })
}

function formatTime(time: string) {
  const date = new Date(time)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}月${day}日 ${hours}:${minutes}`
}

function getCategoryName(categoryId: string) {
  return categoryMap[categoryId] || '未知分类'
}

function getDeitiesNames(deitiesJson: string) {
  try {
    const deities = JSON.parse(deitiesJson)
    return deities.join('、')
  } catch {
    return ''
  }
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
  padding: 24rpx 32rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 200rpx);
}

.header {
  text-align: center;
  padding: 12rpx 0 32rpx;

  .title {
    display: block;
    font-family: $sd-font-display;
    font-size: 44rpx;
    font-weight: bold;
    letter-spacing: 6rpx;
    @include sd-gold-text();
    margin-bottom: 10rpx;
  }

  .subtitle {
    display: block;
    font-size: 24rpx;
    color: $sd-text-3;
    letter-spacing: 3rpx;
  }
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
    margin-bottom: 20rpx;

    .user-info {
      display: flex;
      align-items: center;
      gap: 16rpx;
      min-width: 0;

      .avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        border: 1rpx solid $sd-stroke-strong;
      }

      .avatar-placeholder {
        @include sd-sigil-base();
        width: 60rpx;
        height: 60rpx;
        font-size: 26rpx;
        flex-shrink: 0;
      }

      .nickname {
        font-size: 26rpx;
        font-weight: bold;
        color: $sd-text-2;
        letter-spacing: 1rpx;
      }
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
      margin-bottom: 14rpx;
    }

    .category-info {
      display: inline-flex;
      align-items: center;
      gap: 10rpx;
      padding: 6rpx 20rpx;
      border-radius: $sd-radius-pill;
      background: rgba(139, 124, 232, 0.1);
      border: 1rpx solid rgba(139, 124, 232, 0.36);
      margin-bottom: 10rpx;

      .category-label {
        font-size: 20rpx;
        color: $sd-text-3;
        letter-spacing: 2rpx;
      }

      .category-value {
        font-size: 22rpx;
        color: $sd-purple-bright;
      }
    }

    .deities-info {
      display: flex;
      align-items: baseline;
      gap: 8rpx;

      .deities-label {
        font-size: 22rpx;
        color: $sd-text-3;
        flex-shrink: 0;
        letter-spacing: 2rpx;
      }

      .deities-value {
        font-size: 24rpx;
        color: $sd-gold;
        line-height: 1.5;
      }
    }
  }

  .item-footer {
    border-top: 1rpx solid $sd-stroke;
    padding-top: 20rpx;

    .support-section {
      display: inline-flex;
      align-items: center;
      gap: 14rpx;
      padding: 10rpx 28rpx;
      border-radius: $sd-radius-pill;
      background: rgba(237, 90, 107, 0.08);
      border: 1rpx solid rgba(237, 90, 107, 0.34);

      &:active {
        transform: scale(0.96);
        opacity: 0.88;
      }

      .support-sigil {
        @include sd-sigil-base(true);
        width: 44rpx;
        height: 44rpx;
        font-size: 24rpx;
      }

      .support-count {
        font-size: 28rpx;
        font-weight: bold;
        color: $sd-cinnabar-soft;
      }

      .support-text {
        font-size: 24rpx;
        color: $sd-text-3;
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
