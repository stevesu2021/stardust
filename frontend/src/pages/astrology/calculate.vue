<template>
  <view class="container">
    <view class="result" v-if="result">
      <view class="result-item">
        <text class="label">农历日期</text>
        <text class="value">{{ result.lunar.lunarYearText }}年{{ result.lunar.lunarMonthText }}{{ result.lunar.lunarDayText }}</text>
      </view>

      <view class="result-item">
        <text class="label">星座</text>
        <text class="value">{{ result.zodiacSign }}</text>
      </view>

      <view class="result-item">
        <text class="label">五行</text>
        <view class="elements">
          <text class="element">木: {{ result.fiveElements.wood }}</text>
          <text class="element">火: {{ result.fiveElements.fire }}</text>
          <text class="element">土: {{ result.fiveElements.earth }}</text>
          <text class="element">金: {{ result.fiveElements.metal }}</text>
          <text class="element">水: {{ result.fiveElements.water }}</text>
        </view>
      </view>
    </view>

    <button class="btn" @click="calculate" :loading="loading">计算星盘</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const result = ref<any>(null)
const loading = ref(false)
const userStore = useUserStore()

async function calculate() {
  if (!userStore.userInfo?.id) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res: any = await api.astrology.calculate(userStore.userInfo.id)
    result.value = res
    uni.showToast({ title: '计算成功', icon: 'success' })
  } catch (error: any) {
    uni.showToast({ title: error.message || '计算失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
}

.result {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;

  .result-item {
    margin-bottom: 40rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      display: block;
      font-size: 28rpx;
      color: #999;
      margin-bottom: 20rpx;
    }

    .value {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }

    .elements {
      .element {
        display: block;
        font-size: 32rpx;
        color: #333;
        margin-bottom: 10rpx;
      }
    }
  }
}

.btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12rpx;
  font-size: 32rpx;
}
</style>