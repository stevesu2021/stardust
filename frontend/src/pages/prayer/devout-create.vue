<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <view class="content sd-reveal">
      <!-- 题铭 -->
      <view class="header sd-reveal-1">
        <text class="title">虔诚祈祷</text>
        <text class="subtitle">向神灵表达你的心愿</text>
      </view>

      <!-- 祈祷内容 -->
      <view class="form-section sd-reveal-1">
        <text class="section-title">✦ 祈祷内容</text>
        <view class="wish-note">
          <text class="wish-mark">✦</text>
          <textarea
            class="content-input"
            v-model="content"
            placeholder="请输入你的祈祷内容，系统会自动帮你分类..."
            placeholder-style="color: #8d95bd"
            :maxlength="500"
            :show-confirm-bar="false"
          />
        </view>
        <view class="input-footer">
          <text class="char-count">{{ content.length }}/500</text>
          <view class="classify-btn" :class="{ loading: isClassifying }" @click="handleManualClassify">
            <text class="classify-icon">{{ isClassifying ? '✶' : '✓' }}</text>
            <text class="classify-text">{{ isClassifying ? '分类中...' : '完成分类' }}</text>
          </view>
        </view>
      </view>

      <!-- AI 分类结果 -->
      <view class="form-section sd-reveal-2" v-if="classifiedCategory">
        <text class="section-title">✦ 智能分类</text>
        <view class="category-result">
          <view class="sd-sigil sd-sigil--sm">
            <text>✦</text>
          </view>
          <view class="category-text">
            <text class="category-name">{{ classifiedCategory.name }}</text>
            <text class="category-hint">已根据内容自动分类</text>
          </view>
        </view>
      </view>

      <!-- 选择神职 -->
      <view class="form-section sd-reveal-2" v-if="deities.length > 0">
        <view class="section-header">
          <text class="section-title">✦ 选择祈愿神职</text>
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
      <view class="form-section sd-reveal-3">
        <text class="section-title">✦ 显示设置</text>
        <view class="anonymous-options">
          <view
            class="option-item"
            :class="{ active: isAnonymous }"
            @click="isAnonymous = true"
          >
            <view class="sd-sigil sd-sigil--sm option-sigil">
              <text>☽</text>
            </view>
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
            <view class="sd-sigil sd-sigil--sm option-sigil">
              <text>☉</text>
            </view>
            <view class="option-content">
              <text class="option-title">实名祈祷</text>
              <text class="option-desc">显示您的昵称</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-wrap sd-reveal-4">
        <StardButton
          variant="gold"
          size="lg"
          block
          :disabled="!canSubmit"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ submitButtonText }}
        </StardButton>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { api } from '@/api'
import { useUserStore } from '@/store/user'
import StardButton from '@/components/stard-button/stard-button.vue'

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
  if (isClassifying) return

  await classifyContent()
}

// AI 分类
async function classifyContent() {
  if (isClassifying) return

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
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: $sd-bg;
}

.content {
  position: relative;
  z-index: 1;
  padding: 24rpx 32rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
}

.header {
  text-align: center;
  padding: 12rpx 0 32rpx;

  .title {
    display: block;
    font-family: $sd-font-display;
    font-size: 44rpx;
    font-weight: bold;
    letter-spacing: 6rpx;
    @include sd-gold-text();
    margin-bottom: 10rpx;
  }

  .subtitle {
    display: block;
    font-size: 24rpx;
    color: $sd-text-3;
    letter-spacing: 3rpx;
  }
}

.form-section {
  @include sd-card-surface();
  padding: 30rpx;
  margin-bottom: 24rpx;

  .section-title {
    display: block;
    font-family: $sd-font-display;
    font-size: 30rpx;
    font-weight: bold;
    color: $sd-gold-bright;
    letter-spacing: 3rpx;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      margin-bottom: 0;
    }

    .select-all-btn {
      padding: 8rpx 24rpx;
      border-radius: $sd-radius-pill;
      border: 1rpx solid rgba(232, 195, 106, 0.5);
      background: rgba(232, 195, 106, 0.08);

      &:active {
        opacity: 0.75;
      }

      .select-all-text {
        font-size: 22rpx;
        color: $sd-gold;
        letter-spacing: 2rpx;
      }
    }
  }

  /* 许愿笺：金边虚线心笺 */
  .wish-note {
    position: relative;
    margin-top: 20rpx;
    background: $sd-bg-raise;
    border: 2rpx dashed rgba(232, 195, 106, 0.45);
    border-radius: $sd-radius-lg;
    padding: 24rpx;

    .wish-mark {
      position: absolute;
      top: 14rpx;
      right: 18rpx;
      font-size: 26rpx;
      color: rgba(232, 195, 106, 0.55);
      line-height: 1;
    }

    .content-input {
      width: 100%;
      min-height: 220rpx;
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

  .input-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10rpx;

    .char-count {
      font-size: 22rpx;
      color: $sd-text-3;
    }

    .classify-btn {
      display: inline-flex;
      align-items: center;
      gap: 8rpx;
      padding: 10rpx 26rpx;
      border-radius: $sd-radius-pill;
      background: $sd-gold-grad;
      box-shadow: 0 4rpx 18rpx rgba(232, 195, 106, 0.26);
      transition: opacity 0.3s;

      &.loading {
        opacity: 0.65;
      }

      &:active {
        transform: scale(0.96);
        opacity: 0.88;
      }

      .classify-icon {
        font-size: 24rpx;
        color: $sd-gold-ink;
        line-height: 1;
      }

      .classify-text {
        font-size: 22rpx;
        color: $sd-gold-ink;
        font-weight: bold;
        letter-spacing: 2rpx;
      }
    }
  }

  /* AI 分类结果 */
  .category-result {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-top: 20rpx;
    padding: 24rpx;
    border-radius: $sd-radius;
    background: linear-gradient(135deg, rgba(232, 195, 106, 0.12) 0%, rgba(232, 195, 106, 0.03) 60%), $sd-bg-raise;
    border: 1rpx solid rgba(232, 195, 106, 0.4);

    .category-text {
      display: flex;
      flex-direction: column;
      gap: 6rpx;
      min-width: 0;

      .category-name {
        font-family: $sd-font-display;
        font-size: 30rpx;
        font-weight: bold;
        color: $sd-gold-bright;
        letter-spacing: 2rpx;
      }

      .category-hint {
        font-size: 22rpx;
        color: $sd-text-3;
      }
    }
  }

  /* 神职胶囊 */
  .deities-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    margin-top: 20rpx;
    margin-bottom: 16rpx;

    .deity-item {
      display: inline-flex;
      align-items: center;
      gap: 12rpx;
      padding: 12rpx 26rpx;
      border-radius: $sd-radius-pill;
      background: $sd-bg-raise;
      border: 1rpx solid $sd-stroke;
      transition: all 0.2s ease;

      &:active {
        transform: scale(0.96);
        opacity: 0.88;
      }

      &.selected {
        background: $sd-gold-grad;
        border-color: rgba(245, 217, 139, 0.6);
        box-shadow: $sd-glow-gold;

        .deity-name {
          color: $sd-gold-ink;
          font-weight: bold;
        }

        .deity-icon {
          background: rgba(74, 56, 19, 0.14);
          border-color: rgba(74, 56, 19, 0.32);
          color: $sd-gold-ink;
        }
      }

      .deity-icon {
        width: 36rpx;
        height: 36rpx;
        border-radius: 50%;
        border: 1rpx solid $sd-stroke-strong;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        color: $sd-gold-bright;
        flex-shrink: 0;
        line-height: 1;
      }

      .deity-name {
        font-size: 26rpx;
        color: $sd-text-2;
        line-height: 1.4;
      }
    }
  }

  .selection-hint {
    display: block;
    font-size: 22rpx;
    color: $sd-gold;
    letter-spacing: 2rpx;
    text-align: center;
  }

  /* 匿名 / 实名 */
  .anonymous-options {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    margin-top: 20rpx;

    .option-item {
      display: flex;
      align-items: center;
      gap: 20rpx;
      padding: 24rpx;
      background: $sd-bg-raise;
      border: 1rpx solid $sd-stroke;
      border-radius: $sd-radius;
      transition: all 0.2s ease;

      &:active {
        transform: scale(0.98);
        opacity: 0.9;
      }

      &.active {
        background: linear-gradient(160deg, rgba(232, 195, 106, 0.12) 0%, rgba(232, 195, 106, 0.02) 50%), $sd-bg-raise;
        border-color: rgba(232, 195, 106, 0.5);
        box-shadow: $sd-glow-gold;

        .option-title {
          color: $sd-gold-bright;
        }
      }

      .option-sigil {
        opacity: 0.45;
        transition: opacity 0.2s ease;
      }

      &.active .option-sigil {
        opacity: 1;
      }

      .option-content {
        display: flex;
        flex-direction: column;
        gap: 6rpx;

        .option-title {
          font-size: 28rpx;
          font-weight: bold;
          color: $sd-text;
        }

        .option-desc {
          font-size: 22rpx;
          color: $sd-text-3;
        }
      }
    }
  }
}

.submit-wrap {
  margin-top: 8rpx;
}
</style>
