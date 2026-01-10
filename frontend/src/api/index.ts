const BASE_URL = '/api'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: any
}

export function request<T = any>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, header } = options

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res: any) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(res.data.message || '请求失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export const api = {
  auth: {
    register: (data: any) => request({ url: '/auth/register', method: 'POST', data }),
    login: (data: any) => request({ url: '/auth/login', method: 'POST', data })
  },
  astrology: {
    calculate: (userId: string) => request({ url: `/astrology/calculate/${userId}`, method: 'POST' })
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
  user: {
    get: (id: string) => request({ url: `/user/${id}`, method: 'GET' }),
    update: (id: string, data: any) => request({ url: `/user/${id}`, method: 'PUT', data }),
    delete: (id: string) => request({ url: `/user/${id}`, method: 'DELETE' })
  }
}