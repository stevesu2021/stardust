<template>
  <view class="container">
    <!-- 顶部banner -->
    <view class="banner">
      <text class="banner-title">🌟 星契商城</text>
      <text class="banner-subtitle">精选星座周边，为你带来好运</text>
    </view>

    <!-- 分类筛选 -->
    <view class="categories">
      <view
        v-for="cat in categories"
        :key="cat.id"
        class="category-item"
        :class="{ active: selectedCategory === cat.id }"
        @click="selectCategory(cat.id)"
      >
        <text class="category-icon">{{ cat.icon }}</text>
        <text class="category-name">{{ cat.name }}</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="products">
      <view
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-item"
        @click="goToDetail(product.id)"
      >
        <view class="product-image">
          <text class="product-placeholder">{{ product.icon }}</text>
        </view>
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-desc">{{ product.description }}</text>
          <view class="product-footer">
            <text class="product-price">¥{{ product.price }}</text>
            <text class="product-sold">已售{{ product.sold }}+</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedCategory = ref('all')

const categories = [
  { id: 'all', name: '全部', icon: '🏪' },
  { id: 'crystal', name: '水晶', icon: '💎' },
  { id: 'bracelet', name: '手串', icon: '⚪' },
  { id: 'pendant', name: '吊坠', icon: '📿' },
  { id: 'incense', name: '香薰', icon: '🕯️' }
]

const products = [
  {
    id: 1,
    name: '紫水晶手串',
    description: '招桃花、增进人缘',
    price: '168',
    sold: 520,
    category: 'bracelet',
    icon: '💜'
  },
  {
    id: 2,
    name: '白水晶项链',
    description: '净化磁场、提升灵性',
    price: '128',
    sold: 340,
    category: 'pendant',
    icon: '⚪'
  },
  {
    id: 3,
    name: '粉水晶手链',
    description: '招爱情、改善人际关系',
    price: '188',
    sold: 890,
    category: 'bracelet',
    icon: '🩷'
  },
  {
    id: 4,
    name: '黄水晶貔貅',
    description: '招财、增强自信',
    price: '298',
    sold: 210,
    category: 'crystal',
    icon: '🟡'
  },
  {
    id: 5,
    name: '檀香线香',
    description: '静心、助眠、祈福',
    price: '68',
    sold: 1200,
    category: 'incense',
    icon: '🪵'
  },
  {
    id: 6,
    name: '黑曜石手串',
    description: '辟邪、化煞、保平安',
    price: '158',
    sold: 670,
    category: 'bracelet',
    icon: '⚫'
  },
  {
    id: 7,
    name: '月光石吊坠',
    description: '柔和情感、舒缓压力',
    price: '218',
    sold: 180,
    category: 'pendant',
    icon: '🌙'
  },
  {
    id: 8,
    name: '鼠尾草香薰',
    description: '净化空间、去除负能量',
    price: '88',
    sold: 560,
    category: 'incense',
    icon: '🌿'
  }
]

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return products
  }
  return products.filter(p => p.category === selectedCategory.value)
})

function selectCategory(id: string) {
  selectedCategory.value = id
}

function goToDetail(id: number) {
  uni.showToast({ title: '商品详情开发中', icon: 'none' })
}
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
  display: flex;
  padding: 30rpx 20rpx;
  background: white;
  overflow-x: auto;
  white-space: nowrap;
  gap: 20rpx;

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

      .product-placeholder {
        font-size: 100rpx;
      }
    }

    .product-info {
      padding: 20rpx;

      .product-name {
        display: block;
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .product-desc {
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

        .product-sold {
          font-size: 20rpx;
          color: #999;
        }
      }
    }
  }
}
</style>
