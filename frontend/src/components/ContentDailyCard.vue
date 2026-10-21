<!-- frontend/src/components/ContentDailyCard.vue -->
<template>
  <view v-if="daily" class="daily-card sd-reveal-2" @click="open">
    <image v-if="daily.coverImage" :src="daily.coverImage" class="cover" mode="aspectFill" />
    <view class="info">
      <text class="kicker">✦ 今日星读</text>
      <text class="title">{{ daily.title }}</text>
      <text class="summary">{{ daily.summary }}</text>
      <text class="more">阅读全文 ›</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'

const daily = ref<any>(null)

onMounted(async () => {
  try {
    daily.value = await api.content.getDaily()
  } catch (e) {
    daily.value = null // 无数据隐藏整卡
  }
})

function open() {
  if (daily.value?.id) {
    uni.navigateTo({ url: `/pages/content/detail?id=${daily.value.id}` })
  }
}
</script>

<style lang="scss" scoped>
.daily-card {
  @include sd-card-surface(gold);
  display: flex;
  overflow: hidden;
  margin-bottom: 24rpx;

  .cover {
    width: 200rpx;
    height: 200rpx;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    min-width: 0;
    padding: 24rpx;
    display: flex;
    flex-direction: column;
  }

  .kicker {
    font-size: 20rpx;
    color: $sd-gold;
    letter-spacing: 2rpx;
    margin-bottom: 8rpx;
  }

  .title {
    font-family: $sd-font-display;
    font-size: 30rpx;
    font-weight: bold;
    color: $sd-text;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .summary {
    margin-top: 10rpx;
    font-size: 22rpx;
    color: $sd-text-2;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .more {
    margin-top: auto;
    font-size: 22rpx;
    color: $sd-gold;
  }
}
</style>
