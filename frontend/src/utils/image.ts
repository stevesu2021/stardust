/**
 * 上传前图片压缩工具（平台自适应，全程 fail-safe）
 *
 * 背景：uni-h5 (3.0.0-4020920240930001) 未实现 uni.compressImage，
 * 直接调用会同步抛错/回调不执行，导致选择图片后 Promise 永远挂起、
 * 页面无任何反应（Android 真机 拍照/相册全挂）。
 *
 * 策略：
 * - H5：用 canvas 等比缩放压缩，输出 blob: URL（chooseImage 在 H5 本身就返回 blob:，
 *   uni.uploadFile 原生支持）；canvas 被污染/任何异常 → 原样返回。
 * - 小程序/App：uni.compressImage 存在才调用（typeof 防御），失败原样返回。
 *
 * 本函数永远不会 reject、永远不会挂起：任何分支失败都 resolve(src)。
 */

const MAX_DIM = 1280
const QUALITY = 0.8

/** H5 canvas 压缩：返回压缩后的 blob: URL 或原图 src */
function h5Compress(src: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new Image()
      // 10s 兜底，防止图片解码卡住导致挂起
      const timer = setTimeout(() => resolve(src), 10000)
      const done = (v: string) => {
        clearTimeout(timer)
        resolve(v)
      }
      img.onload = () => {
        try {
          const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height))
          if (scale >= 1) return done(src) // 尺寸已达标，无需压缩
          const w = Math.round(img.width * scale)
          const h = Math.round(img.height * scale)
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          if (!ctx) return done(src)
          ctx.drawImage(img, 0, 0, w, h)
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size > 0) done(URL.createObjectURL(blob))
              else done(src)
            },
            'image/jpeg',
            QUALITY
          )
        } catch {
          done(src)
        }
      }
      img.onerror = () => done(src)
      img.src = src
    } catch {
      resolve(src)
    }
  })
}

/** 小程序/App 压缩：uni.compressImage 可用时才用，否则原样返回 */
function mpCompress(src: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      if (typeof (uni as any).compressImage !== 'function') return resolve(src)
      uni.getImageInfo({
        src,
        success: (info: any) => {
          if (!info || !info.width || info.width <= MAX_DIM) return resolve(src)
          uni.compressImage({
            src,
            quality: 80,
            success: (res: any) => resolve(res.tempFilePath || src),
            fail: () => resolve(src)
          } as any)
        },
        fail: () => resolve(src)
      })
    } catch {
      resolve(src)
    }
  })
}

/** 上传前压缩入口：H5 走 canvas，其他端走 uni.compressImage（带防御） */
export function compressImageForUpload(src: string): Promise<string> {
  if (!src) return Promise.resolve(src)
  // #ifdef H5
  return h5Compress(src)
  // #endif
  // #ifndef H5
  return mpCompress(src)
  // #endif
}
