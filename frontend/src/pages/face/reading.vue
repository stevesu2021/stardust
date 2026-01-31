<template>
  <view class="container">
    <!-- 头部切换 -->
    <view class="tabs">
      <view class="tab" :class="{ active: activeTab === 'analyze' }" @click="activeTab = 'analyze'">
        <text>看面相</text>
      </view>
      <view class="tab" :class="{ active: activeTab === 'history' }" @click="switchToHistory">
        <text>历史记录</text>
      </view>
    </view>

    <!-- 看面相页面 -->
    <view v-if="activeTab === 'analyze'" class="analyze-view">
      <!-- 上传区域 -->
      <view class="upload-section">
        <view class="upload-box" @click="chooseImage">
          <image v-if="imageUri" :src="imageUri" class="preview-image" mode="aspectFit" />
          <view v-else class="upload-placeholder">
            <text class="upload-icon">📷</text>
            <text class="upload-text">点击上传面部照片</text>
            <text class="upload-hint">请清晰拍摄正面面部</text>
          </view>
        </view>

        <view class="tips">
          <text class="tips-title">拍摄建议：</text>
          <text class="tips-item">• 保持正面，光线充足</text>
          <text class="tips-item">• 五官清晰可见</text>
          <text class="tips-item">• 表情自然放松</text>
        </view>
      </view>

      <button class="btn-analyze" @click="analyzeFace" :loading="analyzing" :disabled="!imageUri">
        {{ analyzing ? '分析中...' : '开始分析' }}
      </button>

      <!-- 分析结果 -->
      <view v-if="result" class="result-section">
        <view class="result-header">
          <text class="result-title">🔮 面相分析结果</text>
          <text class="result-subtitle">基于AI视觉大模型分析</text>
        </view>

        <view class="result-content">
          <!-- 额头 -->
          <view class="result-card forehead">
            <view class="card-header">
              <view class="icon-wrapper">
                <text class="card-icon">🧠</text>
              </view>
              <text class="card-title">额头</text>
            </view>
            <text class="card-content">{{ result.forehead || '暂无分析' }}</text>
          </view>

          <!-- 眼睛 -->
          <view class="result-card eyes">
            <view class="card-header">
              <view class="icon-wrapper">
                <text class="card-icon">👁️</text>
              </view>
              <text class="card-title">眼睛</text>
            </view>
            <text class="card-content">{{ result.eyes || '暂无分析' }}</text>
          </view>

          <!-- 鼻子 -->
          <view class="result-card nose">
            <view class="card-header">
              <view class="icon-wrapper">
                <text class="card-icon">👃</text>
              </view>
              <text class="card-title">鼻子</text>
            </view>
            <text class="card-content">{{ result.nose || '暂无分析' }}</text>
          </view>

          <!-- 嘴巴 -->
          <view class="result-card mouth">
            <view class="card-header">
              <view class="icon-wrapper">
                <text class="card-icon">👄</text>
              </view>
              <text class="card-title">嘴巴</text>
            </view>
            <text class="card-content">{{ result.mouth || '暂无分析' }}</text>
          </view>

          <!-- 综合运势 -->
          <view class="result-card overall">
            <view class="card-header">
              <view class="icon-wrapper">
                <text class="card-icon">⭐</text>
              </view>
              <text class="card-title">综合运势</text>
            </view>
            <text class="card-content">{{ result.overall || '暂无分析' }}</text>
          </view>
        </view>

        <!-- 重新分析按钮 -->
        <view class="action-buttons">
          <button class="btn-reanalyze" @click="resetAnalysis">
            <text>重新拍摄分析</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 历史记录页面 -->
    <view v-if="activeTab === 'history'" class="history-view">
      <view v-if="history.length === 0 && !historyLoading" class="empty-state">
        <text class="empty-icon">📜</text>
        <text class="empty-text">暂无历史记录</text>
        <text class="empty-hint">拍摄面相后，记录会自动保存在这里</text>
      </view>

      <view v-else-if="historyLoading" class="loading-state">
        <text>加载中...</text>
      </view>

      <view v-else class="history-list">
        <view
          v-for="item in history"
          :key="item.id"
          class="history-item"
          @click="viewHistoryDetail(item)"
        >
          <image :src="item.imageUrl" class="history-image" mode="aspectFill" />
          <view class="history-info">
            <text class="history-date">{{ formatDate(item.createdAt) }}</text>
            <text class="history-preview">{{ item.overall?.substring(0, 30) || '综合运势分析' }}...</text>
          </view>
          <view class="history-actions" @click.stop>
            <text class="btn-delete" @click="deleteHistoryItem(item.id)">删除</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 历史记录详情弹窗 -->
    <view v-if="showDetail" class="detail-modal" @click="showDetail = false">
      <view class="detail-content" @click.stop>
        <view class="detail-header">
          <text class="detail-title">面相分析详情</text>
          <text class="detail-close" @click="showDetail = false">✕</text>
        </view>
        <view class="detail-image-wrapper">
          <image :src="selectedItem?.imageUrl" class="detail-image" mode="aspectFit" />
        </view>
        <view class="detail-body">
          <view class="detail-section">
            <text class="detail-label">额头</text>
            <text class="detail-value">{{ selectedItem?.forehead || '暂无分析' }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">眼睛</text>
            <text class="detail-value">{{ selectedItem?.eyes || '暂无分析' }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">鼻子</text>
            <text class="detail-value">{{ selectedItem?.nose || '暂无分析' }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">嘴巴</text>
            <text class="detail-value">{{ selectedItem?.mouth || '暂无分析' }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">综合运势</text>
            <text class="detail-value">{{ selectedItem?.overall || '暂无分析' }}</text>
          </view>
        </view>
        <view class="detail-footer">
          <text class="detail-time">{{ formatDate(selectedItem?.createdAt) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { api } from '@/api'

const userStore = useUserStore()
const activeTab = ref('analyze')
const imageUri = ref('')
const analyzing = ref(false)
const result = ref<any>(null)
const history = ref<any[]>([])
const historyLoading = ref(false)
const showDetail = ref(false)
const selectedItem = ref<any>(null)

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res: any) => {
      imageUri.value = res.tempFilePaths[0]
      result.value = null
    },
    fail: () => {
      uni.showToast({ title: '选择图片失败', icon: 'none' })
    }
  })
}

async function analyzeFace() {
  if (!imageUri.value) {
    uni.showToast({ title: '请先上传面部照片', icon: 'none' })
    return
  }

  let token = userStore.token || ''

  if (!token) {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsed = JSON.parse(userData)
        token = parsed.token || ''
      }
    } catch (e) {
      console.error('获取 token 失败:', e)
    }
  }

  if (!token) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/auth/login' })
    }, 1500)
    return
  }

  analyzing.value = true

  try {
    const uploadRes: any = await new Promise((resolve, reject) => {
      uni.uploadFile({
        url: '/api/face/analyze',
        filePath: imageUri.value,
        name: 'image',
        header: {
          'Authorization': `Bearer ${token}`
        },
        success: resolve,
        fail: reject
      })
    })

    if (uploadRes.statusCode === 200 || uploadRes.statusCode === 201) {
      result.value = JSON.parse(uploadRes.data)
      uni.showToast({ title: '分析完成', icon: 'success' })
    } else if (uploadRes.statusCode === 401) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      setTimeout(() => {
        uni.navigateTo({ url: '/pages/auth/login' })
      }, 1500)
    } else {
      try {
        const errorData = JSON.parse(uploadRes.data)
        throw new Error(errorData.message || errorData.error || '分析失败')
      } catch {
        throw new Error(`分析失败 (${uploadRes.statusCode})`)
      }
    }
  } catch (error: any) {
    console.error('面相分析错误:', error)
    uni.showToast({ title: error.message || '分析失败，请重试', icon: 'none', duration: 3000 })
  } finally {
    analyzing.value = false
  }
}

function resetAnalysis() {
  imageUri.value = ''
  result.value = null
}

async function switchToHistory() {
  activeTab.value = 'history'
  await loadHistory()
}

async function loadHistory() {
  historyLoading.value = true
  try {
    const res: any = await api.face.getHistory()
    history.value = res
  } catch (error: any) {
    console.error('加载历史失败:', error)
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  } finally {
    historyLoading.value = false
  }
}

function viewHistoryDetail(item: any) {
  selectedItem.value = item
  showDetail.value = true
}

async function deleteHistoryItem(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条面相记录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await api.face.delete(id)
          history.value = history.value.filter(h => h.id !== id)
          uni.showToast({ title: '删除成功', icon: 'success' })
        } catch (error: any) {
          console.error('删除失败:', error)
          uni.showToast({ title: error.message || '删除失败', icon: 'none' })
        }
      }
    }
  })
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #e8ecf1 100%);
}

// 标签切换
.tabs {
  display: flex;
  background: white;
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  .tab {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #666;
    transition: all 0.3s;

    &.active {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      font-weight: bold;
    }
  }
}

// 看面相页面
.analyze-view {
  .upload-section {
    margin-bottom: 30rpx;

    .upload-box {
      background: white;
      border-radius: 24rpx;
      overflow: hidden;
      box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
      margin-bottom: 24rpx;

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
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

        .upload-icon {
          font-size: 120rpx;
          margin-bottom: 20rpx;
        }

        .upload-text {
          font-size: 32rpx;
          color: white;
          font-weight: bold;
          margin-bottom: 10rpx;
        }

        .upload-hint {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    .tips {
      background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
      border-radius: 16rpx;
      padding: 24rpx;

      .tips-title {
        display: block;
        font-size: 26rpx;
        font-weight: bold;
        color: #856404;
        margin-bottom: 12rpx;
      }

      .tips-item {
        display: block;
        font-size: 24rpx;
        color: #856404;
        line-height: 38rpx;
      }
    }
  }

  .btn-analyze {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    border-radius: 48rpx;
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 40rpx;
    box-shadow: 0 8rpx 25rpx rgba(240, 147, 251, 0.4);

    &[disabled] {
      background: linear-gradient(135deg, #ccc 0%, #999 100%);
      box-shadow: none;
    }
  }

  .result-section {
    background: white;
    border-radius: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

    .result-header {
      text-align: center;
      margin-bottom: 30rpx;

      .result-title {
        display: block;
        font-size: 40rpx;
        font-weight: bold;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 8rpx;
      }

      .result-subtitle {
        display: block;
        font-size: 24rpx;
        color: #999;
      }
    }

    .result-content {
      display: flex;
      flex-direction: column;
      gap: 20rpx;
    }

    .result-card {
      background: white;
      border-radius: 20rpx;
      padding: 30rpx;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 6rpx;
        height: 100%;
      }

      &.forehead::before {
        background: linear-gradient(180deg, #9C27B0 0%, #BA68C8 100%);
      }

      &.eyes::before {
        background: linear-gradient(180deg, #2196F3 0%, #64B5F6 100%);
      }

      &.nose::before {
        background: linear-gradient(180deg, #FF9800 0%, #FFB74D 100%);
      }

      &.mouth::before {
        background: linear-gradient(180deg, #E91E63 0%, #EC407A 100%);
      }

      &.overall::before {
        background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 16rpx;
        margin-bottom: 16rpx;

        .icon-wrapper {
          width: 56rpx;
          height: 56rpx;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
        }

        .card-icon {
          font-size: 32rpx;
        }

        .card-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }
      }

      .card-content {
        display: block;
        font-size: 28rpx;
        color: #555;
        line-height: 46rpx;
        padding-left: 72rpx;
      }
    }

    .action-buttons {
      margin-top: 30rpx;

      .btn-reanalyze {
        width: 100%;
        height: 88rpx;
        background: white;
        color: #f093fb;
        border: 2rpx solid #f093fb;
        border-radius: 44rpx;
        font-size: 28rpx;
        font-weight: bold;
      }
    }
  }
}

// 历史记录页面
.history-view {
  .empty-state {
    text-align: center;
    padding: 120rpx 40rpx;

    .empty-icon {
      display: block;
      font-size: 120rpx;
      margin-bottom: 30rpx;
    }

    .empty-text {
      display: block;
      font-size: 32rpx;
      color: #666;
      margin-bottom: 16rpx;
    }

    .empty-hint {
      display: block;
      font-size: 24rpx;
      color: #999;
    }
  }

  .loading-state {
    text-align: center;
    padding: 120rpx 40rpx;
    color: #999;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  .history-item {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 20rpx;
    padding: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

    .history-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 12rpx;
      margin-right: 20rpx;
    }

    .history-info {
      flex: 1;

      .history-date {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
      }

      .history-preview {
        display: block;
        font-size: 26rpx;
        color: #333;
        line-height: 40rpx;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    .history-actions {
      .btn-delete {
        padding: 12rpx 24rpx;
        background: #ffebee;
        color: #f44336;
        border-radius: 20rpx;
        font-size: 24rpx;
      }
    }
  }
}

// 历史记录详情弹窗
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;

  .detail-content {
    width: 660rpx;
    max-height: 80vh;
    background: white;
    border-radius: 24rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .detail-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .detail-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .detail-close {
        font-size: 40rpx;
        color: #999;
        padding: 0 10rpx;
      }
    }

    .detail-image-wrapper {
      padding: 20rpx;
      background: #f5f7fa;

      .detail-image {
        width: 100%;
        height: 400rpx;
        border-radius: 12rpx;
      }
    }

    .detail-body {
      flex: 1;
      padding: 30rpx;
      overflow-y: auto;

      .detail-section {
        margin-bottom: 30rpx;

        .detail-label {
          display: block;
          font-size: 26rpx;
          color: #f093fb;
          font-weight: bold;
          margin-bottom: 12rpx;
        }

        .detail-value {
          display: block;
          font-size: 26rpx;
          color: #555;
          line-height: 40rpx;
        }
      }
    }

    .detail-footer {
      padding: 20rpx 30rpx;
      border-top: 1rpx solid #f0f0f0;
      text-align: center;

      .detail-time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}
</style>
