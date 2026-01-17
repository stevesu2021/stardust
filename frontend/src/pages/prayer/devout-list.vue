<template>
  <view class="container">
    <view class="header">
      <text class="title">虔诚祈祷</text>
      <text class="subtitle">向神灵祈愿，寻求庇佑</text>
    </view>

    <view class="list" v-if="list.length > 0">
      <view class="item" v-for="item in list" :key="item.id">
        <view class="item-header">
          <view class="user-info">
            <image v-if="item.user?.avatar" :src="item.user.avatar" class="avatar" mode="aspectFill" />
            <view v-else class="avatar-placeholder">{{ item.user?.nickname?.[0] || '匿' }}</view>
            <text class="nickname">{{ item.isAnonymous ? (item.user?.anonymousNickname || '匿名') : (item.user?.nickname || '匿名') }}</text>
          </view>
          <text class="time">{{ formatTime(item.createdAt) }}</text>
        </view>

        <view class="item-content">
          <text class="content">{{ item.content }}</text>
          <view class="category-info" v-if="item.category">
            <text class="category-label">分类：</text>
            <text class="category-value">{{ getCategoryName(item.category) }}</text>
          </view>
          <view class="deities-info" v-if="item.deities">
            <text class="deities-label">祈愿：</text>
            <text class="deities-value">{{ getDeitiesNames(item.deities) }}</text>
          </view>
        </view>

        <view class="item-footer">
          <view class="support-section" @click="supportPrayer(item.id)">
            <text class="support-icon">🕯️</text>
            <text class="support-count">{{ item.supports || 0 }}</text>
            <text class="support-text">支持</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty" v-else>
      <text class="empty-icon">🕯️</text>
      <text class="empty-text">还没有祈祷记录</text>
      <text class="empty-hint">点击下方按钮开始祈愿</text>
    </view>

    <view class="fab" @click="create">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const list = ref<any[]>([])

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
  try {
    const res: any = await api.devoutPrayer.getDevoutList()
    list.value = res
  } catch (error: any) {
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
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
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 160rpx;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
  text-align: center;

  .title {
    display: block;
    font-size: 44rpx;
    font-weight: bold;
    color: white;
    margin-bottom: 10rpx;
  }

  .subtitle {
    display: block;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.list {
  padding: 20rpx;

  .item {
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .user-info {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .avatar {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
        }

        .avatar-placeholder {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28rpx;
          color: white;
          font-weight: bold;
        }

        .nickname {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
        }
      }

      .time {
        font-size: 24rpx;
        color: #999;
      }
    }

    .item-content {
      margin-bottom: 20rpx;

      .content {
        display: block;
        font-size: 30rpx;
        color: #333;
        line-height: 1.6;
        margin-bottom: 16rpx;
      }

      .category-info {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;

        .category-label {
          font-size: 24rpx;
          color: #999;
        }

        .category-value {
          font-size: 24rpx;
          color: #667eea;
        }
      }

      .deities-info {
        display: flex;
        align-items: flex-start;

        .deities-label {
          font-size: 24rpx;
          color: #999;
          flex-shrink: 0;
        }

        .deities-value {
          font-size: 24rpx;
          color: #f39c12;
          line-height: 1.5;
        }
      }
    }

    .item-footer {
      border-top: 1rpx solid #f0f0f0;
      padding-top: 20rpx;

      .support-section {
        display: flex;
        align-items: center;
        gap: 10rpx;

        .support-icon {
          font-size: 32rpx;
        }

        .support-count {
          font-size: 28rpx;
          color: #f39c12;
          font-weight: bold;
        }

        .support-text {
          font-size: 26rpx;
          color: #999;
        }
      }
    }
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
    color: #333;
    margin-bottom: 10rpx;
  }

  .empty-hint {
    font-size: 26rpx;
    color: #999;
  }
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.4);
  z-index: 100;

  .fab-icon {
    font-size: 60rpx;
    color: white;
    line-height: 1;
  }
}
</style>
