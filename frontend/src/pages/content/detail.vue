<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <scroll-view scroll-y class="scroll" :scroll-top="scrollTop" @scroll="onScroll" :style="{ height: scrollHeight }">
      <view class="content" v-if="detail">
        <image v-if="detail.coverImage" :src="detail.coverImage" class="cover" mode="aspectFill" />

        <view class="head">
          <view class="chips">
            <text class="sd-chip is-gold">{{ detail.topic?.name || '星读' }}</text>
            <text v-for="z in detail.zodiacSigns" :key="z" class="sd-chip">{{ z }}</text>
          </view>
          <text class="title">{{ detail.title }}</text>
          <text class="summary">{{ detail.summary }}</text>
        </view>

        <view class="sd-divider" />

        <!-- 正文卷轴 -->
        <view class="body">
          <view v-for="(block, i) in bodyBlocks" :key="i" class="block">
            <text v-if="block.h" class="block-h">✦ {{ block.h }}</text>
            <text class="block-p">{{ block.p }}</text>
          </view>
        </view>

        <!-- 互动区 -->
        <view class="actions">
          <view class="like-btn" :class="{ liked: liked }" @click="like">
            <text>{{ liked ? '❥ 已喜欢' : '♡ 喜欢' }} {{ likeCount }}</text>
          </view>
        </view>

        <!-- 相关阅读 -->
        <view v-if="detail.related?.length" class="related">
          <SectionTitle kicker="✦" title="相关阅读" />
          <view v-for="r in detail.related" :key="r.id" class="related-item" @click="goRelated(r.id)">
            <text class="r-title">{{ r.title }}</text>
            <text class="r-more">›</text>
          </view>
        </view>

        <!-- 合规页脚 -->
        <view class="sd-divider" />
        <text class="disclaimer">内容仅供娱乐参考，请理性看待</text>
      </view>

      <view v-else-if="!loading" class="empty-wrap">
        <EmptyState icon="❖" title="内容不存在或已下线" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onPageScroll } from '@dcloudio/uni-app'
import { api } from '@/api'
import SectionTitle from '@/components/section-title/section-title.vue'
import EmptyState from '@/components/empty-state/empty-state.vue'

const detail = ref<any>(null)
const loading = ref(false)
const liked = ref(false)
const likeCount = ref(0)
const contentId = ref('')
const finishedReported = ref(false)
// #ifdef H5
const scrollHeight = ref('calc(100vh - 44px)')
// #endif
// #ifndef H5
const scrollHeight = ref('100vh')
// #endif
const scrollTop = ref(0)

// 后端 body 契约为数组 [{h, p}]；容错：单对象形态也归一为数组
const bodyBlocks = computed<any[]>(() => {
  const b = detail.value?.body
  if (Array.isArray(b)) return b
  if (b && typeof b === 'object') return [b]
  return []
})

async function load(id: string) {
  loading.value = true
  try {
    const res: any = await api.content.getDetail(id)
    detail.value = res
    liked.value = !!res.liked
    likeCount.value = res.likeCount ?? 0
    uni.setNavigationBarTitle({ title: res.title?.slice(0, 8) || '星读' })
    api.content.reportProgress(id, 'opened').catch(() => {})
  } catch (e: any) {
    uni.showToast({ title: e.message || '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function like() {
  if (!contentId.value) return
  api.content.toggleLike(contentId.value).then((res: any) => {
    liked.value = res.liked
    likeCount.value = res.likeCount
  }).catch((e: any) => uni.showToast({ title: e.message || '操作失败', icon: 'none' }))
}

function reportFinished() {
  if (finishedReported.value || !contentId.value) return
  finishedReported.value = true
  api.content.reportProgress(contentId.value, 'finished').catch(() => {})
}

// 滚动 80% 判定完读（scroll-view 事件）
function onScroll(e: any) {
  const { scrollTop: st, scrollHeight: sh } = e.detail
  if (sh > 0 && st / sh >= 0.8) reportFinished()
}

// 兜底：原生页面滚动（H5 下 scroll-view 不触发时由 onPageScroll 兜底）
onPageScroll((e: any) => {
  if (e.scrollTop > 400) reportFinished()
})

function goRelated(id: string) {
  uni.redirectTo({ url: `/pages/content/detail?id=${id}` })
}

onLoad((opts: any) => {
  contentId.value = opts?.id || ''
  if (contentId.value) load(contentId.value)
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: $sd-bg;
}

.scroll {
  position: relative;
  z-index: 1;
  width: 100%;
}

.content {
  padding: 32rpx 32rpx calc(env(safe-area-inset-bottom) + 60rpx);
}

.cover {
  width: 100%;
  height: 340rpx;
  border-radius: $sd-radius-lg;
  margin-bottom: 28rpx;
}

.head {
  .chips {
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
    margin-bottom: 16rpx;
  }

  .title {
    display: block;
    font-family: $sd-font-display;
    font-size: 40rpx;
    font-weight: bold;
    color: $sd-text;
    line-height: 1.4;
    letter-spacing: 2rpx;
  }

  .summary {
    display: block;
    margin-top: 14rpx;
    font-size: 24rpx;
    color: $sd-text-3;
    line-height: 1.6;
  }
}

.body {
  .block {
    margin-bottom: 30rpx;
  }

  .block-h {
    display: block;
    font-family: $sd-font-display;
    font-size: 30rpx;
    font-weight: bold;
    color: $sd-gold-bright;
    margin-bottom: 12rpx;
    letter-spacing: 2rpx;
  }

  .block-p {
    font-size: 28rpx;
    color: $sd-text;
    line-height: 1.8;
    text-align: justify;
  }
}

.actions {
  margin: 36rpx 0;
  display: flex;
  justify-content: center;
}

.like-btn {
  padding: 14rpx 56rpx;
  border-radius: $sd-radius-pill;
  border: 1rpx solid rgba(232, 195, 106, 0.5);
  color: $sd-gold;
  font-size: 26rpx;

  &.liked {
    background: rgba(237, 90, 107, 0.12);
    border-color: rgba(237, 90, 107, 0.45);
    color: $sd-cinnabar-soft;
  }

  &:active {
    transform: scale(0.96);
    opacity: 0.88;
  }
}

.related {
  .related-item {
    @include sd-card-surface();
    margin-bottom: 16rpx;
    padding: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;

    .r-title {
      flex: 1;
      font-size: 26rpx;
      color: $sd-text;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .r-more {
      color: $sd-gold;
      font-size: 28rpx;
    }
  }
}

.disclaimer {
  display: block;
  text-align: center;
  font-size: 20rpx;
  color: $sd-text-3;
}

.empty-wrap {
  padding-top: 200rpx;
}
</style>
