<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <view class="content sd-reveal">
      <view class="form-card sd-reveal-1">
        <view class="form-item">
          <text class="label">表白对象</text>
          <input
            class="input"
            v-model="targetName"
            placeholder="对方的名字"
            placeholder-style="color: #8d95bd"
          />
        </view>

        <view class="sd-divider" />

        <view class="form-item">
          <text class="label">表白内容</text>
          <textarea
            class="textarea"
            v-model="content"
            placeholder="写下你的表白..."
            placeholder-style="color: #8d95bd"
          />
        </view>

        <view class="sd-divider" />

        <view class="form-item anon-row">
          <text class="label">匿名表白</text>
          <switch class="anon-switch" :checked="isAnonymous" @change="onAnonymousChange" color="#ed5a6b" />
        </view>
      </view>

      <view class="submit-wrap sd-reveal-2">
        <StardButton variant="cinnabar" size="lg" block :loading="loading" @click="submit">
          ❥ 发送表白
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

const targetName = ref('')
const content = ref('')
const isAnonymous = ref(true)
const loading = ref(false)
const userStore = useUserStore()

function onAnonymousChange(e: any) {
  isAnonymous.value = e.detail.value
}

async function submit() {
  if (!targetName.value || !content.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }

  loading.value = true
  try {
    await api.confession.create({
      userId: userStore.userInfo?.id,
      targetName: targetName.value,
      content: content.value,
      isAnonymous: isAnonymous.value
    })

    uni.showToast({ title: '表白成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } catch (error: any) {
    uni.showToast({ title: error.message || '表白失败', icon: 'none' })
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

  .textarea {
    width: 100%;
    min-height: 220rpx;
    background: $sd-bg-raise;
    border: 1rpx solid $sd-stroke;
    border-radius: $sd-radius;
    padding: 20rpx 24rpx;
    font-family: $sd-font-display;
    font-size: 28rpx;
    color: $sd-text;
    line-height: 1.8;
    box-sizing: border-box;
  }

  &.anon-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      margin-bottom: 0;
    }

    .anon-switch {
      transform: scale(0.9);
    }
  }
}

.submit-wrap {
  margin-top: 36rpx;
}
</style>
