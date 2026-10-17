<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <view class="content sd-reveal">
      <view class="form-card sd-reveal-1">
        <view class="form-item">
          <text class="label">心情内容</text>
          <view class="night-note">
            <text class="note-mark">☽</text>
            <textarea
              class="textarea"
              v-model="content"
              placeholder="写下你的心情..."
              placeholder-style="color: #8d95bd"
            />
          </view>
        </view>
      </view>

      <view class="submit-wrap sd-reveal-2">
        <StardButton variant="gold" size="lg" block :loading="loading" @click="submit">
          ✦ 发布心情
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
const loading = ref(false)
const userStore = useUserStore()

async function submit() {
  if (!content.value) {
    uni.showToast({ title: '请输入心情内容', icon: 'none' })
    return
  }

  loading.value = true
  try {
    await api.treehole.create({
      userId: userStore.userInfo?.id,
      content: content.value
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

  /* 夜话笺：夜雾虚线心笺 */
  .night-note {
    position: relative;
    background: $sd-bg-raise;
    border: 2rpx dashed rgba(139, 124, 232, 0.4);
    border-radius: $sd-radius-lg;
    padding: 24rpx;

    .note-mark {
      position: absolute;
      top: 14rpx;
      right: 18rpx;
      font-size: 26rpx;
      color: rgba(139, 124, 232, 0.55);
      line-height: 1;
    }

    .textarea {
      width: 100%;
      min-height: 240rpx;
      padding: 0 44rpx 0 0;
      background: transparent;
      border: none;
      font-family: $sd-font-display;
      font-size: 28rpx;
      color: $sd-text;
      line-height: 1.8;
      box-sizing: border-box;
    }
  }
}

.submit-wrap {
  margin-top: 36rpx;
}
</style>
