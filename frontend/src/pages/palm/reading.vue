<template>
  <view class="container">
    <!-- 氛围层：星云 + 星野 + 流星 -->
    <view class="sd-nebula" />
    <view class="sd-stars" />
    <view class="sd-shooting-star" />

    <view class="content sd-reveal">
      <!-- 头部切换（胶囊 Tab） -->
      <view class="tabs">
        <view class="tab" :class="{ active: activeTab === 'analyze' }" @click="activeTab = 'analyze'">
          <text>看手相</text>
        </view>
        <view class="tab" :class="{ active: activeTab === 'history' }" @click="switchToHistory">
          <text>历史记录</text>
        </view>
      </view>

      <!-- 看手相页面 -->
      <view v-if="activeTab === 'analyze'" class="analyze-view">
        <!-- 上传区域：星夜祭坛 -->
        <view class="upload-section sd-reveal-1">
          <view class="upload-box" @click="chooseImage">
            <image v-if="imageUri" :src="imageUri" class="preview-image" mode="aspectFit" />
            <view v-else class="upload-placeholder">
              <view class="sd-sigil sd-sigil--lg upload-sigil"><text>◉</text></view>
              <text class="upload-text">点击上传手相照片</text>
              <text class="upload-hint">请清晰拍摄手掌纹路</text>
            </view>
          </view>

          <view class="tips">
            <text class="tips-title">拍摄要诀</text>
            <text class="tips-item">✧ 保持手掌平整，光线充足</text>
            <text class="tips-item">✧ 纹路清晰可见</text>
            <text class="tips-item">✧ 建议拍摄左手（男左女右）</text>
          </view>
        </view>

        <StardButton
          class="analyze-cta"
          variant="gold"
          size="lg"
          block
          :loading="analyzing"
          :disabled="!imageUri"
          @click="analyzePalm"
        >
          {{ analyzing ? '星象推演中...' : '✦ 开始解读' }}
        </StardButton>

        <!-- 分析结果：古籍卷轴 -->
        <view v-if="result" class="result-section sd-reveal-2">
          <StardCard variant="gold" glow class="scroll-card">
            <view class="scroll-head">
              <view class="sd-sigil sd-sigil--md scroll-head-sigil"><text>☽</text></view>
              <text class="scroll-title">手相分析结果</text>
              <text class="scroll-subtitle">基于AI视觉大模型分析</text>
            </view>

            <view class="sd-divider" />

            <view class="scroll-section">
              <view class="section-head">
                <view class="sd-sigil sd-sigil--sm section-sigil"><text>✋</text></view>
                <text class="section-title">生命线</text>
              </view>
              <text class="section-text">{{ result.lifeLine || '暂无分析' }}</text>
            </view>

            <view class="sd-divider" />

            <view class="scroll-section">
              <view class="section-head">
                <view class="sd-sigil sd-sigil--sm section-sigil"><text>☿</text></view>
                <text class="section-title">智慧线</text>
              </view>
              <text class="section-text">{{ result.wisdomLine || '暂无分析' }}</text>
            </view>

            <view class="sd-divider" />

            <view class="scroll-section">
              <view class="section-head">
                <view class="sd-sigil sd-sigil--sm sd-sigil--cinnabar section-sigil"><text>❥</text></view>
                <text class="section-title">感情线</text>
              </view>
              <text class="section-text">{{ result.loveLine || '暂无分析' }}</text>
            </view>

            <view class="sd-divider" />

            <view class="scroll-section">
              <view class="section-head">
                <view class="sd-sigil sd-sigil--sm section-sigil"><text>☰</text></view>
                <text class="section-title">事业线</text>
              </view>
              <text class="section-text">{{ result.careerLine || '暂无分析' }}</text>
            </view>

            <view class="sd-divider" />

            <view class="scroll-section">
              <view class="section-head">
                <view class="sd-sigil sd-sigil--sm section-sigil"><text>✧</text></view>
                <text class="section-title">综合运势</text>
              </view>
              <text class="section-text">{{ result.overall || '暂无分析' }}</text>
            </view>
          </StardCard>

          <!-- 重新分析按钮 -->
          <view class="action-buttons">
            <StardButton class="action-btn" variant="ghost" size="md" @click="resetAnalysis">
              重新拍摄分析
            </StardButton>
            <StardButton class="action-btn" variant="outline" size="md" @click="shareResult">
              ✉ 分享结果
            </StardButton>
          </view>
        </view>
      </view>

      <!-- 历史记录页面 -->
      <view v-if="activeTab === 'history'" class="history-view">
        <EmptyState
          v-if="history.length === 0 && !historyLoading"
          icon="❖"
          title="暂无历史记录"
          desc="拍摄手相后，记录会自动保存在这里"
        />

        <view v-else-if="historyLoading" class="loading-state">
          <text class="loading-text">加载中...</text>
        </view>

        <view v-else class="history-list sd-reveal-1">
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
    </view>

    <!-- 历史记录详情弹窗 -->
    <view v-if="showDetail" class="detail-modal" @click="showDetail = false">
      <view class="detail-content" @click.stop>
        <view class="detail-header">
          <text class="detail-title">手相分析详情</text>
          <text class="detail-close" @click="showDetail = false">✕</text>
        </view>
        <view class="detail-image-wrapper">
          <image :src="selectedItem?.imageUrl" class="detail-image" mode="aspectFit" />
        </view>
        <view class="detail-body">
          <view class="detail-section">
            <text class="detail-label">✋ 生命线</text>
            <text class="detail-value">{{ selectedItem?.lifeLine || '暂无分析' }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">☿ 智慧线</text>
            <text class="detail-value">{{ selectedItem?.wisdomLine || '暂无分析' }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">❥ 感情线</text>
            <text class="detail-value">{{ selectedItem?.loveLine || '暂无分析' }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">☰ 事业线</text>
            <text class="detail-value">{{ selectedItem?.careerLine || '暂无分析' }}</text>
          </view>
          <view class="detail-section">
            <text class="detail-label">✧ 综合运势</text>
            <text class="detail-value">{{ selectedItem?.overall || '暂无分析' }}</text>
          </view>
        </view>
        <view class="detail-footer">
          <text class="detail-time">{{ formatDate(selectedItem?.createdAt) }}</text>
          <StardButton variant="outline" size="sm" @click="shareHistoryItem">✉ 分享</StardButton>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { api } from '@/api'
import { share } from '@/utils/wechatShare'
import { compressImageForUpload } from '@/utils/image'
import StardCard from '@/components/stard-card/stard-card.vue'
import StardButton from '@/components/stard-button/stard-button.vue'
import EmptyState from '@/components/empty-state/empty-state.vue'

const userStore = useUserStore()
const activeTab = ref('analyze')
const imageUri = ref('')
const analyzing = ref(false)
const result = ref<any>(null)
const history = ref<any[]>([])
const historyLoading = ref(false)
const showDetail = ref(false)
const selectedItem = ref<any>(null)

// 上传前压缩（平台自适应、全程 fail-safe，永不挂起/永不 reject）：
// Android 拍照普遍 2~8MB，超限会被网关 413；uni-h5 未实现 uni.compressImage，
// 故 H5 走 canvas 压缩（utils/image.ts 内部处理），失败自动回退原图
async function compressImage(src: string): Promise<string> {
  try {
    return await compressImageForUpload(src)
  } catch {
    return src
  }
}

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res: any) => {
      imageUri.value = await compressImage(res.tempFilePaths[0])
      result.value = null
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
        url: '/api/palm/analyze',
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
        if (uploadRes.statusCode === 413) {
          throw new Error('图片过大，请缩小图片后重试')
        }
        throw new Error(`分析失败 (${uploadRes.statusCode})`)
      }
    }
  } catch (error: any) {
    console.error('手相分析错误:', error)
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
    const res: any = await api.palm.getHistory()
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
    content: '确定要删除这条手相记录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await api.palm.delete(id)
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

// 分享当前结果
async function shareResult() {
  if (!result.value) {
    uni.showToast({ title: '暂无结果可分享', icon: 'none' })
    return
  }

  await share({
    title: '我的手相分析结果',
    desc: result.value.overall?.substring(0, 50) || '查看我的AI手相分析',
    imageUrl: imageUri.value || ''
  })
}

// 分享历史记录项
async function shareHistoryItem() {
  if (!selectedItem.value) {
    uni.showToast({ title: '暂无数据可分享', icon: 'none' })
    return
  }

  await share({
    title: '手相分析结果 - ' + formatDate(selectedItem.value.createdAt),
    desc: selectedItem.value.overall?.substring(0, 50) || '查看我的AI手相分析',
    imageUrl: selectedItem.value.imageUrl || ''
  })
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

/* ---- 胶囊 Tab（§6.7） ---- */
.tabs {
  display: flex;
  background: $sd-bg-nav;
  border: 1rpx solid $sd-stroke;
  border-radius: $sd-radius-pill;
  padding: 8rpx;
  margin-bottom: 32rpx;

  .tab {
    flex: 1;
    text-align: center;
    padding: 18rpx 0;
    border-radius: $sd-radius-pill;
    font-size: 26rpx;
    color: $sd-text-2;
    transition: all 0.25s ease;

    &.active {
      background: $sd-gold-grad;
      color: $sd-gold-ink;
      font-weight: bold;
    }

    &:active {
      opacity: 0.85;
    }
  }
}

/* ---- 看手相 ---- */
.analyze-view {
  .upload-section {
    margin-bottom: 32rpx;
  }

  /* 星夜祭坛：虚线金边 + ◉ 徽章 */
  .upload-box {
    position: relative;
    border-radius: $sd-radius-xl;
    border: 2rpx dashed rgba(232, 195, 106, 0.42);
    background:
      radial-gradient(340rpx 240rpx at 50% -10%, rgba(232, 195, 106, 0.1), transparent 70%),
      $sd-bg-elev;
    box-shadow: $sd-shadow-card;
    overflow: hidden;
    margin-bottom: 24rpx;

    &:active {
      opacity: 0.88;
    }

    .preview-image {
      display: block;
      width: 100%;
      height: 500rpx;
    }

    .upload-placeholder {
      height: 500rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .upload-sigil {
      margin-bottom: 26rpx;
    }

    .upload-text {
      font-family: $sd-font-display;
      font-size: 32rpx;
      font-weight: bold;
      color: $sd-gold-bright;
      letter-spacing: 3rpx;
      margin-bottom: 12rpx;
    }

    .upload-hint {
      font-size: 24rpx;
      color: $sd-text-3;
      letter-spacing: 1rpx;
    }
  }

  .tips {
    border-radius: $sd-radius;
    border: 1rpx solid $sd-stroke;
    background: $sd-bg-elev;
    padding: 26rpx 28rpx;

    .tips-title {
      display: block;
      font-family: $sd-font-display;
      font-size: 26rpx;
      font-weight: bold;
      color: $sd-gold;
      letter-spacing: 2rpx;
      margin-bottom: 12rpx;
    }

    .tips-item {
      display: block;
      font-size: 24rpx;
      color: $sd-text-2;
      line-height: 40rpx;
    }
  }

  .analyze-cta {
    margin-bottom: 40rpx;
  }

  /* ---- 解读结果：古籍卷轴 ---- */
  .result-section {
    .scroll-card {
      padding: 40rpx 34rpx 36rpx;
    }

    .scroll-head {
      display: flex;
      flex-direction: column;
      align-items: center;

      .scroll-head-sigil {
        margin-bottom: 20rpx;
      }

      .scroll-title {
        font-family: $sd-font-display;
        font-size: 40rpx;
        font-weight: bold;
        letter-spacing: 4rpx;
        @include sd-gold-text();
        margin-bottom: 12rpx;
      }

      .scroll-subtitle {
        font-size: 22rpx;
        color: $sd-text-3;
        letter-spacing: 2rpx;
      }
    }

    .scroll-section {
      .section-head {
        display: flex;
        align-items: center;
        gap: 18rpx;
        margin-bottom: 14rpx;
      }

      .section-sigil {
        flex-shrink: 0;
      }

      .section-title {
        font-family: $sd-font-display;
        font-size: 30rpx;
        font-weight: bold;
        color: $sd-gold-bright;
        letter-spacing: 3rpx;
      }

      .section-text {
        display: block;
        font-size: 27rpx;
        color: $sd-text-2;
        line-height: 1.75;
      }
    }

    .action-buttons {
      margin-top: 28rpx;
      display: flex;
      gap: 20rpx;

      .action-btn {
        flex: 1;
      }
    }
  }
}

/* ---- 历史记录 ---- */
.history-view {
  .loading-state {
    display: flex;
    justify-content: center;
    padding: 120rpx 0;

    .loading-text {
      font-size: 26rpx;
      color: $sd-text-3;
      letter-spacing: 2rpx;
    }
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  .history-item {
    display: flex;
    align-items: center;
    @include sd-card-surface();
    padding: 22rpx;

    &:active {
      opacity: 0.85;
    }

    .history-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: $sd-radius-sm;
      border: 1rpx solid $sd-stroke;
      margin-right: 20rpx;
      flex-shrink: 0;
    }

    .history-info {
      flex: 1;
      min-width: 0;

      .history-date {
        display: block;
        font-size: 22rpx;
        color: $sd-text-3;
        letter-spacing: 1rpx;
        margin-bottom: 8rpx;
      }

      .history-preview {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 25rpx;
        color: $sd-text-2;
        line-height: 38rpx;
      }
    }

    .history-actions {
      .btn-delete {
        padding: 12rpx 24rpx;
        border-radius: $sd-radius-pill;
        border: 1rpx solid rgba(237, 90, 107, 0.4);
        background: rgba(237, 90, 107, 0.08);
        color: $sd-cinnabar;
        font-size: 22rpx;

        &:active {
          opacity: 0.7;
        }
      }
    }
  }
}

/* ---- 历史详情弹窗 ---- */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(4, 6, 18, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;

  .detail-content {
    width: 660rpx;
    max-height: 80vh;
    @include sd-card-surface();
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .detail-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28rpx 30rpx;
      border-bottom: 1rpx solid $sd-stroke;

      .detail-title {
        font-family: $sd-font-display;
        font-size: 32rpx;
        font-weight: bold;
        color: $sd-gold-bright;
        letter-spacing: 3rpx;
      }

      .detail-close {
        font-size: 36rpx;
        line-height: 1;
        color: $sd-text-3;
        padding: 0 10rpx;

        &:active {
          opacity: 0.6;
        }
      }
    }

    .detail-image-wrapper {
      padding: 20rpx;
      background: $sd-bg-raise;

      .detail-image {
        width: 100%;
        height: 400rpx;
        border-radius: $sd-radius-sm;
      }
    }

    .detail-body {
      flex: 1;
      padding: 30rpx;
      overflow-y: auto;

      .detail-section {
        margin-bottom: 28rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          display: block;
          font-family: $sd-font-display;
          font-size: 26rpx;
          font-weight: bold;
          color: $sd-gold;
          letter-spacing: 2rpx;
          margin-bottom: 10rpx;
        }

        .detail-value {
          display: block;
          font-size: 26rpx;
          color: $sd-text-2;
          line-height: 1.75;
        }
      }
    }

    .detail-footer {
      padding: 20rpx 30rpx;
      border-top: 1rpx solid $sd-stroke;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .detail-time {
        font-size: 22rpx;
        color: $sd-text-3;
      }
    }
  }
}
</style>
