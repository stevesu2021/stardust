<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="label">祈愿内容</text>
        <textarea class="textarea" v-model="content" placeholder="写下你的祈愿..." />
      </view>

      <view class="form-item">
        <text class="label">对象姓名（可选）</text>
        <input class="input" v-model="targetName" placeholder="对方的名字" />
      </view>

      <button class="btn" @click="submit" :loading="loading">发布祈愿</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

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
    await api.prayer.create({
      userId: userStore.userInfo?.id,
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
  padding: 40rpx;
}

.form {
  .form-item {
    margin-bottom: 40rpx;

    .label {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
    }

    .textarea {
      width: 100%;
      min-height: 200rpx;
      background: white;
      border-radius: 12rpx;
      padding: 20rpx;
      font-size: 28rpx;
      border: 1rpx solid #e5e5e5;
    }

    .input {
      width: 100%;
      height: 88rpx;
      background: white;
      border-radius: 12rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
      border: 1rpx solid #e5e5e5;
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
}
</style>