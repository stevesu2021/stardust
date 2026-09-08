<template>
  <view class="section-title">
    <text class="st-kicker">{{ kicker }}</text>
    <text class="st-title">{{ title }}</text>
    <view class="st-line" />
    <text v-if="more" class="st-more" @tap="emit('more')">{{ more }} ›</text>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    kicker?: string
    more?: string
  }>(),
  {
    kicker: '✦',
    more: '',
  },
)

const emit = defineEmits<{
  (e: 'more'): void
}>()
</script>

<style lang="scss" scoped>
.section-title {
  display: flex;
  align-items: center;
  padding: 34rpx 6rpx 22rpx;
}

.st-kicker {
  font-size: 22rpx;
  color: $sd-gold;
  margin-right: 12rpx;
}

.st-title {
  font-family: $sd-font-display;
  font-size: 32rpx;
  font-weight: bold;
  color: $sd-text;
  letter-spacing: 2rpx;
}

.st-line {
  flex: 1;
  height: 1rpx;
  margin: 0 20rpx;
  background: linear-gradient(90deg, rgba(232, 195, 106, 0.28) 0%, transparent 100%);
}

.st-more {
  font-size: 24rpx;
  color: $sd-text-3;
}
</style>
