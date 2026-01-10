<template>
  <view class="container">
    <view class="header">
      <text class="title">星尘</text>
      <text class="subtitle">探索你的星座与缘分</text>
    </view>

    <view class="features">
      <view class="feature-item" @click="goToPage('/pages/astrology/calculate')">
        <text class="feature-icon">✨</text>
        <text class="feature-title">星盘计算</text>
        <text class="feature-desc">阳历转农历、星座、五行</text>
      </view>

      <view class="feature-item" @click="goToPage('/pages/prayer/list')">
        <text class="feature-icon">🙏</text>
        <text class="feature-title">复合祈愿</text>
        <text class="feature-desc">为爱情祈福</text>
      </view>

      <view class="feature-item" @click="goToPage('/pages/confession/list')">
        <text class="feature-icon">❤️</text>
        <text class="feature-title">月老红线</text>
        <text class="feature-desc">暗恋表白</text>
      </view>

      <view class="feature-item" @click="goToPage('/pages/treehole/list')">
        <text class="feature-icon">🌳</text>
        <text class="feature-title">树洞</text>
        <text class="feature-desc">匿名分享心情</text>
      </view>

      <view class="feature-item" @click="goToPage('/pages/dating/matches')">
        <text class="feature-icon">💑</text>
        <text class="feature-title">缘分匹配</text>
        <text class="feature-desc">基于星座五行的交友</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
function goToPage(url: string) {
  uni.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
}

.header {
  text-align: center;
  margin-bottom: 60rpx;

  .title {
    display: block;
    font-size: 60rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }

  .subtitle {
    display: block;
    font-size: 28rpx;
    color: #999;
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30rpx;
}

.feature-item {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }

  .feature-icon {
    display: block;
    font-size: 60rpx;
    margin-bottom: 20rpx;
  }

  .feature-title {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }

  .feature-desc {
    display: block;
    font-size: 24rpx;
    color: #999;
  }
}
</style>