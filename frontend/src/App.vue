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
  --sd-cinnabar-soft: #ff9aa8;
  --sd-purple: #8b7ce8;
  --sd-purple-bright: #b0a4f5;

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

/* ---- 极光：缓慢漂移的光带（可选氛围层，置于根容器内） ---- */
.sd-aurora {
  position: absolute;
  top: -18%;
  left: -12%;
  right: -12%;
  height: 58%;
  pointer-events: none;
  background:
    radial-gradient(46% 56% at 28% 42%, rgba(104, 92, 201, 0.17), transparent 70%),
    radial-gradient(40% 50% at 66% 55%, rgba(106, 155, 216, 0.13), transparent 72%),
    radial-gradient(34% 42% at 50% 22%, rgba(232, 195, 106, 0.09), transparent 70%);
  animation: sd-aurora-drift 24s ease-in-out infinite alternate;
}

@keyframes sd-aurora-drift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.72;
  }

  to {
    transform: translate3d(4%, 5%, 0) scale(1.08);
    opacity: 1;
  }
}

/* ---- 流星：周期性划过天际的一道光（可选氛围层，页面无障碍装饰） ---- */
.sd-shooting-star {
  position: absolute;
  top: 9%;
  right: -12%;
  width: 200rpx;
  height: 2rpx;
  border-radius: 2rpx;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(245, 217, 139, 0.95), rgba(245, 217, 139, 0));
  transform: rotate(-33deg);
  opacity: 0;
  animation: sd-shoot 11s ease-in 3s infinite;

  &::before {
    content: '';
    position: absolute;
    left: -4rpx;
    top: -3rpx;
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
    background: rgba(245, 217, 139, 0.95);
    box-shadow: 0 0 12rpx rgba(245, 217, 139, 0.8);
  }
}

@keyframes sd-shoot {
  0% {
    opacity: 0;
    transform: translate(0, 0) rotate(-33deg);
  }

  3% {
    opacity: 1;
  }

  11% {
    opacity: 0;
    transform: translate(-640rpx, 416rpx) rotate(-33deg);
  }

  100% {
    opacity: 0;
    transform: translate(-640rpx, 416rpx) rotate(-33deg);
  }
}

/* ---- 印章式金徽：圆形字符徽章（功能入口等） ---- */
.sd-sigil {
  @include sd-sigil-base();

  &.sd-sigil--cinnabar {
    @include sd-sigil-base(true);
  }

  &.sd-sigil--purple {
    background:
      radial-gradient(circle at 50% 34%, rgba(139, 124, 232, 0.18) 0%, rgba(139, 124, 232, 0.04) 58%, transparent 72%),
      $sd-bg-raise;
    border: 1rpx solid rgba(139, 124, 232, 0.42);
    color: $sd-purple-bright;
  }

  /* 尺寸修饰符（可与色系修饰符并用） */
  &.sd-sigil--sm {
    width: 64rpx;
    height: 64rpx;
    font-size: 30rpx;
  }

  &.sd-sigil--md {
    width: 92rpx;
    height: 92rpx;
    font-size: 42rpx;
  }

  &.sd-sigil--lg {
    width: 120rpx;
    height: 120rpx;
    font-size: 54rpx;
  }
}

/* ---- 鎏金字：H5 渐变鎏金；小程序端保持亮金纯色（自动降级） ---- */
.sd-gold-text {
  color: $sd-gold-bright;
  font-weight: 600;

  /* #ifdef H5 */
  background: $sd-gold-grad;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  /* #endif */
}

/* ---- 渐隐金线分隔 ---- */
.sd-divider {
  height: 1rpx;
  border: none;
  margin: 30rpx 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(232, 195, 106, 0.35) 32%,
    rgba(160, 178, 255, 0.18) 68%,
    transparent 100%
  );
}

/* ---- 胶囊标签：幸运元素 / 状态 / 元信息 ---- */
.sd-chip {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 6rpx 20rpx;
  border-radius: $sd-radius-pill;
  font-size: 22rpx;
  line-height: 1.6;
  color: $sd-text-2;
  background: rgba(27, 33, 69, 0.72);
  border: 1rpx solid $sd-stroke;

  &.is-gold {
    color: $sd-gold-bright;
    border-color: rgba(232, 195, 106, 0.4);
    background: rgba(232, 195, 106, 0.1);
  }

  &.is-cinnabar {
    color: $sd-cinnabar-soft;
    border-color: rgba(237, 90, 107, 0.38);
    background: rgba(237, 90, 107, 0.1);
  }

  &.is-purple {
    color: $sd-purple-bright;
    border-color: rgba(139, 124, 232, 0.4);
    background: rgba(139, 124, 232, 0.1);
  }
}

/* ---- 入场动效：错落上浮（配合 sd-reveal-1/2/3 使用延迟） ---- */
.sd-reveal,
.sd-reveal-1,
.sd-reveal-2,
.sd-reveal-3,
.sd-reveal-4 {
  animation: sd-reveal-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.sd-reveal-1 {
  animation-delay: 0.07s;
}

.sd-reveal-2 {
  animation-delay: 0.16s;
}

.sd-reveal-3 {
  animation-delay: 0.25s;
}

.sd-reveal-4 {
  animation-delay: 0.34s;
}

@keyframes sd-reveal-up {
  from {
    opacity: 0;
    transform: translate3d(0, 26rpx, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* ---- 安全区 ---- */
.sd-safe-bottom {
  padding-bottom: constant(env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
