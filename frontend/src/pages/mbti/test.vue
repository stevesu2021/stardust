<template>
  <view class="test-page">
    <view class="header">
      <text class="title">MBTI 人格测试</text>
      <text class="subtitle">发现你的真实性格类型</text>
    </view>

    <view class="progress-bar">
      <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
    </view>
    <text class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</text>

    <view class="question-card" v-if="currentQuestion">
      <text class="question-text">{{ currentQuestion.question }}</text>

      <view class="options">
        <view
          class="option-item"
          :class="{ selected: answers[currentIndex] === currentQuestion.choice_a.value }"
          @click="selectOption(currentQuestion.choice_a.value)"
        >
          <text class="option-text">{{ currentQuestion.choice_a.text }}</text>
        </view>
        <view
          class="option-item"
          :class="{ selected: answers[currentIndex] === currentQuestion.choice_b.value }"
          @click="selectOption(currentQuestion.choice_b.value)"
        >
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
        {{ currentIndex === questions.length - 1 ? '提交' : '下一题' }}
      </button>
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
</script>

<style lang="scss" scoped>
.test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
  padding-bottom: 160rpx;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;

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

.progress-bar {
  height: 8rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4rpx;
  margin-bottom: 16rpx;
  overflow: hidden;

  .progress-fill {
    height: 100%;
    background: white;
    border-radius: 4rpx;
    transition: width 0.3s;
  }
}

.progress-text {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40rpx;
}

.question-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);

  .question-text {
    display: block;
    font-size: 32rpx;
    color: #333;
    line-height: 1.6;
    margin-bottom: 40rpx;
    font-weight: 500;
  }
}

.options {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .option-item {
    padding: 30rpx;
    background: #f8f9fa;
    border-radius: 16rpx;
    border: 3rpx solid transparent;
    transition: all 0.3s;

    &.selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      border-color: #667eea;
    }

    .option-text {
      display: block;
      font-size: 28rpx;
      color: #333;
      line-height: 1.5;
    }
  }
}

.actions {
  display: flex;
  gap: 20rpx;

  .btn {
    flex: 1;
    height: 88rpx;
    border-radius: 16rpx;
    font-size: 30rpx;
    font-weight: bold;
    border: none;

    &[disabled] {
      opacity: 0.5;
    }

    &.btn-secondary {
      background: rgba(255, 255, 255, 0.3);
      color: white;
    }

    &.btn-primary {
      background: white;
      color: #667eea;
    }
  }
}
</style>
