<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          v-model="searchKeyword"
          placeholder="搜索手机号或昵称"
          :confirm-type="'search'"
          @confirm="handleSearch"
          @input="onSearchInput"
        />
        <text v-if="searchKeyword" class="clear-icon" @click="clearSearch">✕</text>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view v-if="isSearching && searchResults.length > 0" class="contacts search-results">
      <text class="section-title">搜索结果 ({{ searchResults.length }})</text>
      <view
        v-for="user in searchResults"
        :key="user.id"
        class="contact-card"
        @click="startChat(user.id)"
      >
        <view class="contact-header">
          <view class="header-left">
            <view class="avatar-wrapper">
              <image
                v-if="user.avatar"
                :src="user.avatar"
                class="avatar"
                mode="aspectFill"
              />
              <text v-else class="avatar-placeholder">{{ (user.nickname || '匿').charAt(0) }}</text>
            </view>
            <view class="user-info">
              <text class="nickname">{{ user.nickname || '匿名' }}</text>
              <text class="phone" v-if="user.phone">{{ user.phone }}</text>
            </view>
          </view>
        </view>
        <view class="contact-info">
          <text class="info-item" v-if="user.zodiacSign">星座: {{ user.zodiacSign }}</text>
          <text class="info-item" v-if="user.gender">性别: {{ user.gender === 'male' ? '男' : '女' }}</text>
        </view>
        <button class="chat-btn" @click.stop="startChat(user.id)">
          <text>发起聊天</text>
        </button>
      </view>
    </view>

    <!-- 无搜索结果 -->
    <view v-if="isSearching && searchResults.length === 0" class="empty-state">
      <text class="empty-icon">🔍</text>
      <text class="empty-text">未找到相关用户</text>
    </view>

    <!-- 聊天联系人列表 -->
    <view v-if="!isSearching" class="contacts">
      <text class="section-title" v-if="contacts.length > 0">聊天联系人 ({{ contacts.length }})</text>

      <view
        v-for="item in contacts"
        :key="item.user.id"
        class="contact-card"
        @click="startChat(item.user.id)"
      >
        <view class="contact-header">
          <view class="header-left">
            <view class="avatar-wrapper">
              <image
                v-if="item.user.avatar"
                :src="item.user.avatar"
                class="avatar"
                mode="aspectFill"
              />
              <text v-else class="avatar-placeholder">{{ (item.user.nickname || '匿').charAt(0) }}</text>
              <!-- 未读消息红点 -->
              <view v-if="item.unreadCount > 0" class="unread-badge">
                <text class="unread-count">{{ item.unreadCount > 99 ? '99+' : item.unreadCount }}</text>
              </view>
            </view>
            <view class="user-info">
              <text class="nickname">{{ item.user.nickname || '匿名' }}</text>
              <text class="last-message">{{ formatLastMessage(item.lastMessage) }}</text>
            </view>
          </view>
          <text class="message-time">{{ formatTime(item.lastMessage?.createdAt) }}</text>
        </view>
        <view class="contact-info">
          <text class="info-item" v-if="item.user.zodiacSign">星座: {{ item.user.zodiacSign }}</text>
          <text class="info-item" v-if="item.user.gender">性别: {{ item.user.gender === 'male' ? '男' : '女' }}</text>
        </view>
        <button class="chat-btn" @click.stop="startChat(item.user.id)">
          <text>聊天</text>
          <!-- 未读消息数显示 -->
          <view v-if="item.unreadCount > 0" class="btn-badge">
            <text>{{ item.unreadCount }}</text>
          </view>
        </button>
      </view>

      <!-- 空状态 -->
      <view v-if="contacts.length === 0" class="empty-state">
        <text class="empty-icon">💬</text>
        <text class="empty-text">还没有聊天记录</text>
        <text class="empty-hint">去首页"缘分匹配"找朋友聊天吧</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { api } from '@/api'
import { useUserStore } from '@/store/user'

const contacts = ref<any[]>([])
const userStore = useUserStore()
const searchKeyword = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
let searchTimer: any = null
let refreshTimer: any = null

// 格式化最后一条消息
function formatLastMessage(msg: any): string {
  if (!msg) return ''
  const content = msg.content || ''
  return content.length > 20 ? content.substring(0, 20) + '...' : content
}

// 格式化时间
function formatTime(time: string | null): string {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  // 今天
  if (date.toDateString() === now.toDateString()) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }
  // 昨天
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  }
  // 更早
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}-${day}`
}

// 搜索输入处理（防抖）
function onSearchInput() {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  if (!searchKeyword.value.trim()) {
    isSearching.value = false
    searchResults.value = []
    return
  }
  searchTimer = setTimeout(() => {
    handleSearch()
  }, 500)
}

// 执行搜索
async function handleSearch() {
  const keyword = searchKeyword.value.trim()
  if (!keyword) {
    isSearching.value = false
    searchResults.value = []
    return
  }

  isSearching.value = true
  try {
    const res: any = await api.dating.searchUsers(keyword)
    searchResults.value = res
  } catch (error: any) {
    uni.showToast({ title: error.message || '搜索失败', icon: 'none' })
  }
}

// 清除搜索
function clearSearch() {
  searchKeyword.value = ''
  isSearching.value = false
  searchResults.value = []
}

onMounted(() => {
  loadContacts()
  // 每30秒刷新一次联系人列表
  refreshTimer = setInterval(() => {
    if (!isSearching.value) {
      loadContacts()
    }
  }, 30000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
})

onShow(() => {
  // 每次显示页面时刷新
  if (!isSearching.value) {
    loadContacts()
  }
})

async function loadContacts() {
  if (!userStore.userInfo?.id) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  try {
    const res: any = await api.dating.getContacts()
    contacts.value = res
  } catch (error: any) {
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
  }
}

function startChat(userId: string) {
  uni.navigateTo({ url: `/pages/dating/chat?otherUserId=${userId}` })
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
  background: $sd-bg;
}

// 搜索栏
.search-bar {
  margin-bottom: 20rpx;

  .search-input-wrapper {
    display: flex;
    align-items: center;
    background: $sd-bg-elev;
    border: 1rpx solid $sd-stroke;
    border-radius: $sd-radius-pill;
    padding: 14rpx 30rpx;

    .search-icon {
      font-size: 28rpx;
      color: $sd-text-3;
      margin-right: 16rpx;
    }

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: $sd-text;

      &::placeholder {
        color: $sd-text-3;
      }
    }

    .clear-icon {
      font-size: 28rpx;
      color: $sd-text-3;
      padding: 10rpx;
      margin-left: 10rpx;
    }
  }
}

// 区域标题
.section-title {
  display: block;
  font-size: 26rpx;
  color: $sd-text-3;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
}

// 联系人列表
.contacts {
  .contact-card {
    background: $sd-bg-elev;
    border: 1rpx solid $sd-stroke;
    border-radius: $sd-radius-lg;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .contact-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .header-left {
        display: flex;
        align-items: center;
        gap: 20rpx;
        flex: 1;

        .avatar-wrapper {
          position: relative;
          width: 96rpx;
          height: 96rpx;
          flex-shrink: 0;

          .avatar {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }

          .avatar-placeholder {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(232, 195, 106, 0.35) 0%, rgba(47, 66, 138, 0.6) 100%);
            color: $sd-gold-bright;
            font-size: 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .unread-badge {
            position: absolute;
            top: -8rpx;
            right: -8rpx;
            min-width: 36rpx;
            height: 36rpx;
            background: $sd-cinnabar;
            border-radius: 18rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 8rpx;
            border: 3rpx solid $sd-bg-elev;

            .unread-count {
              font-size: 20rpx;
              color: white;
              font-weight: bold;
            }
          }
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 8rpx;
          flex: 1;
          min-width: 0;

          .nickname {
            font-size: 32rpx;
            font-weight: bold;
            color: $sd-text;
          }

          .phone {
            font-size: 24rpx;
            color: $sd-text-3;
          }

          .last-message {
            font-size: 26rpx;
            color: $sd-text-2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      .message-time {
        font-size: 24rpx;
        color: $sd-text-3;
        flex-shrink: 0;
      }
    }

    .contact-info {
      margin-bottom: 20rpx;

      .info-item {
        display: inline-block;
        font-size: 24rpx;
        color: $sd-text-2;
        margin-right: 20rpx;
        background: $sd-bg-raise;
        border: 1rpx solid $sd-stroke;
        padding: 6rpx 16rpx;
        border-radius: $sd-radius-pill;
      }
    }

    .chat-btn {
      position: relative;
      width: 100%;
      height: 70rpx;
      background: linear-gradient(135deg, $sd-gold-bright 0%, $sd-gold 52%, #c9a558 100%);
      color: $sd-gold-ink;
      border-radius: $sd-radius-sm;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        border: none;
      }
    }

    .btn-badge {
      position: absolute;
      top: -10rpx;
      right: 20rpx;
      min-width: 40rpx;
      height: 40rpx;
      background: $sd-cinnabar;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10rpx;
      border: 3rpx solid $sd-bg-elev;

      text {
        font-size: 22rpx;
        color: white;
        font-weight: bold;
      }
    }
  }
}

// 搜索结果
.search-results {
  .contact-card {
    .contact-header .header-left .user-info {
      .nickname {
        font-size: 30rpx;
      }

      .last-message {
        display: none;
      }
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
    color: $sd-gold;
  }

  .empty-text {
    font-size: 28rpx;
    color: $sd-text-2;
    margin-bottom: 10rpx;
  }

  .empty-hint {
    font-size: 24rpx;
    color: $sd-text-3;
  }
}
</style>
