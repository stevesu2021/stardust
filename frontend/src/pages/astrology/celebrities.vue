<template>
  <view class="container">
    <!-- 氛围层：星云 + 星野 + 流星（不可交互） -->
    <view class="sd-nebula" />
    <view class="sd-stars" />
    <view class="sd-shooting-star" />

    <view class="content sd-reveal">
      <!-- 页面题头 -->
      <view class="page-hero">
        <view class="sd-sigil sd-sigil--md"><text>✦</text></view>
        <text class="hero-title">星座名人</text>
        <text class="hero-subtitle">与你同星座的杰出人物</text>
      </view>

      <!-- 星座Tab -->
      <scroll-view
        scroll-x
        class="tabs-container sd-reveal-1"
        :scroll-into-view="scrollToId"
        scroll-with-animation
      >
        <view class="tabs">
          <view
            v-for="(tab, index) in zodiacTabs"
            :key="tab.key"
            :id="`tab-${index}`"
            class="tab-item"
            :class="{ active: currentZodiac === tab.name }"
            @click="switchTab(tab.name)"
          >
            <view class="tab-badge"><text class="tab-icon">{{ tab.icon }}</text></view>
            <text class="tab-name">{{ tab.name }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 名人列表：加载骨架 -->
      <LoadingSkeleton v-if="loading" :rows="3" height="190rpx" gap="24rpx" />

      <view v-else-if="celebrityList.length > 0" class="celebrity-list sd-reveal-2">
        <view
          v-for="person in celebrityList"
          :key="person.id"
          class="celebrity-card"
        >
          <view class="card-header">
            <view class="name-medallion"><text>{{ person.name.charAt(0) }}</text></view>
            <view class="name-col">
              <text class="name">{{ person.name }}</text>
            </view>
            <view class="sd-chip is-purple category-tag">
              <text>{{ person.category }}</text>
            </view>
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

      <!-- 空状态 -->
      <EmptyState
        v-else
        icon="❖"
        title="暂无名人数据"
        desc="该星座的名人档案仍在整理中"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { api } from '@/api'
import EmptyState from '@/components/empty-state/empty-state.vue'
import LoadingSkeleton from '@/components/loading-skeleton/loading-skeleton.vue'

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
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: $sd-bg;
}

.content {
  position: relative;
  z-index: 1;
  padding: 32rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
}

/* ---- 页面题头 ---- */
.page-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0 36rpx;

  .hero-title {
    margin-top: 24rpx;
    font-family: $sd-font-display;
    font-size: 44rpx;
    font-weight: bold;
    color: $sd-gold-bright;
    letter-spacing: 6rpx;
  }

  .hero-subtitle {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: $sd-text-3;
    letter-spacing: 2rpx;
  }
}

/* ---- 星座符号徽章 Tab ---- */
.tabs-container {
  white-space: nowrap;
  margin-bottom: 30rpx;

  .tabs {
    display: inline-flex;
    gap: 24rpx;
    padding: 10rpx 4rpx;

    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10rpx;

      &:active {
        transform: scale(0.94);
        opacity: 0.88;
      }

      .tab-badge {
        @include sd-sigil-base();
        width: 88rpx;
        height: 88rpx;
        font-size: 44rpx;
        transition: all 0.25s ease;

        .tab-icon {
          color: $sd-gold;
          text-shadow: 0 0 14rpx rgba(232, 195, 106, 0.4);
        }
      }

      .tab-name {
        font-size: 22rpx;
        color: $sd-text-3;
        letter-spacing: 1rpx;
      }

      &.active {
        .tab-badge {
          background: $sd-gold-grad;
          border-color: rgba(232, 195, 106, 0.6);
          box-shadow: $sd-glow-gold;

          .tab-icon {
            color: $sd-gold-ink;
            text-shadow: none;
          }
        }

        .tab-name {
          color: $sd-gold-bright;
          font-weight: bold;
        }
      }
    }
  }
}

/* ---- 名人卡片列表 ---- */
.celebrity-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .celebrity-card {
    @include sd-card-surface();
    padding: 30rpx;

    .card-header {
      display: flex;
      align-items: center;
      gap: 20rpx;
      margin-bottom: 22rpx;
      padding-bottom: 22rpx;
      border-bottom: 1rpx solid $sd-stroke;

      .name-medallion {
        @include sd-sigil-base();
        width: 72rpx;
        height: 72rpx;
        font-size: 32rpx;
        flex-shrink: 0;
      }

      .name-col {
        flex: 1;
        min-width: 0;

        .name {
          font-family: $sd-font-display;
          font-size: 32rpx;
          font-weight: bold;
          color: $sd-text;
          letter-spacing: 2rpx;
        }
      }

      .category-tag {
        flex-shrink: 0;
      }
    }

    .card-body {
      .info-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-size: 24rpx;
          color: $sd-text-3;
          letter-spacing: 2rpx;
        }

        .value {
          font-size: 26rpx;
          color: $sd-text-2;
        }
      }
    }
  }
}
</style>
