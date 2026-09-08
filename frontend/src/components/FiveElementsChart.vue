<template>
  <view class="five-elements-chart">
    <!-- 环形图 -->
    <view class="circle-container">
      <view class="circle-chart">
        <view
          v-for="(item, index) in chartSegments"
          :key="index"
          class="segment"
          :class="item.element"
          :style="getSegmentStyle(item)"
        ></view>
        <view class="center-circle">
          <view class="dominant-element">
            <text class="element-icon">{{ dominantElement.icon }}</text>
            <text class="element-name">{{ dominantElement.name }}</text>
            <text class="element-count">{{ dominantElement.count }}个</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 五行柱状图 -->
    <view class="bars-container">
      <view
        v-for="element in elements"
        :key="element.key"
        class="bar-item"
        :class="element.key"
      >
        <view class="bar-header">
          <text class="bar-icon">{{ element.icon }}</text>
          <text class="bar-name">{{ element.name }}</text>
          <text class="bar-count">{{ element.count }}</text>
        </view>
        <view class="bar-track">
          <view
            class="bar-fill"
            :style="{ width: getBarWidth(element.count) }"
          ></view>
        </view>
      </view>
    </view>

    <!-- 五行描述 -->
    <view class="description">
      <text class="desc-text">{{ getDescription() }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface FiveElementsData {
  wood: number
  fire: number
  earth: number
  metal: number
  water: number
}

const props = defineProps<{
  data: FiveElementsData
}>()

// 五行元素配置（夜观星象 · 暗色五行色板）
const elementsConfig = [
  {
    key: 'wood',
    name: '木',
    icon: '木',
    color: '#6fbf8f',
    gradient: 'linear-gradient(135deg, #6fbf8f 0%, #8fd4aa 100%)',
    description: '主仁，代表生长、升发、条达舒畅'
  },
  {
    key: 'fire',
    name: '火',
    icon: '火',
    color: '#e8735e',
    gradient: 'linear-gradient(135deg, #e8735e 0%, #f09380 100%)',
    description: '主礼，代表温热、升腾、明亮'
  },
  {
    key: 'earth',
    name: '土',
    icon: '土',
    color: '#c09a6b',
    gradient: 'linear-gradient(135deg, #c09a6b 0%, #d4b285 100%)',
    description: '主信，代表承载、生化、受纳'
  },
  {
    key: 'metal',
    name: '金',
    icon: '金',
    color: '#d9c08a',
    gradient: 'linear-gradient(135deg, #d9c08a 0%, #e8d4a8 100%)',
    description: '主义，代表沉降、肃杀、收敛'
  },
  {
    key: 'water',
    name: '水',
    icon: '水',
    color: '#6a9bd8',
    gradient: 'linear-gradient(135deg, #6a9bd8 0%, #8ab2e4 100%)',
    description: '主智，代表寒冷、流动、潜藏'
  }
]

// 计算五行数据
const elements = computed(() => {
  return elementsConfig.map(config => ({
    ...config,
    count: props.data[config.key] || 0
  }))
})

// 计算主导元素
const dominantElement = computed(() => {
  const sorted = [...elements.value].sort((a, b) => b.count - a.count)
  return sorted[0] || { name: '未计算', icon: '❓', count: 0 }
})

// 计算环形图片段
const chartSegments = computed(() => {
  const total = Object.values(props.data).reduce((sum, val) => sum + val, 0)
  if (total === 0) return []

  let currentAngle = 0
  return elements.value
    .filter(e => e.count > 0)
    .map(element => {
      const percentage = (element.count / total) * 100
      const rotation = currentAngle
      currentAngle += (element.count / total) * 360
      return {
        element: element.key,
        percentage,
        rotation
      }
    })
})

// 获取片段样式
function getSegmentStyle(item: any) {
  const gap = 2 // 片段间隔角度
  const percentage = Math.max(item.percentage - gap / 3.6, 0) // 减去间隔

  return {
    background: elementsConfig.find(e => e.key === item.element)?.gradient,
    transform: `rotate(${item.rotation}deg)`,
    clipPath: `polygon(50% 50%, 50% 0%, ${50 + percentage * 0.5}% 0%, ${50 + percentage * 0.5}% 100%)`,
    opacity: percentage > 0 ? 1 : 0
  }
}

// 获取柱状图宽度
function getBarWidth(count: number) {
  const maxCount = Math.max(...elements.value.map(e => e.count))
  if (maxCount === 0) return '0%'
  return `${(count / maxCount) * 100}%`
}

// 获取五行描述
function getDescription() {
  const total = Object.values(props.data).reduce((sum, val) => sum + val, 0)
  if (total === 0) return '暂无五行数据'

  const strongElements = elements.value.filter(e => e.count >= 2).map(e => e.name)
  const weakElements = elements.value.filter(e => e.count === 0).map(e => e.name)

  let desc = `五行构成：`
  if (strongElements.length > 0) {
    desc += ` ${strongElements.join('、')}旺`
  }
  if (weakElements.length > 0) {
    desc += `，缺${weakElements.join('、')}`
  }
  return desc
}
</script>

<style lang="scss" scoped>
.five-elements-chart {
  margin-top: 20rpx;
}

// 环形图容器
.circle-container {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}

.circle-chart {
  position: relative;
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #6fbf8f 0deg 72deg,
    #e8735e 72deg 144deg,
    #c09a6b 144deg 216deg,
    #d9c08a 216deg 288deg,
    #6a9bd8 288deg 360deg
  );
  box-shadow: 0 8rpx 30rpx rgba(11, 14, 31, 0.5);
}

.segment {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.center-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160rpx;
  height: 160rpx;
  background: $sd-bg-elev;
  border: 1rpx solid $sd-stroke;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2rpx 10rpx rgba(0, 0, 0, 0.3);
}

.dominant-element {
  text-align: center;

  .element-icon {
    display: block;
    font-family: $sd-font-display;
    font-size: 44rpx;
    margin-bottom: 8rpx;
  }

  .element-name {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: $sd-text;
    margin-bottom: 4rpx;
  }

  .element-count {
    display: block;
    font-size: 24rpx;
    color: $sd-text-3;
  }
}

// 柱状图容器
.bars-container {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.bar-item {
  .bar-header {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;

    .bar-icon {
      font-size: 32rpx;
      margin-right: 12rpx;
    }

    .bar-name {
      font-size: 28rpx;
      color: $sd-text;
      font-weight: bold;
      margin-right: auto;
    }

    .bar-count {
      font-size: 28rpx;
      color: $sd-text-2;
      font-weight: bold;
    }
  }

  .bar-track {
    width: 100%;
    height: 16rpx;
    background: $sd-bg-raise;
    border-radius: 8rpx;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 8rpx;
    transition: width 0.8s ease-out;
  }

  &.wood .bar-fill {
    background: linear-gradient(90deg, #6fbf8f, #8fd4aa);
  }

  &.fire .bar-fill {
    background: linear-gradient(90deg, #e8735e, #f09380);
  }

  &.earth .bar-fill {
    background: linear-gradient(90deg, #c09a6b, #d4b285);
  }

  &.metal .bar-fill {
    background: linear-gradient(90deg, #d9c08a, #e8d4a8);
  }

  &.water .bar-fill {
    background: linear-gradient(90deg, #6a9bd8, #8ab2e4);
  }
}

// 描述
.description {
  text-align: center;
  padding: 20rpx;
  background: $sd-bg-raise;
  border: 1rpx solid $sd-stroke;
  border-radius: 12rpx;

  .desc-text {
    font-size: 26rpx;
    color: $sd-text-2;
    line-height: 1.6;
  }
}
</style>
