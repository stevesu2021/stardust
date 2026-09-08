<template>
  <view
    class="stard-card"
    :class="[`is-${variant}`, { 'is-glow': glow }]"
    @tap="onClick"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** plain=暗夜卡片 / gold=金边强调 / cinnabar=朱砂强调 */
    variant?: 'plain' | 'gold' | 'cinnabar'
    glow?: boolean
  }>(),
  {
    variant: 'plain',
    glow: false,
  },
)

const emit = defineEmits<{
  (e: 'click', ev: unknown): void
}>()

function onClick(ev: unknown) {
  emit('click', ev)
}
</script>

<style lang="scss" scoped>
.stard-card {
  position: relative;
  background: $sd-bg-elev;
  border: 1rpx solid $sd-stroke;
  border-radius: $sd-radius-lg;
  overflow: hidden;

  &.is-gold {
    border-color: rgba(232, 195, 106, 0.38);
    background:
      linear-gradient(160deg, rgba(232, 195, 106, 0.1) 0%, rgba(232, 195, 106, 0.02) 44%),
      $sd-bg-elev;

    &.is-glow {
      box-shadow: $sd-glow-gold;
    }
  }

  &.is-cinnabar {
    border-color: rgba(237, 90, 107, 0.34);
    background:
      linear-gradient(160deg, rgba(237, 90, 107, 0.1) 0%, rgba(237, 90, 107, 0.02) 46%),
      $sd-bg-elev;

    &.is-glow {
      box-shadow: $sd-glow-cinnabar;
    }
  }
}
</style>
