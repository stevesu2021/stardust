<template>
  <view class="container">
    <!-- 缘分匹配弹窗 -->
    <DatingMatchModal
      :visible="showMatchModal"
      @close="showMatchModal = false"
      @startChat="handleStartChat"
    />

    <!-- 星野背景层（纯 CSS，不可交互） -->
    <view class="sd-stars" />
    <view class="sd-nebula" />

    <view class="content">
      <!-- 星徽头部 -->
      <view class="header">
        <view class="brand">
          <view class="brand-sigil">✦</view>
          <view class="brand-text">
            <text class="brand-name">星契集</text>
            <text class="brand-slogan">{{ greeting }}</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="profile-btn" @click="goToProfile">
            <image
              v-if="userInfo?.avatar"
              :src="userInfo.avatar"
              class="avatar-img"
              mode="aspectFill"
            />
            <text v-else class="avatar-placeholder">✧</text>
          </view>
        </view>
      </view>

      <!-- 命盘主卡：星座 × 五行 -->
      <view
        v-if="userInfo && hasAstrologyData"
        class="chart-card"
        @click="goToCelebrities"
      >
        <view class="chart-body">
          <view class="zodiac-col">
            <text class="zodiac-symbol">{{ zodiacSymbol(userInfo.zodiacSign) }}</text>
            <text class="zodiac-name">{{ userInfo.zodiacSign || '未知' }}</text>
          </view>
          <view class="chart-divider">
            <text class="divider-dot" />
            <text class="divider-dot" />
            <text class="divider-dot" />
          </view>
          <view class="element-col">
            <text class="element-label">主导五行</text>
            <text class="element-value" :style="{ color: dominantMeta?.color || '#6b7399' }">
              {{ dominantMeta?.name || '未知' }}
            </text>
            <view class="element-beads">
              <view
                v-for="elem in elems"
                :key="elem.key"
                class="element-bead"
                :style="{ background: elem.color }"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 今日运势卡片 -->
      <DailyFortuneCard v-if="userInfo && hasAstrologyData" ref="fortuneCardRef" />

      <!-- 未计算星盘引导 -->
      <view v-else-if="userInfo" class="calc-prompt" @click="calculateAstrology">
        <view class="calc-left">
          <text class="calc-title">解锁你的命理密码</text>
          <text class="calc-sub">阳历转农历 · 星座 · 五行 · 运势</text>
        </view>
        <view class="calc-btn">
          <text>立即计算</text>
        </view>
      </view>

      <!-- 未登录引导 -->
      <view v-else class="calc-prompt" @click="goToLogin">
        <view class="calc-left">
          <text class="calc-title">开启你的星象之旅</text>
          <text class="calc-sub">登录后解锁全部功能</text>
        </view>
        <view class="calc-btn">
          <text>登录</text>
        </view>
      </view>

      <!-- 功能入口 -->
      <SectionTitle title="功能入口" kicker="✦" />

      <view class="features">
        <view
          v-for="item in features"
          :key="item.title"
          class="feature-item"
          :class="{ 'is-accent': item.accent }"
          @click="goToPage(item.url)"
        >
          <view class="feature-sigil" :class="{ 'sd-sigil--cinnabar': item.accent }">
            <text>{{ item.symbol }}</text>
          </view>
          <view class="feature-text">
            <text class="feature-title">{{ item.title }}</text>
            <text class="feature-desc">{{ item.desc }}</text>
          </view>
        </view>
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
import SectionTitle from '@/components/section-title/section-title.vue'
import { zodiacSymbol, dominantElement, activeElements } from '@/utils/astro'

interface FeatureItem {
  title: string
  desc: string
  url: string
  symbol: string
  accent: boolean
}

const userStore = useUserStore()
const userInfo = ref<any>(null)
const showMatchModal = ref(false)
const fortuneCardRef = ref<any>(null)

// 功能入口配置（星象符号替代 emoji，accent=朱砂强调）
const features: FeatureItem[] = [
  { title: '星盘计算', desc: '阳历转农历、星座、五行', url: '/pages/astrology/calculate', symbol: '☉', accent: false },
  { title: '复合祈愿', desc: '为爱情祈福', url: '/pages/prayer/list', symbol: '❥', accent: true },
  { title: '虔诚祈祷', desc: '向神灵祈愿', url: '/pages/prayer/devout-list', symbol: '☾', accent: false },
  { title: '商城', desc: '星座周边商品', url: '/pages/shop/list', symbol: '❖', accent: false },
  { title: '树洞', desc: '匿名分享心情', url: '/pages/treehole/list', symbol: '✎', accent: false },
  { title: '缘分匹配', desc: '基于星座五行的交友', url: '/pages/dating/matches', symbol: '❤', accent: false },
  { title: '看手相', desc: 'AI 手相分析', url: '/pages/palm/reading', symbol: '✋', accent: false },
  { title: '看面相', desc: 'AI 面相分析', url: '/pages/face/reading', symbol: '☯', accent: false },
  { title: 'MBTI 测试', desc: '人格类型分析', url: '/pages/mbti/result', symbol: '◈', accent: false },
  { title: '恋爱CP', desc: '十二星座配对', url: '/pages/love-cp/index', symbol: '❦', accent: false },
]

// 问候语（按当前时刻变化）
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 5) return '夜深了，星辰与你同在'
  if (h < 11) return '晨光初启，今日星象已就绪'
  if (h < 14) return '日正当中，静观其变'
  if (h < 18) return '午后流光，运势渐盛'
  if (h < 23) return '暮色四合，繁星将醒'
  return '夜深了，星辰与你同在'
})

// 五行数据（收敛到 utils/astro.ts）
const dominantMeta = computed(() => dominantElement(userInfo.value?.fiveElements))
const elems = computed(() => activeElements(userInfo.value?.fiveElements))

const hasAstrologyData = computed(() => {
  return userInfo.value?.zodiacSign || userInfo.value?.fiveElements
})

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
  if (url === '/pages/shop/list') {
    uni.switchTab({ url })
  } else if (url === '/pages/dating/matches') {
    showMatchModal.value = true
  } else {
    uni.navigateTo({ url })
  }
}

function goToProfile() {
  uni.navigateTo({ url: '/pages/user/profile' })
}

function goToCelebrities() {
  if (userInfo.value?.zodiacSign) {
    uni.navigateTo({ url: `/pages/astrology/celebrities?zodiac=${userInfo.value.zodiacSign}` })
  }
}

function goToLogin() {
  uni.navigateTo({ url: '/pages/auth/login' })
}

// 处理开始聊天
function handleStartChat(userId: string) {
  uni.navigateTo({
    url: `/pages/dating/chat?otherUserId=${userId}`,
  })
}

onMounted(() => {
  userInfo.value = userStore.userInfo
})

onShow(() => {
  // 每次页面显示时都从 store 同步登录状态（tab 页会被缓存，onMounted 只执行一次，
  // 登录/退出后必须在这里刷新，否则首页一直显示旧状态）
  userInfo.value = userStore.userInfo
  if (fortuneCardRef.value?.refresh) {
    fortuneCardRef.value.refresh()
  }
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  min-height: 100vh;
  background: $sd-bg;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 1;
  padding: 30rpx 30rpx 60rpx;
}

/* ---- 星徽头部 ---- */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36rpx;
}

.brand {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.brand-sigil {
  @include sd-sigil-base();
  width: 88rpx;
  height: 88rpx;
  font-size: 40rpx;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.brand-name {
  font-family: $sd-font-display;
  font-size: 40rpx;
  font-weight: bold;
  color: $sd-gold-bright;
  letter-spacing: 4rpx;
  line-height: 1.1;
}

.brand-slogan {
  font-size: 22rpx;
  color: $sd-text-3;
  line-height: 1;
}

.header-actions {
  .profile-btn {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    overflow: hidden;
    background: $sd-bg-raise;
    border: 1rpx solid $sd-stroke-strong;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-img {
      width: 100%;
      height: 100%;
    }

    .avatar-placeholder {
      font-size: 34rpx;
      color: $sd-gold;
    }
  }
}

/* ---- 命盘主卡 ---- */
.chart-card {
  position: relative;
  border-radius: $sd-radius-lg;
  padding: 44rpx 34rpx;
  background:
    radial-gradient(420rpx 260rpx at 88% -30%, rgba(232, 195, 106, 0.14), transparent 70%),
    radial-gradient(360rpx 300rpx at 6% 120%, rgba(47, 66, 138, 0.4), transparent 72%),
    $sd-bg-elev;
  border: 1rpx solid rgba(232, 195, 106, 0.3);
  overflow: hidden;
  margin-bottom: 24rpx;

  &:active {
    transform: scale(0.985);
  }

  .chart-body {
    display: flex;
    align-items: center;
  }

  .zodiac-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 190rpx;

    .zodiac-symbol {
      font-size: 88rpx;
      color: $sd-gold-bright;
      line-height: 1.1;
      text-shadow: 0 0 30rpx rgba(232, 195, 106, 0.35);
    }

    .zodiac-name {
      margin-top: 8rpx;
      font-size: 26rpx;
      color: $sd-text-2;
      letter-spacing: 2rpx;
    }
  }

  .chart-divider {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    margin: 0 30rpx;

    .divider-dot {
      width: 6rpx;
      height: 6rpx;
      border-radius: 50%;
      background: rgba(232, 195, 106, 0.5);

      &:nth-child(2) {
        opacity: 0.6;
      }

      &:nth-child(3) {
        opacity: 0.3;
      }
    }
  }

  .element-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .element-label {
      font-size: 22rpx;
      color: $sd-text-3;
      letter-spacing: 3rpx;
    }

    .element-value {
      margin-top: 8rpx;
      font-family: $sd-font-display;
      font-size: 44rpx;
      font-weight: bold;
      line-height: 1.2;
    }

    .element-beads {
      display: flex;
      gap: 12rpx;
      margin-top: 16rpx;

      .element-bead {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        box-shadow: 0 0 12rpx rgba(255, 255, 255, 0.12);
      }
    }
  }
}

/* ---- 引导卡（未登录 / 未计算） ---- */
.calc-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: $sd-radius-lg;
  padding: 34rpx 30rpx;
  background:
    radial-gradient(380rpx 240rpx at 90% -40%, rgba(232, 195, 106, 0.12), transparent 70%),
    $sd-bg-elev;
  border: 1rpx dashed rgba(232, 195, 106, 0.4);
  margin-bottom: 24rpx;

  &:active {
    opacity: 0.85;
  }

  .calc-left {
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .calc-title {
      font-size: 30rpx;
      font-weight: bold;
      color: $sd-text;
    }

    .calc-sub {
      font-size: 22rpx;
      color: $sd-text-3;
    }
  }

  .calc-btn {
    padding: 14rpx 34rpx;
    border-radius: $sd-radius-pill;
    background: linear-gradient(135deg, $sd-gold-bright 0%, $sd-gold 52%, #c9a558 100%);
    color: $sd-gold-ink;
    font-size: 26rpx;
    font-weight: bold;
    box-shadow: 0 6rpx 24rpx rgba(232, 195, 106, 0.28);
  }
}

/* ---- 功能入口 ---- */
.features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 24rpx;
  border-radius: $sd-radius;
  background: $sd-bg-elev;
  border: 1rpx solid $sd-stroke;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.97);
  }

  &.is-accent {
    border-color: rgba(237, 90, 107, 0.32);
    background:
      linear-gradient(160deg, rgba(237, 90, 107, 0.08) 0%, transparent 50%),
      $sd-bg-elev;
  }

  .feature-sigil {
    @include sd-sigil-base();
    width: 84rpx;
    height: 84rpx;
    font-size: 38rpx;
    flex-shrink: 0;

    &.sd-sigil--cinnabar {
      @include sd-sigil-base(true);
    }
  }

  .feature-text {
    display: flex;
    flex-direction: column;
    gap: 6rpx;
    min-width: 0;

    .feature-title {
      font-size: 28rpx;
      font-weight: bold;
      color: $sd-text;
    }

    .feature-desc {
      font-size: 21rpx;
      color: $sd-text-3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
