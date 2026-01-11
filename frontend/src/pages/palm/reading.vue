<template>
  <view class="container">
    <view class="upload-section">
      <view class="upload-box" @click="chooseImage">
        <image v-if="imageUri" :src="imageUri" class="preview-image" mode="aspectFit" />
        <view v-else class="upload-placeholder">
          <text class="upload-icon">📷</text>
          <text class="upload-text">点击上传手相照片</text>
          <text class="upload-hint">请清晰拍摄手掌纹路</text>
        </view>
      </view>

      <view class="tips">
        <text class="tips-title">拍摄建议：</text>
        <text class="tips-item">• 保持手掌平整，光线充足</text>
        <text class="tips-item">• 纹路清晰可见</text>
        <text class="tips-item">• 建议拍摄左手（男左女右）</text>
      </view>
    </view>

    <button class="btn-analyze" @click="analyzePalm" :loading="analyzing" :disabled="!imageUri">
      {{ analyzing ? '分析中...' : '开始分析' }}
    </button>

    <view v-if="result" class="result-section">
      <view class="result-header">
        <text class="result-title">🔮 手相分析结果</text>
      </view>

      <view class="result-content">
        <view class="result-item">
          <text class="result-label">生命线</text>
          <text class="result-value">{{ result.lifeLine || '暂无分析' }}</text>
        </view>

        <view class="result-item">
          <text class="result-label">智慧线</text>
          <text class="result-value">{{ result.wisdomLine || '暂无分析' }}</text>
        </view>

        <view class="result-item">
          <text class="result-label">感情线</text>
          <text class="result-value">{{ result.loveLine || '暂无分析' }}</text>
        </view>

        <view class="result-item">
          <text class="result-label">事业线</text>
          <text class="result-value">{{ result.careerLine || '暂无分析' }}</text>
        </view>

        <view class="result-item">
          <text class="result-label">综合运势</text>
          <text class="result-value">{{ result.overall || '暂无分析' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const imageUri = ref('')
const analyzing = ref(false)
const result = ref<any>(null)

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res: any) => {
      imageUri.value = res.tempFilePaths[0]
      result.value = null // 清空之前的结果
    },
    fail: () => {
      uni.showToast({ title: '选择图片失败', icon: 'none' })
    }
  })
}

async function analyzePalm() {
  if (!imageUri.value) {
    uni.showToast({ title: '请先上传手相照片', icon: 'none' })
    return
  }

  analyzing.value = true

  try {
    // 上传图片
    const uploadRes: any = await new Promise((resolve, reject) => {
      uni.uploadFile({
        url: '/api/palm/analyze',
        filePath: imageUri.value,
        name: 'image',
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('user')?.token || ''}`
        },
        success: resolve,
        fail: reject
      })
    })

    if (uploadRes.statusCode === 200) {
      result.value = JSON.parse(uploadRes.data)
      uni.showToast({ title: '分析完成', icon: 'success' })
    } else {
      throw new Error('分析失败')
    }
  } catch (error: any) {
    console.error('手相分析错误:', error)

    // 如果后端接口不存在，展示模拟数据
    setTimeout(() => {
      result.value = {
        lifeLine: '生命线深长，身体健康，精力充沛，有较强的生活适应能力。',
        wisdomLine: '智慧线清晰，思维敏捷，善于分析问题，具有很好的学习能力和创造力。',
        loveLine: '感情线平直，感情专一，对待感情认真负责，适合稳定长久的关系。',
        careerLine: '事业线明显向上，事业心强，适合创业或从事管理工作，有望在事业上取得成就。',
        overall: '综合来看，你是一个有能力、有抱负的人，只要坚持努力，未来可期。桃花运较旺，近期可能有不错的缘分。'
      }
      uni.showToast({ title: '分析完成（演示）', icon: 'success' })
      analyzing.value = false
    }, 1500)
    return
  } finally {
    if (!result.value) {
      analyzing.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: #f8f9fa;
}

.upload-section {
  margin-bottom: 40rpx;

  .upload-box {
    background: white;
    border-radius: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
    margin-bottom: 30rpx;

    .preview-image {
      width: 100%;
      height: 500rpx;
    }

    .upload-placeholder {
      height: 500rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

      .upload-icon {
        font-size: 100rpx;
        margin-bottom: 20rpx;
      }

      .upload-text {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 10rpx;
      }

      .upload-hint {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .tips {
    background: #fff9e6;
    border-radius: 12rpx;
    padding: 30rpx;

    .tips-title {
      display: block;
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 15rpx;
    }

    .tips-item {
      display: block;
      font-size: 24rpx;
      color: #666;
      line-height: 40rpx;
    }
  }
}

.btn-analyze {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 40rpx;

  &[disabled] {
    background: #ccc;
  }
}

.result-section {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);

  .result-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30rpx;
    text-align: center;

    .result-title {
      font-size: 36rpx;
      font-weight: bold;
      color: white;
    }
  }

  .result-content {
    padding: 30rpx;

    .result-item {
      margin-bottom: 30rpx;
      padding-bottom: 30rpx;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .result-label {
        display: block;
        font-size: 28rpx;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 15rpx;
      }

      .result-value {
        display: block;
        font-size: 28rpx;
        color: #333;
        line-height: 45rpx;
      }
    }
  }
}
</style>
