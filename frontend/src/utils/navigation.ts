/**
 * H5 兼容的 tab 页导航工具
 *
 * 背景：uni-h5 3.0.0-4020920240930001 的生产构建里，uni.switchTab / uni.reLaunch
 * 跳 tab 页会静默失效（如 登录→首页、首页→商城/缘分匹配）。
 *
 * 这里用条件编译：H5 端用整页导航（history 路由模式下 location.hash 已失效，
 * 整页导航 100% 可靠，代价是低频入口的一次整页加载）；小程序/App 端保持原生 API。
 * 非 tab 页的 navigateTo 不受该 bug 影响，无需处理。
 */

/** 跳转到 tab 页（等价 uni.switchTab） */
export function goToTab(url: string) {
  // #ifdef H5
  window.location.href = url
  // #endif
  // #ifndef H5
  uni.switchTab({ url })
  // #endif
}

/** 关闭所有页面并打开目标页（等价 uni.reLaunch） */
export function relaunch(url: string) {
  // #ifdef H5
  window.location.href = url
  // #endif
  // #ifndef H5
  uni.reLaunch({ url })
  // #endif
}
