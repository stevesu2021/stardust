# 星契集 - 用户认证 API 设计文档

## 📋 概述

本文档详细设计了星契集小程序的用户注册和登录相关 API 接口，包括账号密码登录、微信登录、绑定/解绑微信等功能。

---

## 🔐 用户注册接口

### 接口信息
- **URL**: `/api/auth/register`
- **方法**: `POST`
- **认证**: 无需认证
- **描述**: 用户通过手机号+密码注册账号

### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| nickname | string | ✅ | 用户昵称 | "张三" |
| phone | string | ✅ | 手机号 (唯一) | "13800138000" |
| password | string | ✅ | 密码 | "123456" |
| gender | string | ❌ | 性别 (male/female) | "male" |
| birthYear | number | ✅ | 出生年份 | 1990 |
| birthMonth | number | ✅ | 出生月份 (1-12) | 5 |
| birthDay | number | ✅ | 出生日期 (1-31) | 15 |
| birthHour | number | ✅ | 出生时辰 (0-11) | 6 |

**出生时辰映射:**
```
0: 子时 (23:00-01:00)
1: 丑时 (01:00-03:00)
2: 寅时 (03:00-05:00)
3: 卯时 (05:00-07:00)
4: 辰时 (07:00-09:00)
5: 巳时 (09:00-11:00)
6: 午时 (11:00-13:00)
7: 未时 (13:00-15:00)
8: 申时 (15:00-17:00)
9: 酉时 (17:00-19:00)
10: 戌时 (19:00-21:00)
11: 亥时 (21:00-23:00)
```

### 请求示例

```json
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

### 响应示例

**成功 (200):**
```json
{
  "success": true,
  "user": {
    "id": "17913ef5-d499-4b99-b491-6a68d7c24add",
    "email": null,
    "phone": "13900007777",
    "nickname": "测试用户",
    "avatar": null,
    "birthYear": 1990,
    "birthMonth": 1,
    "birthDay": 1,
    "birthHour": 0,
    "lunarDate": null,
    "zodiacSign": null,
    "fiveElements": null,
    "gender": null,
    "bio": null,
    "wechatOpenId": null,
    "wechatUnionId": null,
    "createdAt": "2026-01-11T06:30:46.791Z",
    "updatedAt": "2026-01-11T06:30:46.791Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**失败 - 手机号已存在 (400):**
```json
{
  "statusCode": 400,
  "message": "该手机号已被注册",
  "error": "Bad Request"
}
```

**失败 - 密码为空 (400):**
```json
{
  "statusCode": 400,
  "message": "密码不能为空",
  "error": "Bad Request"
}
```

**失败 - 缺少出生信息 (400):**
```json
{
  "statusCode": 400,
  "message": "请填写完整的出生信息",
  "error": "Bad Request"
}
```

**失败 - 未提供手机号或邮箱 (400):**
```json
{
  "statusCode": 400,
  "message": "请提供手机号或邮箱",
  "error": "Bad Request"
}
```

---

## 🔑 用户登录接口

### 接口信息
- **URL**: `/api/auth/login`
- **方法**: `POST`
- **认证**: 无需认证
- **描述**: 通过手机号或邮箱 + 密码登录

### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| identifier | string | ✅ | 手机号或邮箱 | "13800138000" 或 "user@example.com" |
| password | string | ✅ | 密码 | "123456" |

### 请求示例

```json
{
  "identifier": "13800138000",
  "password": "123456"
}
```

### 响应示例

**成功 (200):**
```json
{
  "success": true,
  "user": {
    "id": "17913ef5-d499-4b99-b491-6a68d7c24add",
    "email": null,
    "phone": "13900007777",
    "nickname": "测试用户",
    "avatar": null,
    "birthYear": 1990,
    "birthMonth": 1,
    "birthDay": 1,
    "birthHour": 0,
    "lunarDate": null,
    "zodiacSign": null,
    "fiveElements": null,
    "gender": null,
    "bio": null,
    "wechatOpenId": null,
    "wechatUnionId": null,
    "createdAt": "2026-01-11T06:30:46.791Z",
    "updatedAt": "2026-01-11T06:30:46.791Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**失败 - 账号不存在 (404):**
```json
{
  "statusCode": 404,
  "message": "账号不存在",
  "error": "Not Found"
}
```

**失败 - 密码错误 (400):**
```json
{
  "statusCode": 400,
  "message": "密码错误",
  "error": "Bad Request"
}
```

**失败 - 微信账号 (400):**
```json
{
  "statusCode": 400,
  "message": "该账号为微信登录，请使用微信登录",
  "error": "Bad Request"
}
```

**失败 - 参数缺失 (400):**
```json
{
  "statusCode": 400,
  "message": "请填写账号和密码",
  "error": "Bad Request"
}
```

---

## 🟢 微信登录/注册接口

### 接口信息
- **URL**: `/api/auth/wechat/login`
- **方法**: `POST`
- **认证**: 无需认证
- **描述**: 通过微信授权登录，自动注册或登录

### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| code | string | ✅ | 微信小程序登录 code | "07123456789abc" |
| userInfo | object | ❌ | 微信用户信息 | `{ "nickName": "...", "avatarUrl": "..." }` |

### 请求示例

```json
{
  "code": "07123456789abc",
  "userInfo": {
    "nickName": "微信用户",
    "avatarUrl": "https://wx.qlogo.cn/...",
    "gender": 1,
    "country": "China"
  }
}
```

### 响应示例

**成功 - 新用户 (200):**
```json
{
  "success": true,
  "user": {
    "id": "49c1e9fc-df7c-4494-a90f-782d2b64403b",
    "email": null,
    "phone": null,
    "nickname": "微信测试用户",
    "avatar": "https://example.com/avatar.jpg",
    "birthYear": 1990,
    "birthMonth": 1,
    "birthDay": 1,
    "birthHour": 0,
    "lunarDate": null,
    "zodiacSign": null,
    "fiveElements": null,
    "gender": null,
    "bio": null,
    "wechatOpenId": "mock_openid_wechat_test_123",
    "wechatUnionId": "mock_unionid_wechat_test_123",
    "createdAt": "2026-01-11T06:31:46.527Z",
    "updatedAt": "2026-01-11T06:31:46.527Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isNewUser": true
}
```

**成功 - 已存在用户 (200):**
```json
{
  "success": true,
  "user": {
    "id": "49c1e9fc-df7c-4494-a90f-782d2b64403b",
    "nickname": "微信测试用户",
    "wechatOpenId": "mock_openid_wechat_test_123",
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isNewUser": false
}
```

**失败 - code为空 (400):**
```json
{
  "statusCode": 400,
  "message": "微信登录code不能为空",
  "error": "Bad Request"
}
```

---

## 🔗 绑定微信账号接口

### 接口信息
- **URL**: `/api/auth/wechat/bind`
- **方法**: `POST`
- **认证**: ✅ JWT Token
- **描述**: 将微信账号绑定到现有账号

### 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| code | string | ✅ | 微信小程序登录 code | "07123456789abc" |

### 请求示例

```json
{
  "code": "07123456789abc"
}
```

### 响应示例

**成功 (200):**
```json
{
  "success": true,
  "user": {
    "id": "36572dc9-1db1-412b-a111-717553fc4741",
    "wechatOpenId": "mock_openid_07123456789abc",
    "wechatUnionId": "mock_unionid_07123456789abc",
    ...
  }
}
```

**失败 - 已绑定其他账号 (400):**
```json
{
  "statusCode": 400,
  "message": "该微信账号已绑定其他账号",
  "error": "Bad Request"
}
```

---

## 🔓 解绑微信账号接口

### 接口信息
- **URL**: `/api/auth/wechat/unbind`
- **方法**: `POST`
- **认证**: ✅ JWT Token
- **描述**: 解绑微信账号，需确保有其他登录方式

### 请求参数

无

### 响应示例

**成功 (200):**
```json
{
  "success": true,
  "user": {
    "id": "36572dc9-1db1-412b-a111-717553fc4741",
    "wechatOpenId": null,
    "wechatUnionId": null,
    ...
  }
}
```

**失败 - 仅微信登录 (400):**
```json
{
  "statusCode": 400,
  "message": "无法解绑：该账号仅支持微信登录，请先绑定手机号或邮箱",
  "error": "Bad Request"
}
```

**失败 - 未绑定微信 (400):**
```json
{
  "statusCode": 400,
  "message": "该账号未绑定微信",
  "error": "Bad Request"
}
```

---

## 👤 获取用户信息接口

### 接口信息
- **URL**: `/api/auth/profile`
- **方法**: `GET`
- **认证**: ✅ JWT Token
- **描述**: 获取当前登录用户的信息

### 请求示例

```
GET /api/auth/profile
Authorization: Bearer <token>
```

### 响应示例

**成功 (200):**
```json
{
  "userId": "36572dc9-1db1-412b-a111-717553fc4741",
  "message": "认证成功"
}
```

---

## 🔒 JWT 认证

### Token 格式
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token 解析
```typescript
interface JwtPayload {
  sub: string;  // 用户ID
  iat: number;  // 签发时间
  exp: number;  // 过期时间
}
```

### 过期时间
- 默认: 7 天
- 可在 `.env` 中配置 `JWT_EXPIRATION`

---

## 📱 前端调用示例

### 1. 注册账号
```typescript
import { api } from '@/api'

const res = await api.auth.register({
  nickname: '张三',
  phone: '13800138000',
  password: '123456',
  gender: 'male',
  birthYear: 1990,
  birthMonth: 5,
  birthDay: 15,
  birthHour: 6
})

// 保存 token 和用户信息
userStore.setToken(res.token)
userStore.setUserInfo(res.user)
```

### 2. 账号密码登录
```typescript
const res = await api.auth.login({
  identifier: '13800138000',
  password: '123456'
})

userStore.setToken(res.token)
userStore.setUserInfo(res.user)
```

### 3. 微信登录
```typescript
// 获取微信 code
const loginRes = await uni.login({ provider: 'weixin' })

// 获取用户信息
const userInfoRes = await uni.getUserProfile({ desc: '用于完善用户资料' })

// 调用微信登录
const res = await api.auth.wechatLogin({
  code: loginRes.code,
  userInfo: userInfoRes.userInfo
})

userStore.setToken(res.token)
userStore.setUserInfo(res.user)

if (res.isNewUser) {
  // 新用户引导完善资料
  uni.navigateTo({ url: '/pages/user/edit-profile' })
}
```

### 4. 绑定微信
```typescript
const loginRes = await uni.login({ provider: 'weixin' })
await api.auth.bindWechat({ code: loginRes.code })

// 重新获取用户信息
const profileRes = await api.auth.getProfile()
userStore.setUserInfo(profileRes.user)
```

### 5. 解绑微信
```typescript
uni.showModal({
  title: '提示',
  content: '确定要解绑微信账号吗？',
  success: async (res) => {
    if (res.confirm) {
      await api.auth.unbindWechat()
      // 重新获取用户信息
      const profileRes = await api.auth.getProfile()
      userStore.setUserInfo(profileRes.user)
      uni.showToast({ title: '解绑成功', icon: 'success' })
    }
  }
})
```

---

## 🛡️ 安全机制

### 1. 密码加密
- 使用 `bcrypt` 进行密码哈希
- Salt rounds: 10

### 2. 唯一性约束
- `phone`: 唯一
- `email`: 唯一
- `wechatOpenId`: 唯一
- `wechatUnionId`: 唯一

### 3. 微信解绑保护
```typescript
// 检查是否还有其他登录方式
if (!user.email && !user.phone) {
  throw new Error('无法解绑：该账号仅支持微信登录，请先绑定手机号或邮箱')
}
```

### 4. 登录方式检查
```typescript
// 微信用户不能用密码登录
if (!user.password) {
  throw new Error('该账号为微信登录，请使用微信登录')
}
```

---

## 📊 数据库字段说明

### Users 表

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | ✅ | UUID |
| email | string? | ❌ | 邮箱 (唯一) |
| phone | string? | ❌ | 手机号 (唯一) |
| password | string? | ❌ | 密码 (bcrypt 哈希) |
| nickname | string? | ❌ | 昵称 |
| avatar | string? | ❌ | 头像 URL |
| birthYear | number | ✅ | 出生年份 |
| birthMonth | number | ✅ | 出生月份 |
| birthDay | number | ✅ | 出生日期 |
| birthHour | number | ✅ | 出生时辰 |
| lunarDate | string? | ❌ | 农历生日 |
| zodiacSign | string? | ❌ | 星座 |
| fiveElements | string? | ❌ | 五行 |
| gender | string? | ❌ | 性别 |
| bio | string? | ❌ | 个人简介 |
| wechatOpenId | string? | ❌ | 微信 OpenID (唯一) |
| wechatUnionId | string? | ❌ | 微信 UnionID (唯一) |
| createdAt | DateTime | ✅ | 创建时间 |
| updatedAt | DateTime | ✅ | 更新时间 |

---

## 🎯 使用场景

### 场景 1: 新用户注册
```
用户填写信息 → 调用 /api/auth/register → 保存 token → 进入首页
```

### 场景 2: 已有账号登录
```
用户输入账号密码 → 调用 /api/auth/login → 保存 token → 进入首页
```

### 场景 3: 微信一键登录
```
点击微信登录 → 获取 code → 调用 /api/auth/wechat/login →
自动注册或登录 → 新用户引导完善资料
```

### 场景 4: 绑定微信
```
已登录用户 → 点击绑定微信 → 授权 → 调用 /api/auth/wechat/bind → 绑定成功
```

### 场景 5: 解绑微信
```
已登录用户 → 点击解绑微信 → 确认 → 检查其他登录方式 → 解绑成功
```

---

## 🔍 错误码汇总

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 400 | 参数错误/业务逻辑错误 | 检查请求参数或业务规则 |
| 401 | 未授权/Token 无效 | 重新登录获取有效 Token |
| 404 | 用户不存在 | 检查账号或注册新账号 |
| 500 | 服务器内部错误 | 联系管理员 |

---

## 📝 测试建议

### 单元测试
1. 注册 - 正常流程
2. 注册 - 手机号重复
3. 注册 - 参数缺失
4. 登录 - 正确账号密码
5. 登录 - 错误密码
6. 登录 - 用户不存在
7. 微信登录 - 新用户
8. 微信登录 - 已存在用户
9. 绑定微信 - 正常流程
10. 绑定微信 - 微信已绑定其他账号
11. 解绑微信 - 有其他登录方式
12. 解绑微信 - 仅微信登录

### 集成测试
1. 完整注册流程
2. 完整登录流程
3. 微信登录流程
4. 微信绑定/解绑流程

---

**文档版本**: 1.0.0
**最后更新**: 2026-01-11
**状态**: ✅ 已实现并验证
