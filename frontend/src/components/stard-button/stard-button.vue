<template>
  <view
    class="stard-button"
    :class="[`is-${variant}`, `is-${size}`, { 'is-block': block, 'is-disabled': disabled }]"
    :hover-class="disabled || loading ? 'none' : 'stard-button--pressed'"
    :hover-stay-time="80"
    @tap="onClick"
  >
    <view v-if="loading" class="sb-spinner" />
    <slot />
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** gold=星光金主按钮 / cinnabar=朱砂 / ghost=暗夜实底 / outline=描边 */
    variant?: 'gold' | 'cinnabar' | 'ghost' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'gold',
    size: 'md',
    block: false,
    disabled: false,
    loading: false,
  },
)

const emit = defineEmits<{
  (e: 'click', ev: unknown): void
}>()

function onClick(ev: unknown) {
  if (props.disabled || props.loading) return
  emit('click', ev)
}
</script>

<style lang="scss" scoped>
.stard-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $sd-radius-pill;
  transition: transform 0.15s ease, opacity 0.15s ease;

  &.is-block {
    display: flex;
    width: 100%;
  }

  &.is-sm {
    padding: 10rpx 28rpx;
    font-size: 24rpx;
  }

  &.is-md {
    padding: 16rpx 40rpx;
    font-size: 26rpx;
  }

  &.is-lg {
    padding: 22rpx 56rpx;
    font-size: 30rpx;
    font-weight: bold;
  }

  &.is-gold {
    background: linear-gradient(135deg, $sd-gold-bright 0%, $sd-gold 52%, #c9a558 100%);
    color: $sd-gold-ink;
    box-shadow: 0 6rpx 24rpx rgba(232, 195, 106, 0.28);
  }

  &.is-cinnabar {
    background: linear-gradient(135deg, #f0788a 0%, $sd-cinnabar 56%, $sd-cinnabar-deep 100%);
    color: #ffeef1;
    box-shadow: 0 6rpx 24rpx rgba(237, 90, 107, 0.26);
  }

  &.is-ghost {
    background: $sd-bg-raise;
    color: $sd-text;
    border: 1rpx solid $sd-stroke;
  }

  &.is-outline {
    background: transparent;
    color: $sd-gold;
    border: 1rpx solid rgba(232, 195, 106, 0.5);
  }

  &.is-disabled {
    opacity: 0.45;
  }
}

.stard-button--pressed {
  transform: scale(0.96);
  opacity: 0.88;
}

.sb-spinner {
  width: 26rpx;
  height: 26rpx;
  border: 3rpx solid rgba(74, 56, 19, 0.25);
  border-top-color: currentColor;
  border-radius: 50%;
  margin-right: 10rpx;
  animation: sb-spin 0.7s linear infinite;
}

@keyframes sb-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
