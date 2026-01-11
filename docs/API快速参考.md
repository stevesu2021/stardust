# 星契集 - API 快速参考

## 🚀 快速开始

### 基础地址
```
http://localhost:3000/api
```

---

## 🔐 认证相关 API

### 1. 用户注册
```bash
POST /auth/register
Content-Type: application/json

{
  "nickname": "张三",
  "phone": "13800138000",
  "password": "123456",
  "gender": "male",
  "birthYear": 1990,
  "birthMonth": 5,
  "birthDay": 15,
  "birthHour": 6
}
```

### 2. 账号密码登录
```bash
POST /auth/login
Content-Type: application/json

{
  "identifier": "13800138000",
  "password": "123456"
}
```

### 3. 微信登录
```bash
POST /auth/wechat/login
Content-Type: application/json

{
  "code": "微信code",
  "userInfo": {
    "nickName": "微信用户",
    "avatarUrl": "https://..."
  }
}
```

### 4. 绑定微信 (需登录)
```bash
POST /auth/wechat/bind
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "微信code"
}
```

### 5. 解绑微信 (需登录)
```bash
POST /auth/wechat/unbind
Authorization: Bearer <token>
```

### 6. 获取用户信息 (需登录)
```bash
GET /auth/profile
Authorization: Bearer <token>
```

---

## 📱 前端 API 调用示例

### api/index.ts
```typescript
export const api = {
  auth: {
    register: (data: any) => request({ url: '/auth/register', method: 'POST', data }),
    login: (data: any) => request({ url: '/auth/login', method: 'POST', data }),
    wechatLogin: (data: any) => request({ url: '/auth/wechat/login', method: 'POST', data }),
    bindWechat: (data: any) => request({ url: '/auth/wechat/bind', method: 'POST', data }),
    unbindWechat: () => request({ url: '/auth/wechat/unbind', method: 'POST' }),
    getProfile: () => request({ url: '/auth/profile', method: 'GET' })
  }
}
```

---

## 🎯 前端页面路径

| 页面 | 路径 | 功能 |
|------|------|------|
| 注册 | `/pages/auth/register` | 用户注册 |
| 登录 | `/pages/auth/login` | 账号密码登录 |
| 个人中心 | `/pages/user/profile` | 登录状态切换 |
| 编辑资料 | `/pages/user/edit-profile` | 完善个人信息 |

---

## 🔒 Token 使用

### 保存 Token
```typescript
const res = await api.auth.login(data)
uni.setStorageSync('token', res.token)
```

### 使用 Token
```typescript
const token = uni.getStorageSync('token')
// 在请求中自动添加
```

### Pinia Store
```typescript
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
userStore.setToken(res.token)
userStore.setUserInfo(res.user)
```

---

## 📊 数据库表结构

### Users 表
```sql
CREATE TABLE users (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) UNIQUE,
  phone VARCHAR(191) UNIQUE,
  password VARCHAR(191),
  nickname VARCHAR(191),
  avatar VARCHAR(191),
  birthYear INT NOT NULL,
  birthMonth INT NOT NULL,
  birthDay INT NOT NULL,
  birthHour INT NOT NULL,
  lunarDate VARCHAR(191),
  zodiacSign VARCHAR(191),
  fiveElements VARCHAR(191),
  gender VARCHAR(191),
  bio VARCHAR(191),
  wechatOpenId VARCHAR(191) UNIQUE,
  wechatUnionId VARCHAR(191) UNIQUE,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL
);
```

---

## ✅ 测试数据

### 测试账号 1 (手机注册)
```json
{
  "phone": "13900009999",
  "password": "test123456"
}
```

### 测试账号 2 (微信登录)
```json
{
  "code": "testcode123",
  "userInfo": {
    "nickName": "微信用户",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

---

## 🔧 环境配置

### backend/.env
```env
DATABASE_URL="mysql://stardust_user:stardust_pass123@localhost:3306/stardust"
JWT_SECRET="stardust-secret-key-change-in-production"
JWT_EXPIRATION="7d"
PORT=3000
```

### frontend/vite.config.ts
```typescript
proxy: {
  '/api': {
    target: 'http://0.0.0.0:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '/api')
  }
}
```

---

## 🚀 启动服务

### 后端
```bash
cd /root/github/stardust/backend
npm run start
# 运行在 http://0.0.0.0:3000
```

### 前端
```bash
cd /root/github/stardust/frontend
npm run dev:h5
# 运行在 http://localhost:8080
```

### MySQL
```bash
service mysql start
mysql -u stardust_user -p stardust_pass123 -D stardust
```

---

## 📝 常用命令

### 查看数据库用户
```bash
mysql -e "SELECT id, nickname, phone, wechatOpenId FROM stardust.users;"
```

### 测试注册 API
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nickname":"测试","phone":"13900008888","password":"123456","birthYear":1990,"birthMonth":1,"birthDay":1,"birthHour":0}'
```

### 测试登录 API
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"13900008888","password":"123456"}'
```

---

**版本**: 1.0.0
**更新时间**: 2026-01-11
