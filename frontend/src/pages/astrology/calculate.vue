<template>
  <view class="container">
    <!-- 计算按钮 -->
    <view class="action-bar">
      <button class="btn-calculate" @click="handleCalculate" :loading="calculating">
        <text v-if="!calculating">✨ 重新计算星盘</text>
        <text v-else>计算中...</text>
      </button>
      <button class="btn-interpret" @click="handleGenerateInterpretation" :loading="interpreting" :disabled="!hasBasicData">
        <text v-if="!interpreting">🔮 生成AI解读</text>
        <text v-else>解读中...</text>
      </button>
    </view>

    <!-- Tab 切换 -->
    <view class="tabs" v-if="hasBasicData">
      <view
        class="tab-item"
        :class="{ active: currentTab === 'zodiac' }"
        @click="currentTab = 'zodiac'"
      >
        <text class="tab-icon">⭐</text>
        <text class="tab-text">星座</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: currentTab === 'bazi' }"
        @click="currentTab = 'bazi'"
      >
        <text class="tab-icon">☯️</text>
        <text class="tab-text">八字</text>
      </view>
    </view>

    <!-- 星座 Tab -->
    <view class="tab-content" v-if="currentTab === 'zodiac' && hasBasicData">
      <!-- 星座基础信息卡片 -->
      <view class="card zodiac-card">
        <view class="card-header">
          <text class="card-icon">🌟</text>
          <text class="card-title">{{ zodiacSign }}</text>
        </view>
        <view class="zodiac-info">
          <view class="info-row">
            <text class="info-label">农历生日</text>
            <text class="info-value">{{ lunarDate }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">幸运元素</text>
            <text class="info-value">{{ luckyElement }}</text>
          </view>
        </view>
      </view>

      <!-- 五行展示 -->
      <view class="card elements-card">
        <view class="card-header">
          <text class="card-icon">🎨</text>
          <text class="card-title">五行分析</text>
        </view>
        <view class="elements-chart">
          <view class="element-item" v-for="(count, element) in fiveElements" :key="element">
            <view class="element-bar" :class="`element-${element}`">
              <view class="element-fill" :style="{ width: `${(count / 8) * 100}%` }"></view>
            </view>
            <text class="element-label">{{ getElementName(element) }}: {{ count }}</text>
          </view>
        </view>
      </view>

      <!-- 星座 AI 解读 -->
      <view class="card interpretation-card" v-if="zodiacInterpretation">
        <view class="card-header">
          <text class="card-icon">📖</text>
          <text class="card-title">星座解读</text>
        </view>
        <view class="interpretation-content">
          <view class="interpretation-section" v-if="zodiacInterpretation.personality">
            <view class="section-title">✨ 性格特点</view>
            <text class="section-text">{{ zodiacInterpretation.personality }}</text>
          </view>
          <view class="interpretation-section" v-if="zodiacInterpretation.love">
            <view class="section-title">💕 爱情感情</view>
            <text class="section-text">{{ zodiacInterpretation.love }}</text>
          </view>
          <view class="interpretation-section" v-if="zodiacInterpretation.career">
            <view class="section-title">💼 事业发展</view>
            <text class="section-text">{{ zodiacInterpretation.career }}</text>
          </view>
          <view class="interpretation-section" v-if="zodiacInterpretation.guardianStar">
            <view class="section-title">⭐ 守护星</view>
            <text class="section-text">{{ zodiacInterpretation.guardianStar }}</text>
          </view>
          <view class="interpretation-section" v-if="zodiacInterpretation.luckyElements">
            <view class="section-title">🍀 幸运元素</view>
            <text class="section-text">{{ zodiacInterpretation.luckyElements }}</text>
          </view>
          <view class="interpretation-section" v-if="zodiacInterpretation.overall">
            <view class="section-title">🔮 综合运势</view>
            <text class="section-text">{{ zodiacInterpretation.overall }}</text>
          </view>
        </view>
      </view>

      <!-- AI 解读提示 -->
      <view class="card hint-card" v-else>
        <text class="hint-text">点击"生成AI解读"获取详细的星座分析</text>
      </view>
    </view>

    <!-- 八字 Tab -->
    <view class="tab-content" v-if="currentTab === 'bazi' && hasBasicData">
      <!-- 八字四柱展示 -->
      <view class="card bazi-card">
        <view class="card-header">
          <text class="card-icon">☯️</text>
          <text class="card-title">八字四柱</text>
        </view>
        <view class="bazi-pillars">
          <view class="pillar-item">
            <view class="pillar-label">年柱</view>
            <view class="pillar-value year-pillar">{{ baZiPillars.yearPillar }}</view>
          </view>
          <view class="pillar-divider">→</view>
          <view class="pillar-item">
            <view class="pillar-label">月柱</view>
            <view class="pillar-value month-pillar">{{ baZiPillars.monthPillar }}</view>
          </view>
          <view class="pillar-divider">→</view>
          <view class="pillar-item">
            <view class="pillar-label">日柱</view>
            <view class="pillar-value day-pillar">{{ baZiPillars.dayPillar }}</view>
          </view>
          <view class="pillar-divider">→</view>
          <view class="pillar-item">
            <view class="pillar-label">时柱</view>
            <view class="pillar-value hour-pillar">{{ baZiPillars.hourPillar }}</view>
          </view>
        </view>
      </view>

      <!-- 八字 AI 解读 -->
      <view class="card interpretation-card" v-if="baziInterpretation">
        <view class="card-header">
          <text class="card-icon">📖</text>
          <text class="card-title">八字解读</text>
        </view>
        <view class="interpretation-content">
          <view class="interpretation-section" v-if="baziInterpretation.mingJu">
            <view class="section-title">🏔️ 命局分析</view>
            <text class="section-text">{{ baziInterpretation.mingJu }}</text>
          </view>
          <view class="interpretation-section" v-if="baziInterpretation.wuXing">
            <view class="section-title">⚖️ 五行喜忌</view>
            <text class="section-text">{{ baziInterpretation.wuXing }}</text>
          </view>
          <view class="interpretation-section" v-if="baziInterpretation.character">
            <view class="section-title">👤 性格特质</view>
            <text class="section-text">{{ baziInterpretation.character }}</text>
          </view>
          <view class="interpretation-section" v-if="baziInterpretation.career">
            <view class="section-title">💰 事业财运</view>
            <text class="section-text">{{ baziInterpretation.career }}</text>
          </view>
          <view class="interpretation-section" v-if="baziInterpretation.marriage">
            <view class="section-title">💑 婚姻感情</view>
            <text class="section-text">{{ baziInterpretation.marriage }}</text>
          </view>
          <view class="interpretation-section" v-if="baziInterpretation.health">
            <view class="section-title">🏥 健康运势</view>
            <text class="section-text">{{ baziInterpretation.health }}</text>
          </view>
          <view class="interpretation-section" v-if="baziInterpretation.yearlyFortune">
            <view class="section-title">📈 流年运势</view>
            <text class="section-text">{{ baziInterpretation.yearlyFortune }}</text>
          </view>
          <view class="interpretation-section" v-if="baziInterpretation.advice">
            <view class="section-title">💡 开运建议</view>
            <text class="section-text">{{ baziInterpretation.advice }}</text>
          </view>
        </view>
      </view>

      <!-- AI 解读提示 -->
      <view class="card hint-card" v-else>
        <text class="hint-text">点击"生成AI解读"获取详细的八字分析</text>
      </view>
    </view>

    <!-- 初始状态提示 -->
    <view class="empty-state" v-if="!hasBasicData && !calculating">
      <text class="empty-icon">🌙</text>
      <text class="empty-text">点击"重新计算星盘"开始分析</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 状态
const currentTab = ref<'zodiac' | 'bazi'>('zodiac')
const calculating = ref(false)
const interpreting = ref(false)

// 数据
const basicData = ref<any>(null)
const readingData = ref<any>(null)

// 计算属性
const hasBasicData = computed(() => basicData.value !== null)
const zodiacSign = computed(() => basicData.value?.zodiacSign || '')
const lunarDate = computed(() => {
  if (!basicData.value?.lunar) return ''
  const l = basicData.value.lunar
  return `${l.lunarYearText}年${l.lunarMonthText}${l.lunarDayText}`
})
const fiveElements = computed(() => basicData.value?.fiveElements || {})
const baZiPillars = computed(() => basicData.value?.baZiPillars || {})
const luckyElement = computed(() => {
  const elements = fiveElements.value
  const maxElement = Object.entries(elements).reduce((a, b) =>
    (b[1] as number) > (a[1] as number) ? b : a
  )
  return getElementName(maxElement[0])
})
const zodiacInterpretation = computed(() => {
  if (!readingData.value?.zodiacInterpretation) return null
  try {
    return JSON.parse(readingData.value.zodiacInterpretation)
  } catch {
    return null
  }
})
const baziInterpretation = computed(() => {
  if (!readingData.value?.baziInterpretation) return null
  try {
    return JSON.parse(readingData.value.baziInterpretation)
  } catch {
    return null
  }
})

// 获取五行名称
function getElementName(element: string): string {
  const names: Record<string, string> = {
    wood: '木',
    fire: '火',
    earth: '土',
    metal: '金',
    water: '水'
  }
  return names[element] || element
}

// 计算星盘基础数据
async function handleCalculate() {
  if (!userStore.userInfo?.id) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  calculating.value = true
  try {
    const res: any = await api.astrology.calculate(userStore.userInfo.id)
    basicData.value = res
    uni.showToast({ title: '计算成功', icon: 'success' })
  } catch (error: any) {
    uni.showToast({ title: error.message || '计算失败', icon: 'none' })
  } finally {
    calculating.value = false
  }
}

// 生成 AI 解读
async function handleGenerateInterpretation() {
  if (!userStore.userInfo?.id) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  interpreting.value = true
  try {
    const res: any = await api.astrology.generateInterpretation()
    readingData.value = res
    uni.showToast({ title: '解读生成成功', icon: 'success' })
  } catch (error: any) {
    uni.showToast({ title: error.message || '生成失败', icon: 'none' })
  } finally {
    interpreting.value = false
  }
}

// 页面加载时获取已有的解读记录
async function loadExistingReading() {
  if (!userStore.userInfo?.id) return

  try {
    const reading: any = await api.astrology.getReading()
    if (reading) {
      readingData.value = reading
      // 如果有解读记录但没有基础数据，重新计算基础数据
      if (!basicData.value) {
        await handleCalculate()
      }
    }
  } catch (error) {
    // 忽略错误，可能还没有记录
  }
}

// 页面加载时先计算基础数据
async function init() {
  if (!userStore.userInfo?.id) return
  await handleCalculate()
  await loadExistingReading()
}

init()
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
}

// 操作按钮栏
.action-bar {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;

  button {
    flex: 1;
    height: 88rpx;
    border-radius: 16rpx;
    font-size: 28rpx;
    border: none;

    &.btn-calculate {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    &.btn-interpret {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;

      &[disabled] {
        opacity: 0.5;
      }
    }
  }
}

// Tab 切换
.tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20rpx;
  padding: 8rpx;
  margin-bottom: 30rpx;

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
    border-radius: 16rpx;
    transition: all 0.3s;

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .tab-icon {
      font-size: 36rpx;
      margin-bottom: 8rpx;
    }

    .tab-text {
      font-size: 26rpx;
      color: white;
    }
  }
}

// 卡片通用样式
.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    .card-icon {
      font-size: 40rpx;
      margin-right: 12rpx;
    }

    .card-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
}

// 星座卡片
.zodiac-card {
  .zodiac-info {
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 20rpx 0;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 28rpx;
        color: #999;
      }

      .info-value {
        font-size: 30rpx;
        font-weight: bold;
        color: #667eea;
      }
    }
  }
}

// 五行图表
.elements-card {
  .elements-chart {
    .element-item {
      margin-bottom: 20rpx;

      .element-bar {
        height: 24rpx;
        background: #f0f0f0;
        border-radius: 12rpx;
        overflow: hidden;
        margin-bottom: 8rpx;

        .element-fill {
          height: 100%;
          border-radius: 12rpx;
          transition: width 0.5s ease;
        }

        &.element-wood .element-fill {
          background: linear-gradient(90deg, #4ade80, #22c55e);
        }
        &.element-fire .element-fill {
          background: linear-gradient(90deg, #fb923c, #f97316);
        }
        &.element-earth .element-fill {
          background: linear-gradient(90deg, #fcd34d, #f59e0b);
        }
        &.element-metal .element-fill {
          background: linear-gradient(90deg, #e2e8f0, #94a3b8);
        }
        &.element-water .element-fill {
          background: linear-gradient(90deg, #60a5fa, #3b82f6);
        }
      }

      .element-label {
        font-size: 26rpx;
        color: #666;
      }
    }
  }
}

// 八字四柱
.bazi-card {
  .bazi-pillars {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .pillar-item {
      flex: 1;
      text-align: center;

      .pillar-label {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 12rpx;
      }

      .pillar-value {
        font-size: 36rpx;
        font-weight: bold;
        padding: 16rpx 8rpx;
        border-radius: 12rpx;

        &.year-pillar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        &.month-pillar {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }
        &.day-pillar {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }
        &.hour-pillar {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          color: white;
        }
      }
    }

    .pillar-divider {
      color: #ccc;
      font-size: 24rpx;
    }
  }
}

// AI 解读
.interpretation-card {
  .interpretation-content {
    .interpretation-section {
      margin-bottom: 32rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 12rpx;
      }

      .section-text {
        font-size: 26rpx;
        color: #666;
        line-height: 1.8;
      }
    }
  }
}

// 提示卡片
.hint-card {
  text-align: center;

  .hint-text {
    font-size: 28rpx;
    color: #999;
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
