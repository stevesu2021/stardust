<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="label">表白对象</text>
        <input class="input" v-model="targetName" placeholder="对方的名字" />
      </view>

      <view class="form-item">
        <text class="label">表白内容</text>
        <textarea class="textarea" v-model="content" placeholder="写下你的表白..." />
      </view>

      <view class="form-item">
        <text class="label">匿名表白</text>
        <switch :checked="isAnonymous" @change="onAnonymousChange" />
      </view>

      <button class="btn" @click="submit" :loading="loading">发送表白</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

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

    .input {
      width: 100%;
      height: 88rpx;
      background: white;
      border-radius: 12rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
      border: 1rpx solid #e5e5e5;
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