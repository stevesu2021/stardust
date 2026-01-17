<template>
  <view class="container">
    <view class="header">
      <text class="title">虔诚祈祷</text>
      <text class="subtitle">向神灵表达你的心愿</text>
    </view>

    <view class="form">
      <!-- 祈祷内容 -->
      <view class="form-section">
        <text class="section-title">祈祷内容</text>
        <textarea
          class="content-input"
          v-model="content"
          placeholder="请输入你的祈祷内容，系统会自动帮你分类..."
          :maxlength="500"
          :show-confirm-bar="false"
        />
        <view class="input-footer">
          <text class="char-count">{{ content.length }}/500</text>
          <view class="classify-btn" @click="handleManualClassify" :class="{ loading: isClassifying }">
            <text class="classify-icon">{{ isClassifying ? '⏳' : '✓' }}</text>
            <text class="classify-text">{{ isClassifying ? '分类中...' : '完成分类' }}</text>
          </view>
        </view>
      </view>

      <!-- AI 分类结果 -->
      <view class="form-section" v-if="classifiedCategory">
        <text class="section-title">智能分类</text>
        <view class="category-result">
          <text class="category-icon">✨</text>
          <text class="category-name">{{ classifiedCategory.name }}</text>
          <text class="category-hint">已根据内容自动分类</text>
        </view>
      </view>

      <!-- 选择神职 -->
      <view class="form-section" v-if="deities.length > 0">
        <view class="section-header">
          <text class="section-title">选择祈愿神职</text>
          <view class="select-all-btn" @click="toggleSelectAll">
            <text class="select-all-text">{{ isAllSelected ? '取消全选' : '全选' }}</text>
          </view>
        </view>
        <view class="deities-list">
          <view
            class="deity-item"
            v-for="(deity, index) in deities"
            :key="index"
            :class="{ selected: selectedDeities.includes(deity) }"
            @click="toggleDeity(deity)"
          >
            <text class="deity-icon">{{ selectedDeities.includes(deity) ? '✓' : '' }}</text>
            <text class="deity-name">{{ deity }}</text>
          </view>
        </view>
        <text class="selection-hint">已选择 {{ selectedDeities.length }} 位神职</text>
      </view>

      <!-- 是否匿名 -->
      <view class="form-section">
        <text class="section-title">显示设置</text>
        <view class="anonymous-options">
          <view
            class="option-item"
            :class="{ active: isAnonymous }"
            @click="isAnonymous = true"
          >
            <text class="option-icon">{{ isAnonymous ? '🔒' : '🔓' }}</text>
            <view class="option-content">
              <text class="option-title">匿名祈祷</text>
              <text class="option-desc">只显示匿名昵称</text>
            </view>
          </view>
          <view
            class="option-item"
            :class="{ active: !isAnonymous }"
            @click="isAnonymous = false"
          >
            <text class="option-icon">{{ !isAnonymous ? '👤' : '👁️' }}</text>
            <view class="option-content">
              <text class="option-title">实名祈祷</text>
              <text class="option-desc">显示您的昵称</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" @click="handleSubmit" :loading="loading" :disabled="!canSubmit">
        {{ submitButtonText }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const content = ref('')
const classifiedCategory = ref<any>(null)
const deities = ref<string[]>([])
const selectedDeities = ref<string[]>([])
const isAnonymous = ref(true)
const loading = ref(false)
const isClassifying = ref(false)

// 是否可以提交
const canSubmit = computed(() => {
  return content.value.trim().length > 0 && selectedDeities.value.length > 0 && !loading.value
})

// 提交按钮文字
const submitButtonText = computed(() => {
  if (isClassifying.value) return '正在分类...'
  if (loading.value) return '正在提交...'
  if (!content.value.trim()) return '请输入祈祷内容'
  if (selectedDeities.value.length === 0) return '请选择神职'
  return '提交祈祷'
})

// 是否全选
const isAllSelected = computed(() => {
  return deities.value.length > 0 && selectedDeities.value.length === deities.value.length
})

// 手动触发分类
async function handleManualClassify() {
  if (!content.value.trim()) {
    uni.showToast({ title: '请先输入祈祷内容', icon: 'none' })
    return
  }
  if (isClassifying.value) return

  await classifyContent()
}

// AI 分类
async function classifyContent() {
  if (isClassifying.value) return

  isClassifying.value = true
  try {
    const result: any = await api.devoutPrayer.classify(content.value)

    classifiedCategory.value = {
      id: result.categoryId,
      name: result.categoryName,
      deities: result.deities
    }
    deities.value = result.deities
    // 默认全选
    selectedDeities.value = [...result.deities]
  } catch (error: any) {
    console.error('分类失败:', error)
    uni.showToast({ title: 'AI分类失败，请稍后重试', icon: 'none' })
  } finally {
    isClassifying.value = false
  }
}

// 切换神职选择
function toggleDeity(deity: string) {
  const index = selectedDeities.value.indexOf(deity)
  if (index > -1) {
    selectedDeities.value.splice(index, 1)
  } else {
    selectedDeities.value.push(deity)
  }
}

// 全选/取消全选
function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedDeities.value = []
  } else {
    selectedDeities.value = [...deities.value]
  }
}

// 提交祈祷
async function handleSubmit() {
  if (!canSubmit.value) return

  if (!userStore.userInfo?.id) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  loading.value = true
  try {
    await api.devoutPrayer.create({
      content: content.value.trim(),
      category: classifiedCategory.value?.id,
      deities: selectedDeities.value,
      isAnonymous: isAnonymous.value
    })

    uni.showToast({ title: '祈祷成功', icon: 'success' })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error: any) {
    uni.showToast({ title: error.message || '提交失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
  text-align: center;

  .title {
    display: block;
    font-size: 44rpx;
    font-weight: bold;
    color: white;
    margin-bottom: 10rpx;
  }

  .subtitle {
    display: block;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.form {
  padding: 30rpx;

  .form-section {
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .section-title {
      display: block;
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .select-all-btn {
        padding: 8rpx 20rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20rpx;

        .select-all-text {
          font-size: 24rpx;
          color: white;
        }
      }
    }

    .content-input {
      width: 100%;
      min-height: 200rpx;
      padding: 20rpx;
      background: #f8f9fa;
      border-radius: 12rpx;
      font-size: 30rpx;
      border: 1rpx solid #e5e5e5;
      line-height: 1.6;
    }

    .input-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10rpx;

      .char-count {
        font-size: 24rpx;
        color: #999;
      }

      .classify-btn {
        display: flex;
        align-items: center;
        gap: 8rpx;
        padding: 8rpx 20rpx;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20rpx;
        transition: all 0.3s;

        &.loading {
          opacity: 0.7;
        }

        .classify-icon {
          font-size: 28rpx;
        }

        .classify-text {
          font-size: 24rpx;
          color: white;
          font-weight: bold;
        }
      }
    }

    .category-result {
      display: flex;
      align-items: center;
      gap: 16rpx;
      padding: 24rpx;
      background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
      border-radius: 12rpx;

      .category-icon {
        font-size: 40rpx;
      }

      .category-name {
        font-size: 30rpx;
        font-weight: bold;
        color: #634200;
      }

      .category-hint {
        font-size: 24rpx;
        color: rgba(99, 66, 0, 0.6);
        margin-left: auto;
      }
    }

    .deities-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;
      margin-bottom: 16rpx;

      .deity-item {
        flex: 0 0 calc(50% - 8rpx);
        display: flex;
        align-items: center;
        gap: 12rpx;
        padding: 20rpx;
        background: #f8f9fa;
        border-radius: 12rpx;
        border: 2rpx solid transparent;
        transition: all 0.3s;

        &.selected {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-color: #667eea;

          .deity-icon {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
        }

        .deity-icon {
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
          background: #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24rpx;
          color: #999;
          flex-shrink: 0;
        }

        .deity-name {
          font-size: 26rpx;
          color: #333;
          line-height: 1.4;
        }
      }
    }

    .selection-hint {
      display: block;
      font-size: 24rpx;
      color: #667eea;
      text-align: center;
    }

    .anonymous-options {
      display: flex;
      flex-direction: column;
      gap: 16rpx;

      .option-item {
        display: flex;
        align-items: center;
        gap: 16rpx;
        padding: 24rpx;
        background: #f8f9fa;
        border-radius: 12rpx;
        border: 2rpx solid transparent;
        transition: all 0.3s;

        &.active {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-color: #667eea;
        }

        .option-icon {
          font-size: 36rpx;
        }

        .option-content {
          display: flex;
          flex-direction: column;

          .option-title {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 4rpx;
          }

          .option-desc {
            font-size: 24rpx;
            color: #999;
          }
        }
      }
    }
  }

  .submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12rpx;
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 20rpx;
    border: none;

    &[disabled] {
      opacity: 0.6;
    }
  }
}
</style>
