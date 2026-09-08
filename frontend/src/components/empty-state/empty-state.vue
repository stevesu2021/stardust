<template>
  <view class="empty-state">
    <view class="es-ring">
      <text class="es-icon">{{ icon }}</text>
    </view>
    <text class="es-title">{{ title }}</text>
    <text v-if="desc" class="es-desc">{{ desc }}</text>
    <view v-if="actionText" class="es-action" @tap="emit('action')">
      <text>{{ actionText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title: string
    desc?: string
    actionText?: string
  }>(),
  {
    icon: '✧',
    desc: '',
    actionText: '',
  },
)

const emit = defineEmits<{
  (e: 'action'): void
}>()
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 90rpx 40rpx;
}

.es-ring {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 34%, rgba(232, 195, 106, 0.14) 0%, transparent 70%), $sd-bg-raise;
  border: 1rpx solid rgba(232, 195, 106, 0.35);
  margin-bottom: 30rpx;

  .es-icon {
    font-size: 56rpx;
    color: $sd-gold;
  }
}

.es-title {
  font-size: 30rpx;
  color: $sd-text-2;
  margin-bottom: 10rpx;
}

.es-desc {
  font-size: 24rpx;
  color: $sd-text-3;
  margin-bottom: 34rpx;
}

.es-action {
  padding: 14rpx 52rpx;
  border-radius: $sd-radius-pill;
  border: 1rpx solid rgba(232, 195, 106, 0.5);
  color: $sd-gold;
  font-size: 26rpx;

  &:active {
    opacity: 0.7;
  }
}
</style>
