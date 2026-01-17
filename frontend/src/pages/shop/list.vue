<template>
  <view class="container">
    <!-- 顶部banner -->
    <view class="banner">
      <text class="banner-title">🌟 星契商城</text>
      <text class="banner-subtitle">精选星座周边，为你带来好运</text>
    </view>

    <!-- 分类筛选 -->
    <scroll-view scroll-x class="categories">
      <view class="categories-inner">
        <view
          v-for="cat in categoryList"
          :key="cat.id"
          class="category-item"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <text class="category-icon">{{ cat.icon }}</text>
          <text class="category-name">{{ cat.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 商品列表 -->
    <view v-if="loading" class="loading">
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else class="products">
      <view
        v-for="product in productList"
        :key="product.id"
        class="product-item"
        @click="goToDetail(product)"
      >
        <view class="product-image">
          <image
            v-if="product.imageUrl"
            :src="product.imageUrl"
            class="product-img"
            mode="aspectFill"
          />
          <text v-else class="product-placeholder">📦</text>
        </view>
        <view class="product-info">
          <text class="product-name">{{ product.title }}</text>
          <text class="product-shop">{{ product.shopName }}</text>
          <view class="product-footer">
            <text class="product-price">¥{{ product.price }}</text>
            <text class="product-category">{{ product.category }}</text>
          </view>
        </view>
      </view>

      <view v-if="productList.length === 0" class="empty">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无商品</text>
      </view>

      <view v-if="hasMore" class="load-more" @click="loadMore">
        <text class="load-more-text">加载更多</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { api } from '@/api'

const selectedCategory = ref('all')
const loading = ref(false)
const products = ref<any[]>([])
const categories = ref<string[]>([])
const skip = ref(0)
const take = 20
const hasMore = ref(true)

// 分类配置（图标映射）
const categoryIcons: Record<string, string> = {
  '全部': '🏪',
  '手串': '⚪',
  '吊坠': '📿',
  '香薰': '🕯️',
  '水晶': '💎',
  '星座手链': '⭐',
  '玛瑙': '🔴',
}

// 分类列表（包含动态加载的分类）
const categoryList = computed(() => {
  const baseCategories = [
    { id: 'all', name: '全部', icon: '🏪' }
  ]

  // 添加从后端获取的分类
  const dynamicCategories = categories.value.map(cat => ({
    id: cat,
    name: cat,
    icon: categoryIcons[cat] || '📦'
  }))

  return [...baseCategories, ...dynamicCategories]
})

// 当前商品列表
const productList = computed(() => {
  return products.value
})

// 选择分类
function selectCategory(id: string) {
  selectedCategory.value = id
  skip.value = 0
  products.value = []
  hasMore.value = true
  loadProducts()
}

// 加载商品
async function loadProducts() {
  if (loading.value) return
  loading.value = true

  try {
    const category = selectedCategory.value === 'all' ? undefined : selectedCategory.value
    const res: any = await api.products.getList(skip.value, take, category)

    if (skip.value === 0) {
      products.value = res.products
    } else {
      products.value = [...products.value, ...res.products]
    }

    // 判断是否还有更多
    hasMore.value = res.products.length === take

    // 如果是第一次加载且没有分类，加载分类列表
    if (categories.value.length === 0) {
      loadCategories()
    }
  } catch (error: any) {
    uni.showToast({ title: error.message || '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 加载更多
function loadMore() {
  if (!hasMore.value || loading.value) return
  skip.value += take
  loadProducts()
}

// 加载分类
async function loadCategories() {
  try {
    const res: any = await api.products.getCategories()
    categories.value = res
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

// 跳转到商品详情（打开1688链接）
function goToDetail(product: any) {
  if (product.productUrl) {
    // 复制链接到剪贴板
    uni.setClipboardData({
      data: product.productUrl,
      success: () => {
        uni.showModal({
          title: '提示',
          content: '商品链接已复制，将在浏览器中打开',
          showCancel: false,
          success: () => {
            // 在H5环境可以直接跳转
            // #ifdef H5
            window.open(product.productUrl, '_blank')
            // #endif
          }
        })
      }
    })
  } else {
    uni.showToast({ title: '商品链接不可用', icon: 'none' })
  }
}

onMounted(() => {
  loadProducts()
})

onShow(() => {
  // 每次显示页面时刷新
  if (skip.value === 0) {
    loadProducts()
  }
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f8f9fa;
}

.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 40rpx;
  text-align: center;

  .banner-title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: white;
    margin-bottom: 15rpx;
  }

  .banner-subtitle {
    display: block;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}

.categories {
  background: white;
  padding: 20rpx 0;
  white-space: nowrap;

  .categories-inner {
    display: inline-flex;
    padding: 0 20rpx;
    gap: 20rpx;
  }

  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 30rpx;
    border-radius: 40rpx;
    background: #f5f5f5;
    min-width: 120rpx;
    transition: all 0.3s;

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      .category-icon,
      .category-name {
        color: white;
      }
    }

    .category-icon {
      font-size: 40rpx;
      margin-bottom: 8rpx;
    }

    .category-name {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;

  .loading-text {
    font-size: 28rpx;
    color: #999;
  }
}

.products {
  padding: 30rpx 20rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;

  .product-item {
    background: white;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .product-image {
      width: 100%;
      height: 280rpx;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      .product-img {
        width: 100%;
        height: 100%;
      }

      .product-placeholder {
        font-size: 100rpx;
      }
    }

    .product-info {
      padding: 20rpx;

      .product-name {
        display: block;
        font-size: 26rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.4;
        height: 72rpx;
      }

      .product-shop {
        display: block;
        font-size: 22rpx;
        color: #999;
        margin-bottom: 15rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .product-price {
          font-size: 32rpx;
          font-weight: bold;
          color: #ff6b6b;
        }

        .product-category {
          font-size: 20rpx;
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          padding: 4rpx 12rpx;
          border-radius: 12rpx;
        }
      }
    }
  }

  .empty {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 0;

    .empty-icon {
      font-size: 120rpx;
      margin-bottom: 30rpx;
    }

    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }

  .load-more {
    grid-column: 1 / -1;
    text-align: center;
    padding: 30rpx;

    .load-more-text {
      font-size: 26rpx;
      color: #667eea;
    }
  }
}
</style>
