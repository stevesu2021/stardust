<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import 'uview-plus/theme.scss';
@import 'uview-plus/index.scss';

/* ================= 星契集 · 夜观星象 全局主题 ================= */

page {
  /* 运行时令牌（供内联 style 使用） */
  --sd-bg: #0b0e1f;
  --sd-bg-elev: #141936;
  --sd-bg-raise: #1b2145;
  --sd-stroke: rgba(160, 178, 255, 0.14);
  --sd-text: #edeffa;
  --sd-text-2: #a6aecb;
  --sd-text-3: #6b7399;
  --sd-gold: #e8c36a;
  --sd-gold-bright: #f5d98b;
  --sd-cinnabar: #ed5a6b;

  background-color: $sd-bg;
  color: $sd-text;
  font-family: $sd-font-body;
  font-size: 16px;
  line-height: 1.6;
}

/* #ifdef H5 */
body {
  background-color: $sd-bg;
}
/* #endif */

/* ---- 星野背景：三层静态星点 + 呼吸闪烁（放在页面根容器内：<view class="sd-stars"/>） ---- */
.sd-stars {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &::before {
    background-image:
      radial-gradient(2rpx 2rpx at 30rpx 46rpx, rgba(237, 239, 250, 0.5) 50%, transparent 51%),
      radial-gradient(2rpx 2rpx at 132rpx 118rpx, rgba(237, 239, 250, 0.32) 50%, transparent 51%),
      radial-gradient(3rpx 3rpx at 74rpx 178rpx, rgba(232, 195, 106, 0.46) 50%, transparent 51%),
      radial-gradient(2rpx 2rpx at 186rpx 64rpx, rgba(237, 239, 250, 0.36) 50%, transparent 51%);
    background-size: 220rpx 220rpx;
    animation: sd-twinkle 4.5s ease-in-out infinite;
  }

  &::after {
    background-image:
      radial-gradient(2rpx 2rpx at 92rpx 24rpx, rgba(237, 239, 250, 0.28) 50%, transparent 51%),
      radial-gradient(3rpx 3rpx at 24rpx 148rpx, rgba(237, 239, 250, 0.42) 50%, transparent 51%),
      radial-gradient(4rpx 4rpx at 168rpx 96rpx, rgba(245, 217, 139, 0.36) 50%, transparent 51%);
    background-size: 340rpx 340rpx;
    animation: sd-twinkle 6s ease-in-out 1.4s infinite;
  }
}

@keyframes sd-twinkle {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }
}

/* ---- 星云：大面积柔和光晕（置于页面根容器内，与 sd-stars 叠加） ---- */
.sd-nebula {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background:
    radial-gradient(560rpx 380rpx at 84% -8%, rgba(104, 92, 201, 0.2), transparent 70%),
    radial-gradient(620rpx 440rpx at -12% 26%, rgba(47, 66, 138, 0.28), transparent 72%),
    radial-gradient(460rpx 320rpx at 62% 96%, rgba(184, 148, 74, 0.08), transparent 70%);
}

/* ---- 印章式金徽：圆形字符徽章（功能入口等） ---- */
.sd-sigil {
  @include sd-sigil-base();

  &.sd-sigil--cinnabar {
    @include sd-sigil-base(true);
  }
}

/* ---- 安全区 ---- */
.sd-safe-bottom {
  padding-bottom: constant(env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
