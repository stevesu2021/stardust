<template>
  <view class="container">
    <!-- 星夜氛围层 -->
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <view class="content sd-reveal">
      <!-- 自定义导航头 -->
      <view class="page-header">
        <view class="back-sigil" @click="goBack">‹</view>
        <text class="header-title">MBTI 人格测试</text>
      </view>

      <!-- 题引 -->
      <view class="intro">
        <view class="sd-sigil sd-sigil--purple sd-sigil--md">
          <text>✶</text>
        </view>
        <text class="intro-subtitle">观星识人 · 发现你的真实性格类型</text>
      </view>

      <!-- 顶部进度条 -->
      <view class="progress-track">
        <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
      </view>
      <text class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</text>

      <!-- 题目卡 -->
      <view class="question-card" v-if="currentQuestion">
        <text class="question-index">第 {{ currentIndex + 1 }} 题</text>
        <text class="question-text">{{ currentQuestion.question }}</text>

        <view class="options">
          <view
            class="option-item"
            :class="{ selected: answers[currentIndex] === currentQuestion.choice_a.value }"
            @click="selectOption(currentQuestion.choice_a.value)"
          >
            <text class="option-mark">{{ answers[currentIndex] === currentQuestion.choice_a.value ? '✦' : '✧' }}</text>
            <text class="option-text">{{ currentQuestion.choice_a.text }}</text>
          </view>
          <view
            class="option-item"
            :class="{ selected: answers[currentIndex] === currentQuestion.choice_b.value }"
            @click="selectOption(currentQuestion.choice_b.value)"
          >
            <text class="option-mark">{{ answers[currentIndex] === currentQuestion.choice_b.value ? '✦' : '✧' }}</text>
            <text class="option-text">{{ currentQuestion.choice_b.text }}</text>
          </view>
        </view>
      </view>

      <view class="actions">
        <button
          class="btn btn-secondary"
          @click="prevQuestion"
          :disabled="currentIndex === 0"
        >
          上一题
        </button>
        <button
          class="btn btn-primary"
          @click="nextQuestion"
          :disabled="!answers[currentIndex]"
        >
          {{ currentIndex === questions.length - 1 ? '✦ 提交答卷' : '下一题' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'

interface Question {
  question: string
  choice_a: { value: string; text: string }
  choice_b: { value: string; text: string }
}

const questions = ref<Question[]>([])
const answers = ref<string[]>([])
const currentIndex = ref(0)
const loading = ref(false)

const progressPercent = computed(() => {
  return ((currentIndex.value + 1) / questions.value.length) * 100
})

const currentQuestion = computed(() => {
  return questions.value[currentIndex.value]
})

onMounted(async () => {
  await loadQuestions()
})

async function loadQuestions() {
  try {
    const res: any = await api.mbti.getQuestions()
    questions.value = res
    answers.value = new Array(res.length).fill('')
  } catch (error: any) {
    uni.showToast({ title: '加载题目失败', icon: 'none' })
  }
}

function selectOption(value: string) {
  answers.value[currentIndex.value] = value
}

function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

async function nextQuestion() {
  if (!answers.value[currentIndex.value]) {
    uni.showToast({ title: '请先选择一个选项', icon: 'none' })
    return
  }

  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  } else {
    await submitTest()
  }
}

async function submitTest() {
  if (loading.value) return

  loading.value = true
  try {
    const validAnswers = answers.value.filter(a => a)
    await api.mbti.submit(validAnswers)

    uni.showToast({ title: '测试完成', icon: 'success' })

    setTimeout(() => {
      uni.redirectTo({ url: '/pages/mbti/result' })
    }, 1500)
  } catch (error: any) {
    uni.showToast({ title: error.message || '提交失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 自定义导航头：返回上一页
function goBack() {
  uni.navigateBack()
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
  padding: 0 32rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx);
}

/* ---- 自定义导航头 ---- */
.page-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: calc(env(safe-area-inset-top) + 24rpx) 0 24rpx;
}

.back-sigil {
  @include sd-sigil-base();
  width: 64rpx;
  height: 64rpx;
  font-size: 40rpx;
  line-height: 1;

  &:active {
    transform: scale(0.96);
    opacity: 0.88;
  }
}

.header-title {
  font-family: $sd-font-display;
  font-size: 36rpx;
  font-weight: bold;
  letter-spacing: 3rpx;
  @include sd-gold-text();
}

/* ---- 题引 ---- */
.intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 36rpx;

  .intro-subtitle {
    font-size: 24rpx;
    color: $sd-text-3;
    letter-spacing: 2rpx;
  }
}

/* ---- 顶部进度条（星云紫） ---- */
.progress-track {
  height: 10rpx;
  background: $sd-bg-raise;
  border-radius: $sd-radius-pill;
  overflow: hidden;

  .progress-fill {
    height: 100%;
    background: $sd-purple-grad;
    border-radius: $sd-radius-pill;
    box-shadow: $sd-glow-purple;
    transition: width 0.3s ease;
  }
}

.progress-text {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: $sd-text-3;
  letter-spacing: 2rpx;
  margin: 14rpx 0 36rpx;
}

/* ---- 题目卡 ---- */
.question-card {
  @include sd-card-surface(purple);
  padding: 40rpx 32rpx;
  margin-bottom: 36rpx;

  .question-index {
    display: block;
    font-family: $sd-font-display;
    font-size: 22rpx;
    color: $sd-purple-bright;
    letter-spacing: 3rpx;
    margin-bottom: 14rpx;
  }

  .question-text {
    display: block;
    font-size: 32rpx;
    color: $sd-text;
    line-height: 1.7;
    font-weight: 500;
    margin-bottom: 36rpx;
  }
}

/* ---- 选项 ---- */
.options {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .option-item {
    display: flex;
    align-items: center;
    gap: 18rpx;
    padding: 26rpx 24rpx;
    background: $sd-bg-raise;
    border: 2rpx solid $sd-stroke;
    border-radius: $sd-radius;
    transition: border-color 0.25s ease, background 0.25s ease;

    &:active {
      transform: scale(0.98);
      opacity: 0.88;
    }

    &.selected {
      border-color: rgba(232, 195, 106, 0.85);
      background:
        linear-gradient(160deg, rgba(232, 195, 106, 0.14) 0%, rgba(139, 124, 232, 0.05) 100%),
        $sd-bg-raise;
      box-shadow: $sd-glow-gold;

      .option-mark {
        color: $sd-gold-bright;
      }
    }

    .option-mark {
      font-size: 26rpx;
      line-height: 1;
      color: $sd-text-3;
      flex-shrink: 0;
    }

    .option-text {
      flex: 1;
      font-size: 28rpx;
      color: $sd-text;
      line-height: 1.6;
    }
  }
}

/* ---- 操作按钮 ---- */
.actions {
  display: flex;
  gap: 20rpx;

  .btn {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $sd-radius-pill;
    font-size: 30rpx;
    font-weight: bold;
    border: none;
    margin: 0;

    &::after {
      border: none;
    }

    &[disabled] {
      opacity: 0.45;
    }

    &.btn-secondary {
      background: $sd-bg-raise;
      color: $sd-text-2;
      border: 1rpx solid $sd-stroke;
    }

    &.btn-primary {
      background: $sd-purple-grad;
      color: $sd-text;
      box-shadow: $sd-glow-purple;
    }
  }
}
</style>
