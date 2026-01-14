// API 基础 URL 配置
// 为了解决跨域和代理问题，这里使用直接的后端地址
// 在生产环境中，应该配置 Nginx 反向代理

// API 基础 URL 配置
// 在开发环境，前端通过 Vite 代理访问后端
// 在生产环境，需要配置 Nginx 反向代理

// 检测是否在浏览器环境
const isBrowser = typeof window !== 'undefined'

// 开发环境：使用相对路径，通过 Vite proxy 代理到后端
// 生产环境：需要根据实际部署配置
const BASE_URL = '/api'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: any
}

export function request<T = any>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, header } = options

  // 获取 token（从 localStorage 或 uni.getStorageSync）
  let token = ''
  try {
    if (isBrowser) {
      token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').token : ''
    } else {
      token = uni.getStorageSync('user')?.token || ''
    }
  } catch (e) {
    // ignore
  }

  const headers: any = {
    'Content-Type': 'application/json',
    ...header
  }

  // 如果有 token，添加到 Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: headers,
      timeout: 600000, // 设置10分钟超时（AI解读可能需要较长时间）
      success: (res: any) => {
        // 200 OK 和 201 Created 都视为成功
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res.data)
        } else {
          // 调试日志
          console.log('[API] Non-200 response:', {
            url,
            statusCode: res.statusCode,
            dataType: typeof res.data,
            data: res.data,
            dataKeys: res.data ? Object.keys(res.data) : null,
          })

          // 尝试从响应中提取错误消息
          let errorMessage = '请求失败'
          if (typeof res.data === 'string') {
            errorMessage = res.data
          } else if (res.data && res.data.message) {
            errorMessage = res.data.message
          } else if (res.data && res.data.error) {
            errorMessage = res.data.error
          } else if (res.data) {
            errorMessage = JSON.stringify(res.data)
          }

          console.log('[API] Extracted error message:', errorMessage)

          const error = new Error(errorMessage) as any
          error.statusCode = res.statusCode
          error.data = res.data
          reject(error)
        }
      },
      fail: (err) => {
        // uni.request 的 fail 回调
        console.log('[API] Request failed:', err)

        let errorMessage = '网络请求失败'
        if (err.errMsg) {
          errorMessage = err.errMsg
        }
        const error = new Error(errorMessage) as any
        error.originalError = err
        reject(error)
      }
    })
  })
}

export const api = {
  auth: {
    register: (data: any) => request({ url: '/auth/register', method: 'POST', data }),
    login: (data: any) => request({ url: '/auth/login', method: 'POST', data }),
    wechatLogin: (data: any) => request({ url: '/auth/wechat/login', method: 'POST', data }),
    bindWechat: (data: any) => request({ url: '/auth/wechat/bind', method: 'POST', data }),
    unbindWechat: () => request({ url: '/auth/wechat/unbind', method: 'POST' }),
    getProfile: () => request({ url: '/auth/profile', method: 'GET' })
  },
  astrology: {
    calculate: (userId: string) => request({ url: `/astrology/calculate/${userId}`, method: 'POST' }),
    generateInterpretation: () => request({ url: '/astrology/interpret', method: 'POST' }),
    getReading: () => request({ url: '/astrology/reading', method: 'GET' })
  },
  prayer: {
    create: (data: any) => request({ url: '/prayer', method: 'POST', data }),
    list: (userId: string) => request({ url: `/prayer/user/${userId}`, method: 'GET' }),
    public: (skip = 0, take = 20) => request({ url: `/prayer/public?skip=${skip}&take=${take}`, method: 'GET' }),
    increment: (prayerId: string) => request({ url: `/prayer/increment/${prayerId}`, method: 'POST' })
  },
  confession: {
    create: (data: any) => request({ url: '/confession', method: 'POST', data }),
    list: (userId: string) => request({ url: `/confession/user/${userId}`, method: 'GET' }),
    public: (skip = 0, take = 20) => request({ url: `/confession/public?skip=${skip}&take=${take}`, method: 'GET' }),
    match: (confessionId: string) => request({ url: `/confession/match/${confessionId}`, method: 'POST' })
  },
  treehole: {
    create: (data: any) => request({ url: '/treehole', method: 'POST', data }),
    list: (userId: string) => request({ url: `/treehole/user/${userId}`, method: 'GET' }),
    public: (skip = 0, take = 20) => request({ url: `/treehole/public?skip=${skip}&take=${take}`, method: 'GET' }),
    like: (treeholeId: string) => request({ url: `/treehole/like/${treeholeId}`, method: 'POST' }),
    delete: (treeholeId: string, userId: string) => request({ url: `/treehole/${treeholeId}`, method: 'DELETE', data: { userId } })
  },
  dating: {
    matches: (userId: string, limit = 10) => request({ url: `/dating/matches/${userId}`, method: 'POST', data: { limit } }),
    sendMessage: (data: any) => request({ url: '/dating/message', method: 'POST', data }),
    messages: (userId: string, otherUserId: string) => request({ url: `/dating/messages/${userId}/${otherUserId}`, method: 'GET' }),
    markRead: (messageId: string) => request({ url: `/dating/message/read/${messageId}`, method: 'POST' })
  },
  palm: {
    getHistory: () => request({ url: '/palm/history', method: 'GET' }),
    delete: (id: string) => request({ url: `/palm/history/${id}`, method: 'DELETE' })
  },
  user: {
    get: (id: string) => request({ url: `/user/${id}`, method: 'GET' }),
    update: (id: string, data: any) => request({ url: `/user/${id}`, method: 'PUT', data }),
    delete: (id: string) => request({ url: `/user/${id}`, method: 'DELETE' })
  }
}