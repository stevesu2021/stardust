/**
 * H5 兼容的 tab 页导航工具
 *
 * 背景：uni-h5 3.0.0-4020920240930001 的生产构建里，uni.switchTab / uni.reLaunch
 * 跳转 tab 页会静默失效（如 登录→首页、首页→商城/缘分匹配），而直接修改
 * location.hash 驱动 vue-router 是可用的。
 *
 * 这里用条件编译：H5 端走 hash 路由，小程序/App 端保持原生 API。
 * 非 tab 页的 navigateTo 不受该 bug 影响，无需处理。
 */

function toHashUrl(url: string): string {
  return '#/' + (url.startsWith('/') ? url.slice(1) : url)
}

/** 跳转到 tab 页（等价 uni.switchTab） */
export function goToTab(url: string) {
  // #ifdef H5
  window.location.hash = toHashUrl(url)
  // #endif
  // #ifndef H5
  uni.switchTab({ url })
  // #endif
}

/** 关闭所有页面并打开目标页（等价 uni.reLaunch） */
export function relaunch(url: string) {
  // #ifdef H5
  window.location.hash = toHashUrl(url)
  // #endif
  // #ifndef H5
  uni.reLaunch({ url })
  // #endif
}
