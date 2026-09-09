<template>
  <view class="container">
    <!-- 计算按钮 -->
    <view class="action-bar">
      <button class="btn-calculate" @click="handleCalculate" :loading="calculating">
        <text v-if="!calculating">✨ 重新计算星盘</text>
        <text v-else>计算中...</text>
      </button>
      <view class="btn-interpret-wrapper">
        <button class="btn-interpret" @click="handleGenerateInterpretation" :disabled="!hasBasicData || interpreting || remainingAttempts <= 0">
          <text v-if="!interpreting">{{ remainingAttempts > 0 ? '🔮 生成AI解读' : '🔮 今日次数已用完' }}</text>
          <text v-else>解读中... {{ formatProgress() }}%</text>
        </button>
        <view v-if="interpreting" class="progress-bar">
          <view class="progress-fill" :style="{ width: `${interpretProgress}%` }"></view>
        </view>
      </view>
      <button class="btn-share" @click="handleShare" :disabled="!hasBasicData">
        <text>📤 分享</text>
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
      <view
        class="tab-item"
        :class="{ active: currentTab === 'kline' }"
        @click="currentTab = 'kline'"
      >
        <text class="tab-icon">📈</text>
        <text class="tab-text">人生K线</text>
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

    <!-- 人生K线 Tab -->
    <view class="tab-content" v-if="currentTab === 'kline' && hasBasicData">
      <!-- K线图表 -->
      <view class="card kline-card">
        <view class="card-header">
          <text class="card-icon">📈</text>
          <text class="card-title">人生运势K线图</text>
        </view>

        <!-- K线图表展示 -->
        <view class="kline-chart" v-if="klineInterpretation?.lifeStages">
          <view class="chart-container">
            <!-- Y轴刻度 -->
            <view class="y-axis">
              <view class="y-label" v-for="i in 5" :key="i">
                <text class="y-text">{{ 100 - (i - 1) * 25 }}</text>
              </view>
            </view>

            <!-- 图表区域 -->
            <view class="chart-area">
              <!-- 网格线 -->
              <view class="grid-lines">
                <view class="grid-line" v-for="i in 5" :key="'grid-' + i" :style="{ bottom: `${(i - 1) * 25}%` }"></view>
              </view>

              <!-- K线曲线 (SVG) -->
              <view class="kline-curve-container">
                <svg class="kline-curve-svg" viewBox="0 0 800 400" preserveAspectRatio="none">
                  <!-- 填充渐变区域 -->
                  <defs>
                    <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:rgba(102, 126, 234, 0.3);stop-opacity:1" />
                      <stop offset="100%" style="stop-color:rgba(102, 126, 234, 0.05);stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <!-- 填充区域 -->
                  <path
                    :d="getCurvePath(klineInterpretation.lifeStages, true)"
                    fill="url(#curveGradient)"
                    stroke="none"
                  />
                  <!-- 曲线 -->
                  <path
                    :d="getCurvePath(klineInterpretation.lifeStages, false)"
                    fill="none"
                    stroke="url(#lineGradient)"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <!-- 数据点 -->
                  <circle
                    v-for="(stage, index) in klineInterpretation.lifeStages"
                    :key="'point-' + index"
                    :cx="getPointX(index, klineInterpretation.lifeStages.length)"
                    :cy="getPointY(stage.fortune)"
                    r="6"
                    fill="#667eea"
                    stroke="white"
                    stroke-width="2"
                  />
                  <!-- 数值标签 -->
                  <text
                    v-for="(stage, index) in klineInterpretation.lifeStages"
                    :key="'label-' + index"
                    :x="getPointX(index, klineInterpretation.lifeStages.length)"
                    :y="getPointY(stage.fortune) - 15"
                    text-anchor="middle"
                    class="fortune-label"
                    fill="#667eea"
                    font-size="14"
                    font-weight="bold"
                  >{{ stage.fortune }}</text>
                </svg>
              </view>

              <!-- K线柱状图 -->
              <view class="kline-bars">
                <view
                  class="kline-bar-group"
                  v-for="(stage, index) in klineInterpretation.lifeStages"
                  :key="index"
                  @click="showStageDetail(stage)"
                >
                  <!-- K线柱 -->
                  <view class="kline-bar-wrapper" :style="{ height: `${stage.fortune}%` }">
                    <view class="kline-bar" :class="getFortuneClass(stage.fortune)"></view>
                  </view>
                  <!-- 阶段标签 -->
                  <view class="stage-label">
                    <text class="stage-age">{{ stage.age }}岁</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 整体趋势 -->
        <view class="overall-trend" v-if="klineInterpretation?.overallTrend">
          <view class="trend-title">📊 整体运势趋势</view>
          <text class="trend-text">{{ klineInterpretation.overallTrend }}</text>
        </view>
      </view>

      <!-- 人生阶段详情 -->
      <view class="card stages-card" v-if="klineInterpretation?.lifeStages">
        <view class="card-header">
          <text class="card-icon">📅</text>
          <text class="card-title">人生阶段详情</text>
        </view>
        <view class="stages-list">
          <view
            class="stage-item"
            v-for="(stage, index) in klineInterpretation.lifeStages"
            :key="index"
          >
            <view class="stage-header">
              <view class="stage-info">
                <text class="stage-age-large">{{ stage.age }}岁</text>
                <text class="stage-years">{{ stage.years }}</text>
              </view>
              <view class="fortune-badge" :class="getFortuneClass(stage.fortune)">
                <text class="fortune-value">{{ stage.fortune }}</text>
                <text class="fortune-text">运势指数</text>
              </view>
            </view>
            <view class="stage-details">
              <view class="stage-detail-row" v-if="stage.career">
                <text class="detail-icon">💼</text>
                <text class="detail-text">{{ stage.career }}</text>
              </view>
              <view class="stage-detail-row" v-if="stage.wealth">
                <text class="detail-icon">💰</text>
                <text class="detail-text">{{ stage.wealth }}</text>
              </view>
              <view class="stage-detail-row" v-if="stage.love">
                <text class="detail-icon">💕</text>
                <text class="detail-text">{{ stage.love }}</text>
              </view>
              <view class="stage-detail-row" v-if="stage.health">
                <text class="detail-icon">🏥</text>
                <text class="detail-text">{{ stage.health }}</text>
              </view>
              <view class="stage-detail-row key-event" v-if="stage.keyEvents">
                <text class="detail-icon">⚡</text>
                <text class="detail-text">{{ stage.keyEvents }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 综合建议 -->
      <view class="card advice-card" v-if="klineInterpretation?.advice">
        <view class="card-header">
          <text class="card-icon">💡</text>
          <text class="card-title">人生建议</text>
        </view>
        <text class="advice-text">{{ klineInterpretation.advice }}</text>
      </view>

      <!-- AI 解读提示 -->
      <view class="card hint-card" v-else>
        <text class="hint-text">点击"生成AI解读"获取人生K线分析</text>
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
import { share, copyShareLink } from '@/utils/wechatShare'

const userStore = useUserStore()

// 状态
const currentTab = ref<'zodiac' | 'bazi' | 'kline'>('zodiac')
const calculating = ref(false)
const interpreting = ref(false)
const interpretProgress = ref(0)

// 每日AI解读次数限制
const remainingAttempts = ref(5)
const totalAttempts = ref(5)
const usedAttempts = ref(0)

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
  // 后端已经解析为对象，直接返回
  return typeof readingData.value.zodiacInterpretation === 'object'
    ? readingData.value.zodiacInterpretation
    : null
})
const baziInterpretation = computed(() => {
  if (!readingData.value?.baziInterpretation) return null
  // 后端已经解析为对象，直接返回
  return typeof readingData.value.baziInterpretation === 'object'
    ? readingData.value.baziInterpretation
    : null
})
const klineInterpretation = computed(() => {
  if (!readingData.value?.klineInterpretation) return null
  // 后端已经解析为对象，直接返回
  return typeof readingData.value.klineInterpretation === 'object'
    ? readingData.value.klineInterpretation
    : null
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

// 获取运势等级样式类
function getFortuneClass(fortune: number): string {
  if (fortune >= 80) return 'fortune-excellent'
  if (fortune >= 65) return 'fortune-good'
  if (fortune >= 50) return 'fortune-medium'
  return fortune >= 35 ? 'fortune-low' : 'fortune-poor'
}

// 显示阶段详情（可扩展为弹窗）
function showStageDetail(stage: any) {
  console.log('Show stage detail:', stage)
  // 可以在这里添加弹窗显示更详细的信息
}

// K线曲线相关函数
// SVG viewBox 宽度800，高度400
// 需要将数据映射到这个坐标系
function getPointX(index: number, total: number): number {
  // 在 800 宽度内均匀分布，留出边距
  const padding = 60
  const availableWidth = 800 - padding * 2
  const step = availableWidth / Math.max(1, total - 1)
  return padding + step * index
}

function getPointY(fortune: number): number {
  // fortune 是 0-100，需要映射到 400-0 (SVG坐标系y向下)
  const padding = 40
  const availableHeight = 400 - padding * 2
  return 400 - padding - (fortune / 100) * availableHeight
}

// 生成平滑曲线路径（使用贝塞尔曲线）
function getCurvePath(stages: any[], filled: boolean): string {
  if (!stages || stages.length === 0) return ''

  const points = stages.map((stage, index) => ({
    x: getPointX(index, stages.length),
    y: getPointY(stage.fortune || 50)
  }))

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`
  }

  // 使用三次贝塞尔曲线创建平滑路径
  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]

    // 控制点：使用两点之间的中点，使得曲线平滑
    const midX = (p0.x + p1.x) / 2
    const cp1x = midX
    const cp1y = p0.y
    const cp2x = midX
    const cp2y = p1.y

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`
  }

  // 如果需要填充区域，闭合路径到底部
  if (filled) {
    const lastPoint = points[points.length - 1]
    const firstPoint = points[0]
    path += ` L ${lastPoint.x} 400 L ${firstPoint.x} 400 Z`
  }

  return path
}

// 计算星盘基础数据
async function handleCalculate(clearReading = true) {
  if (!userStore.userInfo?.id) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  calculating.value = true
  try {
    const res: any = await api.astrology.calculate(userStore.userInfo.id)
    basicData.value = res
    // 只有主动点击"重新计算"时才清空AI解读数据
    if (clearReading) {
      readingData.value = null
    }
    if (clearReading) {
      uni.showToast({ title: '计算成功，请重新生成AI解读', icon: 'success' })
    }
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

  // 检查剩余次数
  if (remainingAttempts.value <= 0) {
    uni.showToast({ title: '今日AI解读次数已用完，请明天再试', icon: 'none' })
    return
  }

  interpreting.value = true
  interpretProgress.value = 0
  const requestStartedAt = Date.now()

  // 启动进度模拟
  const progressInterval = setInterval(() => {
    if (interpretProgress.value < 90) {
      interpretProgress.value = Math.min(90, interpretProgress.value + Math.random() * 15)
    }
  }, 2000)

  try {
    console.log('[Frontend] Calling API...')
    const res: any = await api.astrology.generateInterpretation()
    console.log('[Frontend] API response received:', res)
    console.log('[Frontend] Response has zodiacInterpretation:', !!res?.zodiacInterpretation)
    console.log('[Frontend] Response has baziInterpretation:', !!res?.baziInterpretation)
    console.log('[Frontend] Response has klineInterpretation:', !!res?.klineInterpretation)
    readingData.value = res
    interpretProgress.value = 100
    uni.showToast({ title: '解读生成成功', icon: 'success' })
    // 更新剩余次数
    await loadRemainingAttempts()
  } catch (error: any) {
    console.error('[Frontend] API error:', error)
    // 后端生成约 1-4 分钟，若网关/网络中途断开（504/超时/请求失败），
    // 后端通常会继续跑完并写库 —— 轮询把结果捞回来，避免用户重试浪费次数
    const msg = error?.message || ''
    const likelyTimeout = /504|超时|timeout|请求失败|网络/i.test(msg)
    if (likelyTimeout && await pollReadingAfterTimeout(requestStartedAt)) {
      interpretProgress.value = 100
      uni.showToast({ title: '解读已生成完成', icon: 'success' })
      await loadRemainingAttempts()
    } else {
      uni.showToast({ title: msg || '生成失败，请稍后重试', icon: 'none' })
      // 如果是次数限制错误，更新剩余次数
      if (msg.includes('次数已用完')) {
        await loadRemainingAttempts()
      }
    }
  } finally {
    clearInterval(progressInterval)
    setTimeout(() => {
      interpreting.value = false
      interpretProgress.value = 0
    }, 500)
  }
}

// 断连后轮询解读结果：每 8 秒查一次库，最多等 5 分钟。
// 只接受 startedAt 之后写入的结果（updatedAt 由数据库自动更新），避免把旧解读当成新结果
async function pollReadingAfterTimeout(startedAt: number): Promise<boolean> {
  for (let i = 0; i < 38; i++) {
    await new Promise((r) => setTimeout(r, 8000))
    try {
      const reading: any = await api.astrology.getReading()
      const fresh = reading?.updatedAt ? new Date(reading.updatedAt).getTime() >= startedAt - 5000 : true
      if (fresh && reading?.zodiacInterpretation && reading?.baziInterpretation && reading?.klineInterpretation) {
        readingData.value = reading
        return true
      }
    } catch (e) {
      // 网络抖动，继续下一轮
    }
  }
  return false
}

// 加载剩余次数
async function loadRemainingAttempts() {
  if (!userStore.userInfo?.id) return

  try {
    const res: any = await api.astrology.getRemainingAttempts()
    remainingAttempts.value = res.remaining
    totalAttempts.value = res.total
    usedAttempts.value = res.used
  } catch (error) {
    console.error('加载剩余次数失败:', error)
  }
}

// 格式化进度显示（保留1位小数）
const formatProgress = () => {
  return interpretProgress.value.toFixed(1)
}

// 页面加载时获取已有的解读记录
async function loadExistingReading() {
  if (!userStore.userInfo?.id) return

  try {
    const reading: any = await api.astrology.getReading()
    if (reading) {
      readingData.value = reading
    }
  } catch (error) {
    // 忽略错误，可能还没有记录
  }
}

// 页面加载时先加载已有数据，再计算基础数据（如果需要）
async function init() {
  if (!userStore.userInfo?.id) return
  // 加载剩余次数
  await loadRemainingAttempts()
  // 先加载已有的解读数据（静默加载，不显示弹窗）
  await loadExistingReading()
  // 如果没有基础数据，静默计算（不显示弹窗）
  if (!basicData.value) {
    await handleCalculate(false)
  }
}

// 分享功能
async function handleShare() {
  if (!hasBasicData.value) {
    uni.showToast({ title: '请先计算星盘', icon: 'none' })
    return
  }

  const title = `我的${zodiacSign.value}星盘分析`
  const desc = `农历${lunarDate.value}出生，幸运元素是${luckyElement.value}`

  await share({
    title,
    desc,
    imageUrl: '' // 可以设置分享图片
  })
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

    &.btn-share {
      flex: 0 0 auto;
      min-width: 140rpx;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;

      &[disabled] {
        opacity: 0.5;
      }
    }
  }

  .btn-interpret-wrapper {
    flex: 1;
    position: relative;

    button {
      width: 100%;
      height: 88rpx;
      border-radius: 16rpx;
      font-size: 28rpx;
      border: none;

      &.btn-interpret {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;

        &[disabled] {
          opacity: 0.5;
        }
      }
    }

    .progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 6rpx;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 0 0 16rpx 16rpx;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
        transition: width 0.3s ease;
        box-shadow: 0 0 10rpx rgba(255, 215, 0, 0.8);
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

// 人生K线图表
.kline-card {
  .kline-chart {
    margin-bottom: 32rpx;

    .chart-container {
      display: flex;
      height: 400rpx;
      position: relative;
    }

    .y-axis {
      width: 60rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-right: 16rpx;

      .y-label {
        .y-text {
          font-size: 20rpx;
          color: #999;
        }
      }
    }

    .chart-area {
      flex: 1;
      position: relative;
      border-left: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }

    .kline-curve-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      pointer-events: none;

      .kline-curve-svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .fortune-label {
        font-family: sans-serif;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
      }
    }

    .grid-lines {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .grid-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        background: #f0f0f0;
      }
    }

    .kline-bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 100%;
      padding: 0 8rpx;

      .kline-bar-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        justify-content: flex-end;
        cursor: pointer;

        .kline-bar-wrapper {
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          max-height: 100%;
          min-height: 20rpx;
          transition: height 0.5s ease;
        }

        .kline-bar {
          width: 70%;
          border-radius: 8rpx 8rpx 0 0;
          transition: all 0.3s ease;

          &.fortune-excellent {
            background: linear-gradient(180deg, #4ade80, #22c55e);
          }
          &.fortune-good {
            background: linear-gradient(180deg, #60a5fa, #3b82f6);
          }
          &.fortune-medium {
            background: linear-gradient(180deg, #fcd34d, #f59e0b);
          }
          &.fortune-low {
            background: linear-gradient(180deg, #fb923c, #f97316);
          }
          &.fortune-poor {
            background: linear-gradient(180deg, #f87171, #ef4444);
          }
        }

        .stage-label {
          margin-top: 8rpx;

          .stage-age {
            font-size: 20rpx;
            color: #666;
          }
        }
      }
    }
  }

  .overall-trend {
    padding: 24rpx;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: 16rpx;

    .trend-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 12rpx;
    }

    .trend-text {
      font-size: 26rpx;
      color: #666;
      line-height: 1.8;
    }
  }
}

// 人生阶段列表
.stages-card {
  .stages-list {
    .stage-item {
      padding: 24rpx;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 16rpx;
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .stage-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;

        .stage-info {
          display: flex;
          flex-direction: column;

          .stage-age-large {
            font-size: 36rpx;
            font-weight: bold;
            color: #667eea;
          }

          .stage-years {
            font-size: 24rpx;
            color: #999;
          }
        }

        .fortune-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12rpx 20rpx;
          border-radius: 12rpx;

          &.fortune-excellent {
            background: linear-gradient(135deg, #4ade80, #22c55e);
          }
          &.fortune-good {
            background: linear-gradient(135deg, #60a5fa, #3b82f6);
          }
          &.fortune-medium {
            background: linear-gradient(135deg, #fcd34d, #f59e0b);
          }
          &.fortune-low {
            background: linear-gradient(135deg, #fb923c, #f97316);
          }
          &.fortune-poor {
            background: linear-gradient(135deg, #f87171, #ef4444);
          }

          .fortune-value {
            font-size: 32rpx;
            font-weight: bold;
            color: white;
          }

          .fortune-text {
            font-size: 20rpx;
            color: rgba(255, 255, 255, 0.9);
          }
        }
      }

      .stage-details {
        .stage-detail-row {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12rpx;

          &:last-child {
            margin-bottom: 0;
          }

          &.key-event {
            padding: 12rpx;
            background: rgba(255, 193, 7, 0.1);
            border-radius: 8rpx;
            border-left: 4rpx solid #ffc107;
          }

          .detail-icon {
            font-size: 28rpx;
            margin-right: 12rpx;
            flex-shrink: 0;
          }

          .detail-text {
            flex: 1;
            font-size: 26rpx;
            color: #555;
            line-height: 1.6;
          }
        }
      }
    }
  }
}

// 综合建议卡片
.advice-card {
  .advice-text {
    font-size: 28rpx;
    color: #555;
    line-height: 1.8;
    padding: 24rpx;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-radius: 16rpx;
  }
}
</style>
