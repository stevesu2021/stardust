<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <view class="content">
      <!-- 栏目 Tab -->
      <scroll-view scroll-x class="tabs sd-reveal">
        <view class="tabs-inner">
          <view
            v-for="t in tabs"
            :key="t.slug"
            class="tab"
            :class="{ active: activeTab === t.slug }"
            @click="switchTab(t.slug)"
          >
            <text>{{ t.label }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 内容卡片流 -->
      <view v-if="loading && !items.length" class="skeleton-wrap">
        <LoadingSkeleton :rows="4" />
      </view>

      <view
        v-for="item in items"
        :key="item.id"
        class="card"
        :class="{ 'is-resume': item.id === resumeId }"
        @click="openDetail(item)"
      >
        <view v-if="item.id === resumeId" class="resume-tag">✦ 继续阅读</view>
        <image v-if="item.coverImage" :src="item.coverImage" class="cover" mode="aspectFill" />
        <view class="body">
          <view class="title-row">
            <text class="title">{{ item.title }}</text>
            <text v-if="item.isRead" class="read-mark">看过</text>
          </view>
          <text class="summary">{{ item.summary }}</text>
          <view class="meta">
            <view class="chips">
              <text v-if="item.isContinue" class="sd-chip is-gold">你想看的更新了</text>
              <text v-else-if="item.isExplore" class="sd-chip is-purple">为你发现</text>
              <text v-if="item.orderNum" class="sd-chip">连载 {{ item.orderNum }}</text>
            </view>
            <text class="likes">✧ {{ item.likeCount }}</text>
          </view>
        </view>
      </view>

      <EmptyState
        v-if="!loading && !items.length"
        icon="❂"
        title="星读内容即将上线"
        desc="星象师正在赶稿，先去看看其他功能吧"
      />

      <view v-if="loadingMore" class="loading-more"><text>✶ 正在加载…</text></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { api } from '@/api'
import LoadingSkeleton from '@/components/loading-skeleton/loading-skeleton.vue'
import EmptyState from '@/components/empty-state/empty-state.vue'

const tabs = [
  { slug: '', label: '推荐' },
  { slug: 'daily-astro', label: '星象' },
  { slug: 'zodiac-deep', label: '星座人格' },
  { slug: 'growth', label: '她的星空' },
  { slug: 'relationship', label: '亲密关系' },
]

const activeTab = ref('')
const items = ref<any[]>([])
const cursor = ref<string | null>(null)
const loading = ref(false)
const loadingMore = ref(false)
const resumeId = ref<string | null>(null)

let reqSeq = 0 // 请求序号：快速切 Tab 时丢弃过期的慢响应

async function loadFeed(reset: boolean) {
  const seq = ++reqSeq
  if (reset) {
    loading.value = true
    cursor.value = null
    items.value = []
    resumeId.value = null
  } else {
    loadingMore.value = true
  }
  try {
    const res: any = await api.content.getFeed({
      topic: activeTab.value || undefined,
      cursor: reset ? undefined : cursor.value || undefined,
      limit: 10,
    })
    if (seq !== reqSeq) return // 过期响应（Tab 已切换），丢弃
    if (reset) {
      items.value = res.items || []
      resumeId.value = res.resume?.contentId || null
    } else {
      items.value = [...items.value, ...(res.items || [])]
    }
    cursor.value = res.nextCursor
  } catch (e: any) {
    if (seq !== reqSeq) return // 过期请求的报错不提示，避免干扰当前 Tab
    uni.showToast({ title: e.message || '加载失败', icon: 'none' })
  } finally {
    // 有更新的请求在途时不动 loading 标志，避免骨架屏被过期响应提前撤掉
    if (seq === reqSeq) {
      loading.value = false
      loadingMore.value = false
    }
  }
}

function switchTab(slug: string) {
  if (activeTab.value === slug) return
  activeTab.value = slug
  loadFeed(true)
}

function openDetail(item: any) {
  uni.navigateTo({ url: `/pages/content/detail?id=${item.id}` })
}

onPullDownRefresh(async () => {
  await loadFeed(true)
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  if (cursor.value && !loadingMore.value) loadFeed(false)
})

loadFeed(true)
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
  padding: 20rpx 32rpx calc(env(safe-area-inset-bottom) + 40rpx);
}

.tabs {
  white-space: nowrap;
  margin-bottom: 20rpx;

  .tabs-inner {
    display: inline-flex;
    gap: 16rpx;
    padding: 8rpx 0;
  }

  .tab {
    padding: 12rpx 32rpx;
    border-radius: $sd-radius-pill;
    background: $sd-bg-nav;
    border: 1rpx solid $sd-stroke;
    font-size: 26rpx;
    color: $sd-text-2;

    &.active {
      background: $sd-gold-grad;
      color: $sd-gold-ink;
      font-weight: bold;
      box-shadow: $sd-glow-gold;
    }
  }
}

.skeleton-wrap {
  padding: 30rpx;
}

.card {
  @include sd-card-surface();
  position: relative;
  margin-bottom: 24rpx;
  overflow: hidden;

  &.is-resume {
    border-color: rgba(232, 195, 106, 0.55);
    box-shadow: $sd-glow-gold;
  }

  .resume-tag {
    position: absolute;
    top: 16rpx;
    right: 16rpx;
    z-index: 2;
    padding: 4rpx 18rpx;
    border-radius: $sd-radius-pill;
    font-size: 20rpx;
    color: $sd-gold-ink;
    background: $sd-gold-grad;
  }

  .cover {
    width: 100%;
    height: 280rpx;
  }

  .body {
    padding: 24rpx;
  }

  .title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
  }

  .title {
    font-family: $sd-font-display;
    font-size: 30rpx;
    font-weight: bold;
    color: $sd-text;
    line-height: 1.4;
    flex: 1;
    min-width: 0;
  }

  .read-mark {
    flex-shrink: 0;
    font-size: 20rpx;
    color: $sd-text-3;
  }

  .summary {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: $sd-text-2;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    margin-top: 18rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .chips {
      display: flex;
      gap: 12rpx;
      flex-wrap: wrap;
    }

    .likes {
      font-size: 22rpx;
      color: $sd-gold;
    }
  }
}

.loading-more {
  text-align: center;
  padding: 24rpx;
  font-size: 24rpx;
  color: $sd-text-3;
}
</style>
