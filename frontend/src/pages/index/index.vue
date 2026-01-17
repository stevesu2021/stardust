<template>
  <view class="container">
    <!-- 缘分匹配弹窗 -->
    <DatingMatchModal
      :visible="showMatchModal"
      @close="showMatchModal = false"
      @startChat="handleStartChat"
    />
    <!-- 紧凑头部 -->
    <view class="header">
      <view class="header-content">
        <view class="app-brand">
          <text class="brand-icon">✨</text>
          <view class="brand-text">
            <text class="brand-name">星契集</text>
            <text class="brand-slogan">探索你的星座与缘分</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="profile-btn" @click="goToProfile">
            <image v-if="userInfo?.avatar" :src="userInfo.avatar" class="avatar-img" mode="aspectFill" />
            <text v-else class="avatar-placeholder">👤</text>
          </view>
        </view>
      </view>

      <!-- 用户星座五行卡片 -->
      <view class="user-card" v-if="userInfo && hasAstrologyData">
        <view class="zodiac-section">
          <text class="zodiac-icon">{{ getZodiacIcon(userInfo.zodiacSign) }}</text>
          <view class="zodiac-info">
            <text class="zodiac-label">星座</text>
            <text class="zodiac-value">{{ userInfo.zodiacSign || '未知' }}</text>
          </view>
        </view>
        <view class="divider"></view>
        <view class="element-section">
          <text class="element-icon">{{ getDominantElementIcon() }}</text>
          <view class="element-info">
            <text class="element-label">主导五行</text>
            <text class="element-value" :style="{ color: getDominantElementColor() }">
              {{ getDominantElementName() }}
            </text>
          </view>
        </view>
        <view class="element-badges">
          <view
            v-for="elem in getActiveElements()"
            :key="elem.key"
            class="element-badge"
            :class="elem.key"
          >
            {{ elem.icon }}
          </view>
        </view>
      </view>

      <!-- 今日运势卡片 -->
      <DailyFortuneCard v-if="userInfo && hasAstrologyData" ref="fortuneCardRef" />

      <!-- 未登录或未计算星盘提示 -->
      <view class="calc-prompt" v-else-if="userInfo">
        <text class="prompt-text">点击计算星盘，解锁你的命理密码</text>
        <view class="calc-btn" @click="calculateAstrology">
          <text>立即计算</text>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="features">
      <view class="feature-item" @click="goToPage('/pages/astrology/calculate')">
        <text class="feature-icon">✨</text>
        <text class="feature-title">星盘计算</text>
        <text class="feature-desc">阳历转农历、星座、五行</text>
      </view>

      <view class="feature-item" @click="goToPage('/pages/prayer/list')">
        <text class="feature-icon">🙏</text>
        <text class="feature-title">复合祈愿</text>
        <text class="feature-desc">为爱情祈福</text>
      </view>

      <view class="feature-item" @click="goToPage('/pages/prayer/devout-list')">
        <text class="feature-icon">🕯️</text>
        <text class="feature-title">虔诚祈祷</text>
        <text class="feature-desc">向神灵祈愿</text>
      </view>

      <view class="feature-item" @click="goToPage('/pages/shop/list')">
        <text class="feature-icon">🛍️</text>
        <text class="feature-title">商城</text>
        <text class="feature-desc">星座周边商品</text>
      </view>

      <view class="feature-item" @click="goToPage('/pages/treehole/list')">
        <text class="feature-icon">🌳</text>
        <text class="feature-title">树洞</text>
        <text class="feature-desc">匿名分享心情</text>
      </view>

      <view class="feature-item" @click="goToPage('/pages/dating/matches')">
        <text class="feature-icon">💑</text>
        <text class="feature-title">缘分匹配</text>
        <text class="feature-desc">基于星座五行的交友</text>
      </view>

      <view class="feature-item" @click="goToPage('/pages/palm/reading')">
        <text class="feature-icon">🤚</text>
        <text class="feature-title">看手相</text>
        <text class="feature-desc">AI手相分析</text>
      </view>

      <view class="feature-item" @click="goToPage('/pages/mbti/result')">
        <text class="feature-icon">🧠</text>
        <text class="feature-title">MBTI测试</text>
        <text class="feature-desc">人格类型分析</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import { api } from '@/api'
import DatingMatchModal from '@/components/DatingMatchModal.vue'
import DailyFortuneCard from '@/components/DailyFortuneCard.vue'

const userStore = useUserStore()
const userInfo = ref<any>(null)
const showMatchModal = ref(false)
const fortuneCardRef = ref<any>(null)

// 五行配置
const elementsConfig = [
  { key: 'wood', name: '木', icon: '🌲', color: '#4CAF50' },
  { key: 'fire', name: '火', icon: '🔥', color: '#F44336' },
  { key: 'earth', name: '土', icon: '⛰️', color: '#8D6E63' },
  { key: 'metal', name: '金', icon: '⚔️', color: '#FFC107' },
  { key: 'water', name: '水', icon: '💧', color: '#2196F3' }
]

// 星座图标映射
const zodiacIcons: Record<string, string> = {
  '白羊座': '♈',
  '金牛座': '♉',
  '双子座': '♊',
  '巨蟹座': '♋',
  '狮子座': '♌',
  '处女座': '♍',
  '天秤座': '♎',
  '天蝎座': '♏',
  '射手座': '♐',
  '摩羯座': '♑',
  '水瓶座': '♒',
  '双鱼座': '♓'
}

// 是否有星盘数据
const hasAstrologyData = computed(() => {
  return userInfo.value?.zodiacSign || userInfo.value?.fiveElements
})

// 获取星座图标
function getZodiacIcon(sign: string) {
  return zodiacIcons[sign] || '⭐'
}

// 获取主导五行名称
function getDominantElementName() {
  if (!userInfo.value?.fiveElements) return '未知'
  try {
    const elements = JSON.parse(userInfo.value.fiveElements)
    const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1])
    const key = sorted[0]?.[0]
    return elementsConfig.find(e => e.key === key)?.name || '未知'
  } catch {
    return '未知'
  }
}

// 获取主导五行颜色
function getDominantElementColor() {
  if (!userInfo.value?.fiveElements) return '#999'
  try {
    const elements = JSON.parse(userInfo.value.fiveElements)
    const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1])
    const key = sorted[0]?.[0]
    return elementsConfig.find(e => e.key === key)?.color || '#999'
  } catch {
    return '#999'
  }
}

// 获取主导五行图标
function getDominantElementIcon() {
  if (!userInfo.value?.fiveElements) return '❓'
  try {
    const elements = JSON.parse(userInfo.value.fiveElements)
    const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1])
    const key = sorted[0]?.[0]
    return elementsConfig.find(e => e.key === key)?.icon || '❓'
  } catch {
    return '❓'
  }
}

// 获取活跃的五行元素
function getActiveElements() {
  if (!userInfo.value?.fiveElements) return []
  try {
    const elements = JSON.parse(userInfo.value.fiveElements)
    return elementsConfig
      .filter(e => elements[e.key] > 0)
      .map(e => ({ ...e, count: elements[e.key] }))
      .sort((a, b) => b.count - a.count)
  } catch {
    return []
  }
}

// 计算星盘
async function calculateAstrology() {
  if (!userInfo.value?.id) return
  try {
    const res: any = await api.astrology.calculate(userInfo.value.id)
    userInfo.value = res.user
    userStore.setUserInfo(res.user)
    uni.showToast({ title: '计算成功', icon: 'success' })
  } catch (error: any) {
    uni.showToast({ title: error.message || '计算失败', icon: 'none' })
  }
}

function goToPage(url: string) {
  // 商城页面在底部导航栏中，需要使用 switchTab
  if (url === '/pages/shop/list') {
    uni.switchTab({ url })
  } else if (url === '/pages/dating/matches') {
    // 缘分匹配显示弹窗
    showMatchModal.value = true
  } else {
    uni.navigateTo({ url })
  }
}

function goToProfile() {
  uni.navigateTo({ url: '/pages/user/profile' })
}

// 处理开始聊天
function handleStartChat(userId: string) {
  uni.navigateTo({
    url: `/pages/dating/chat?otherUserId=${userId}`
  })
}

onMounted(() => {
  userInfo.value = userStore.userInfo
})

onShow(() => {
  // 每次显示页面时刷新今日运势
  if (fortuneCardRef.value?.refresh) {
    fortuneCardRef.value.refresh()
  }
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f6fa;
}

// 头部
.header {
  padding: 30rpx 30rpx 20rpx;
  background: white;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.app-brand {
  display: flex;
  align-items: center;
  gap: 16rpx;

  .brand-icon {
    font-size: 48rpx;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    gap: 4rpx;

    .brand-name {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      line-height: 1;
    }

    .brand-slogan {
      font-size: 22rpx;
      color: #999;
      line-height: 1;
    }
  }
}

.header-actions {
  .profile-btn {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-img {
      width: 100%;
      height: 100%;
    }

    .avatar-placeholder {
      font-size: 36rpx;
    }
  }
}

// 用户卡片
.user-card {
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200rpx;
    height: 200rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .zodiac-section,
  .element-section {
    display: flex;
    align-items: center;
    gap: 12rpx;

    .zodiac-icon,
    .element-icon {
      font-size: 40rpx;
    }

    .zodiac-info,
    .element-info {
      display: flex;
      flex-direction: column;
      gap: 4rpx;

      .zodiac-label,
      .element-label {
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.8);
      }

      .zodiac-value,
      .element-value {
        font-size: 32rpx;
        font-weight: bold;
        color: white;
      }
    }
  }

  .divider {
    width: 1rpx;
    height: 40rpx;
    background: rgba(255, 255, 255, 0.3);
    margin: 0 20rpx;
  }

  .element-badges {
    position: absolute;
    right: 20rpx;
    bottom: 16rpx;
    display: flex;
    gap: 6rpx;

    .element-badge {
      width: 36rpx;
      height: 36rpx;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20rpx;
      backdrop-filter: blur(10rpx);

      &.wood { background: rgba(76, 175, 80, 0.3); }
      &.fire { background: rgba(244, 67, 54, 0.3); }
      &.earth { background: rgba(141, 110, 99, 0.3); }
      &.metal { background: rgba(255, 193, 7, 0.3); }
      &.water { background: rgba(33, 150, 243, 0.3); }
    }
  }
}

// 计算提示
.calc-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border-radius: 16rpx;
  padding: 24rpx 30rpx;

  .prompt-text {
    font-size: 26rpx;
    color: #634200;
  }

  .calc-btn {
    padding: 12rpx 24rpx;
    background: white;
    border-radius: 20rpx;
    font-size: 24rpx;
    color: #634200;
    font-weight: bold;
  }
}

// 功能入口
.features {
  padding: 30rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.feature-item {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }

  .feature-icon {
    display: block;
    font-size: 56rpx;
    margin-bottom: 16rpx;
  }

  .feature-title {
    display: block;
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 8rpx;
  }

  .feature-desc {
    display: block;
    font-size: 22rpx;
    color: #999;
  }
}
</style>
