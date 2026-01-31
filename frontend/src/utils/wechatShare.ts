/**
 * 微信分享工具类
 * 支持H5和微信小程序环境
 */

export interface ShareOptions {
  title: string
  desc?: string
  path?: string
  imageUrl?: string
}

export interface WechatShareResult {
  success: boolean
  errMsg?: string
}

/**
 * 判断是否在微信环境中
 */
export function isWeixinBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase()
  return /micromessenger/.test(ua)
}

/**
 * 判断是否是微信小程序
 */
export function isWeixinMiniProgram(): boolean {
  // @ts-ignore
  return typeof wx !== 'undefined' && wx.__subwebview__ === undefined
}

/**
 * 微信H5分享（需要引入微信JS-SDK）
 * 注意：需要后端配合签名
 */
export async function shareToWechatH5(options: ShareOptions): Promise<WechatShareResult> {
  return new Promise((resolve) => {
    // @ts-ignore
    if (typeof wx === 'undefined') {
      console.warn('微信JS-SDK未加载')
      resolve({ success: false, errMsg: '微信JS-SDK未加载' })
      return
    }

    // @ts-ignore
    wx.ready(() => {
      // 分享到好友
      // @ts-ignore
      wx.updateAppMessageShareData({
        title: options.title,
        desc: options.desc || '',
        link: window.location.href,
        imgUrl: options.imageUrl || '',
        success: () => {
          console.log('设置分享给好友成功')
          resolve({ success: true })
        },
        cancel: () => {
          console.log('取消分享')
          resolve({ success: false, errMsg: '用户取消' })
        },
        fail: (err: any) => {
          console.error('分享失败', err)
          resolve({ success: false, errMsg: err.errMsg || '分享失败' })
        }
      })

      // 分享到朋友圈
      // @ts-ignore
      wx.updateTimelineShareData({
        title: options.title,
        link: window.location.href,
        imgUrl: options.imageUrl || '',
        success: () => {
          console.log('设置分享到朋友圈成功')
        },
        cancel: () => {
          console.log('取消分享')
        },
        fail: (err: any) => {
          console.error('分享失败', err)
        }
      })
    })

    // @ts-ignore
    wx.error((res: any) => {
      console.error('微信JS-SDK配置失败', res)
      resolve({ success: false, errMsg: res.errMsg || 'JS-SDK配置失败' })
    })
  })
}

/**
 * 微信小程序分享
 */
export function shareToWechatMiniProgram(options: ShareOptions): WechatShareResult {
  try {
    uni.share({
      provider: 'weixin',
      scene: 'WXSceneSession',
      type: 5, // 图文分享
      title: options.title,
      imageUrl: options.imageUrl || '',
      success: () => {
        console.log('分享成功')
        uni.showToast({ title: '分享成功', icon: 'success' })
      },
      fail: (err: any) => {
        console.error('分享失败', err)
        uni.showToast({ title: '分享失败', icon: 'none' })
      }
    })
    return { success: true }
  } catch (error: any) {
    console.error('分享异常', error)
    return { success: false, errMsg: error.message || '分享异常' }
  }
}

/**
 * 通用分享入口
 * 自动判断环境并调用相应的分享方法
 */
export async function share(options: ShareOptions): Promise<WechatShareResult> {
  // #ifdef H5
  if (isWeixinBrowser()) {
    // 在微信浏览器中，需要先配置JS-SDK
    // 这里假设已经配置好了，直接调用
    return await shareToWechatH5(options)
  } else {
    // 非微信环境，使用系统分享或提示
    uni.showActionSheet({
      itemList: ['分享到微信好友', '分享到朋友圈', '复制链接'],
      success: (res: any) => {
        if (res.tapIndex === 2) {
          // 复制链接
          uni.setClipboardData({
            data: window.location.href,
            success: () => {
              uni.showToast({ title: '链接已复制', icon: 'success' })
            }
          })
        } else {
          uni.showToast({
            title: '请在微信中打开',
            icon: 'none'
          })
        }
      }
    })
    return { success: true }
  }
  // #endif

  // #ifdef MP-WEIXIN
  // 微信小程序环境
  return shareToWechatMiniProgram(options)
  // #endif

  // #ifdef APP-PLUS
  // App环境
  return shareToWechatMiniProgram(options)
  // #endif

  // 其他环境，返回成功但提示不支持
  return { success: false, errMsg: '当前环境不支持分享' }
}

/**
 * 显示分享菜单
 * 弹出分享选项让用户选择
 */
export function showShareMenu(options: ShareOptions): void {
  uni.showActionSheet({
    itemList: ['分享给微信好友', '分享到朋友圈', '生成图片分享'],
    success: (res: any) => {
      switch (res.tapIndex) {
        case 0:
          // 分享给好友
          share({
            ...options,
            path: options.path || '/pages/index/index'
          })
          break
        case 1:
          // 分享到朋友圈（需要生成图片）
          share({
            ...options,
            title: options.title
          })
          break
        case 2:
          // 生成分享图片
          if (options.generateImage) {
            options.generateImage()
          } else {
            uni.showToast({ title: '图片生成功能开发中', icon: 'none' })
          }
          break
      }
    }
  })
}

/**
 * 在页面中配置分享信息（用于小程序onShareAppMessage）
 * 返回onShareAppMessage和onShareTimeline的配置
 */
export function useWechatShare(defaultOptions: ShareOptions) {
  // 小程序分享给好友
  const onShareAppMessage = (options: any = {}) => {
    return {
      title: defaultOptions.title,
      path: defaultOptions.path || '/pages/index/index',
      imageUrl: defaultOptions.imageUrl || '',
      ...options
    }
  }

  // 小程序分享到朋友圈
  const onShareTimeline = () => {
    return {
      title: defaultOptions.title,
      imageUrl: defaultOptions.imageUrl || '',
      query: ''
    }
  }

  return {
    onShareAppMessage,
    onShareTimeline,
    share: () => share(defaultOptions),
    showShareMenu: () => showShareMenu(defaultOptions)
  }
}

/**
 * 复制分享链接
 */
export function copyShareLink(url?: string): Promise<boolean> {
  return new Promise((resolve) => {
    const link = url || window.location.href
    uni.setClipboardData({
      data: link,
      success: () => {
        uni.showToast({ title: '链接已复制', icon: 'success' })
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}
