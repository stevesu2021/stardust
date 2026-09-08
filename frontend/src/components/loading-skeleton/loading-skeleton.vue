<template>
  <view class="loading-skeleton">
    <view
      v-for="i in rows"
      :key="i"
      class="ls-row"
      :style="{ height, marginBottom: gap }"
    >
      <view class="ls-sweep" />
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: number
    height?: string
    gap?: string
  }>(),
  {
    rows: 3,
    height: '28rpx',
    gap: '20rpx',
  },
)
</script>

<style lang="scss" scoped>
.loading-skeleton {
  width: 100%;
}

.ls-row {
  position: relative;
  overflow: hidden;
  border-radius: 10rpx;
  background: rgba(160, 178, 255, 0.08);
}

.ls-sweep {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(237, 239, 250, 0.09) 50%, transparent 100%);
  transform: translateX(-100%);
  animation: ls-sweep 1.4s ease-in-out infinite;
}

@keyframes ls-sweep {
  to {
    transform: translateX(100%);
  }
}
</style>
