<template>
  <view class="container">
    <view class="header">
      <text class="title">星座名人</text>
      <text class="subtitle">与你同星座的杰出人物</text>
    </view>

    <!-- 星座Tab -->
    <scroll-view scroll-x class="tabs-container" :scroll-into-view="scrollToId" scroll-with-animation>
      <view class="tabs">
        <view
          v-for="(tab, index) in zodiacTabs"
          :key="tab.key"
          :id="`tab-${index}`"
          class="tab-item"
          :class="{ active: currentZodiac === tab.name }"
          @click="switchTab(tab.name)"
        >
          <text class="tab-icon">{{ tab.icon }}</text>
          <text class="tab-name">{{ tab.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 名人列表 -->
    <view v-if="loading" class="loading">
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="celebrityList.length > 0" class="celebrity-list">
      <view
        v-for="person in celebrityList"
        :key="person.id"
        class="celebrity-card"
      >
        <view class="card-header">
          <text class="name">{{ person.name }}</text>
          <view class="category-tag">{{ person.category }}</view>
        </view>
        <view class="card-body">
          <view class="info-row">
            <text class="label">国籍/时代</text>
            <text class="value">{{ person.nationality }}</text>
          </view>
          <view class="info-row">
            <text class="label">出生日期</text>
            <text class="value">{{ person.birthDate }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-icon">👻</text>
      <text class="empty-text">暂无名人数据</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { api } from '@/api'

// 星座配置（按时间顺序）
const zodiacTabs = [
  { key: 'aries', name: '白羊座', icon: '♈' },
  { key: 'taurus', name: '金牛座', icon: '♉' },
  { key: 'gemini', name: '双子座', icon: '♊' },
  { key: 'cancer', name: '巨蟹座', icon: '♋' },
  { key: 'leo', name: '狮子座', icon: '♌' },
  { key: 'virgo', name: '处女座', icon: '♍' },
  { key: 'libra', name: '天秤座', icon: '♎' },
  { key: 'scorpio', name: '天蝎座', icon: '♏' },
  { key: 'sagittarius', name: '射手座', icon: '♐' },
  { key: 'capricorn', name: '摩羯座', icon: '♑' },
  { key: 'aquarius', name: '水瓶座', icon: '♒' },
  { key: 'pisces', name: '双鱼座', icon: '♓' },
]

const currentZodiac = ref('白羊座')
const loading = ref(false)
const allCelebrities = ref<Record<string, any[]>>({})
const scrollToId = ref('')

// 当前星座的名人列表
const celebrityList = computed(() => {
  return allCelebrities.value[currentZodiac.value] || []
})

// 获取默认星座索引
function getDefaultZodiacIndex(userZodiac?: string) {
  if (!userZodiac) return 0
  const index = zodiacTabs.findIndex(t => t.name === userZodiac)
  return index >= 0 ? index : 0
}

// 切换Tab
function switchTab(zodiacName: string) {
  currentZodiac.value = zodiacName
}

// 加载所有名人数据
async function loadCelebrities() {
  loading.value = true
  try {
    const res: any = await api.famousPeople.getAllGrouped()
    allCelebrities.value = res
  } catch (error: any) {
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

onLoad((options: any) => {
  const userZodiac = options.zodiac
  if (userZodiac) {
    const index = getDefaultZodiacIndex(userZodiac)
    currentZodiac.value = zodiacTabs[index].name
    scrollToId.value = `tab-${index}`
  }

  loadCelebrities()
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f6fa;
}

.header {
  padding: 40rpx 30rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.tabs-container {
  background: white;
  border-bottom: 1rpx solid #eee;
  white-space: nowrap;

  .tabs {
    display: inline-flex;
    padding: 0 20rpx;

    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx 24rpx;
      margin: 0 4rpx;
      border-radius: 16rpx 16rpx 0 0;
      transition: all 0.3s;

      .tab-icon {
        font-size: 32rpx;
        margin-bottom: 6rpx;
      }

      .tab-name {
        font-size: 24rpx;
        color: #666;
      }

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

        .tab-name {
          color: white;
          font-weight: bold;
        }
      }
    }
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

.celebrity-list {
  padding: 30rpx;

  .celebrity-card {
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;
      padding-bottom: 20rpx;
      border-bottom: 1rpx solid #f5f5f5;

      .name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .category-tag {
        padding: 8rpx 16rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 22rpx;
        border-radius: 20rpx;
      }
    }

    .card-body {
      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-size: 26rpx;
          color: #999;
        }

        .value {
          font-size: 26rpx;
          color: #333;
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
  padding: 120rpx 0;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
