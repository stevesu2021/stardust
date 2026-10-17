<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <view class="content sd-reveal">
      <view class="form-card sd-reveal-1">
        <view class="form-item">
          <text class="label">祈愿内容</text>
          <textarea
            class="textarea"
            v-model="content"
            placeholder="写下你的祈愿..."
            placeholder-style="color: #8d95bd"
          />
        </view>

        <view class="sd-divider" />

        <view class="form-item">
          <text class="label">对象姓名（可选）</text>
          <input
            class="input"
            v-model="targetName"
            placeholder="对方的名字"
            placeholder-style="color: #8d95bd"
          />
        </view>
      </view>

      <view class="submit-wrap sd-reveal-2">
        <StardButton variant="gold" size="lg" block :loading="loading" @click="submit">
          ✦ 发布祈愿
        </StardButton>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'
import StardButton from '@/components/stard-button/stard-button.vue'

const content = ref('')
const targetName = ref('')
const loading = ref(false)
const userStore = useUserStore()

async function submit() {
  if (!content.value) {
    uni.showToast({ title: '请输入祈愿内容', icon: 'none' })
    return
  }

  loading.value = true
  try {
    await api.reunitePrayer.create({
      content: content.value,
      targetName: targetName.value
    })

    uni.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } catch (error: any) {
    uni.showToast({ title: error.message || '发布失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: $sd-bg;
}

.content {
  position: relative;
  z-index: 1;
  padding: 32rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
}

.form-card {
  @include sd-card-surface();
  padding: 36rpx 32rpx;
}

.form-item {
  .label {
    display: block;
    font-family: $sd-font-display;
    font-size: 28rpx;
    font-weight: bold;
    color: $sd-gold-bright;
    letter-spacing: 3rpx;
    margin-bottom: 18rpx;
  }

  .textarea {
    width: 100%;
    min-height: 220rpx;
    background: $sd-bg-raise;
    border: 1rpx solid $sd-stroke;
    border-radius: $sd-radius;
    padding: 20rpx 24rpx;
    font-size: 28rpx;
    color: $sd-text;
    line-height: 1.7;
    box-sizing: border-box;
  }

  .input {
    width: 100%;
    height: 88rpx;
    background: $sd-bg-raise;
    border: 1rpx solid $sd-stroke;
    border-radius: $sd-radius;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: $sd-text;
    box-sizing: border-box;
  }
}

.submit-wrap {
  margin-top: 36rpx;
}
</style>
