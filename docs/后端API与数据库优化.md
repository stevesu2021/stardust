# 后端 API 设计与数据库优化方案

## 📋 API 接口详细设计

### 一、认证模块 (Auth)

#### 1.1 用户注册
```typescript
POST /api/auth/register
Content-Type: application/json

// 请求体
{
  "email": "user@example.com",     // 邮箱 (可选)
  "phone": "13800138000",          // 手机号 (可选)
  "password": "StrongPass123!",    // 密码
  "nickname": "星辰",               // 昵称
  "birthYear": 1995,               // 出生年
  "birthMonth": 8,                 // 出生月
  "birthDay": 15,                  // 出生日
  "birthHour": 14,                 // 出生时辰 (0-23)
  "gender": "female",              // 性别
  "code": "123456"                 // 验证码 (如果需要)
}

// 响应 201
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-v4",
      "email": "user@example.com",
      "nickname": "星辰",
      "birthYear": 1995,
      "birthMonth": 8,
      "birthDay": 15,
      "birthHour": 14
    }
  }
}

// 响应 400 (参数错误)
{
  "code": 400,
  "message": "邮箱已存在",
  "errors": ["email"]
}

// 响应 422 (验证失败)
{
  "code": 422,
  "message": "密码强度不足",
  "errors": ["password"]
}
```

#### 1.2 用户登录
```typescript
POST /api/auth/login
Content-Type: application/json

// 请求体 (支持多种登录方式)
{
  "type": "email",                 // email | phone | wechat | douyin
  "email": "user@example.com",     // 邮箱登录时
  "phone": "13800138000",          // 手机登录时
  "password": "StrongPass123!",    // 密码
  "code": "123456",                // 验证码 (可选)
  "platform": "h5"                 // 平台标识
}

// 响应 200
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-here",
    "user": {
      "id": "uuid-v4",
      "email": "user@example.com",
      "nickname": "星辰",
      "zodiacSign": "狮子座",
      "fiveElements": { "wood": 2, "fire": 3, "earth": 1, "metal": 1, "water": 1 },
      "lunarDate": "乙亥年 七月初一"
    }
  }
}
```

#### 1.3 微信/抖音登录
```typescript
POST /api/auth/login/third-party
Content-Type: application/json

// 请求体
{
  "code": "微信/抖音登录code",
  "platform": "wechat",            // wechat | douyin
  "encryptedData": "加密数据",
  "iv": "初始向量"
}

// 响应 200
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { /* 用户信息 */ },
    "isNewUser": false              // 是否新用户
  }
}
```

#### 1.4 刷新 Token
```typescript
POST /api/auth/refresh
Content-Type: application/json

// 请求头
Authorization: Bearer <refreshToken>

// 响应 200
{
  "code": 200,
  "data": {
    "token": "new-access-token",
    "refreshToken": "new-refresh-token"
  }
}
```

### 二、星盘计算模块 (Astrology)

#### 2.1 计算星盘
```typescript
POST /api/astrology/calculate/:userId
Authorization: Bearer <token>

// 响应 200
{
  "code": 200,
  "message": "计算成功",
  "data": {
    "lunar": {
      "lunarYear": 1995,
      "lunarMonth": 7,
      "lunarDay": 1,
      "lunarYearText": "乙亥",
      "lunarMonthText": "七月",
      "lunarDayText": "初一",
      "ganzhiYear": "乙亥",
      "ganzhiMonth": "甲申",
      "ganzhiDay": "庚午",
      "ganzhiHour": "癸未"
    },
    "zodiacSign": "狮子座 ♌",
    "fiveElements": {
      "wood": 2,
      "fire": 3,
      "earth": 1,
      "metal": 1,
      "water": 1
    },
    "analysis": {
      "summary": "火旺之人，性格热情开朗",
      "suggestion": "建议多接触水元素，平衡五行"
    }
  }
}
```

#### 2.2 获取运势
```typescript
GET /api/astrology/fortune/:userId
Authorization: Bearer <token>
Query: date=2025-01-09

// 响应 200
{
  "code": 200,
  "data": {
    "date": "2025-01-09",
    "fortune": "今日运势良好，适合表达情感",
    "luckyNumber": 7,
    "luckyColor": "#FF6B6B",
    "scores": {
      "love": 4,
      "career": 3,
      "wealth": 4,
      "health": 5
    },
    "tips": ["宜表白", "忌冲动", "多沟通"]
  }
}
```

### 三、祈愿模块 (Prayer)

#### 3.1 创建祈愿
```typescript
POST /api/prayer
Authorization: Bearer <token>
Content-Type: application/json

// 请求体
{
  "content": "希望和小明复合",
  "targetName": "小明",
  "image": "https://cdn.example.com/prayer/xxx.jpg"
}

// 响应 201
{
  "code": 201,
  "message": "祈愿发布成功",
  "data": {
    "id": "prayer-uuid",
    "content": "希望和小明复合",
    "targetName": "小明",
    "prayerCount": 1,
    "createdAt": "2025-01-09T14:30:00Z"
  }
}
```

#### 3.2 获取祈愿列表
```typescript
GET /api/prayer/public?skip=0&take=20&sort=hot
Authorization: Bearer <token>

// 响应 200
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "prayer-uuid",
        "user": {
          "id": "user-uuid",
          "nickname": "星辰",
          "avatar": "avatar-url"
        },
        "content": "希望和小明复合",
        "targetName": "小明",
        "prayerCount": 999,
        "createdAt": "2025-01-09T14:30:00Z",
        "isMine": false
      }
    ],
    "pagination": {
      "skip": 0,
      "take": 20,
      "total": 156,
      "hasMore": true
    }
  }
}
```

#### 3.3 为祈愿祈福
```typescript
POST /api/prayer/increment/:prayerId
Authorization: Bearer <token>

// 响应 200
{
  "code": 200,
  "message": "祈福成功",
  "data": {
    "prayerCount": 1000,
    "blessing": "愿你的祈愿成真 🙏"
  }
}
```

### 四、月老红线模块 (Confession)

#### 4.1 发布表白
```typescript
POST /api/confession
Authorization: Bearer <token>
Content-Type: application/json

// 请求体
{
  "targetName": "小红",
  "content": "一直很喜欢你，希望能有机会了解你更多",
  "isAnonymous": true,
  "tags": ["暗恋", "表白"]
}

// 响应 201
{
  "code": 201,
  "message": "表白已发布",
  "data": {
    "id": "confession-uuid",
    "targetName": "小红",
    "content": "一直很喜欢你...",
    "isAnonymous": true,
    "status": "waiting",
    "createdAt": "2025-01-09T15:00:00Z"
  }
}
```

#### 4.2 尝试匹配
```typescript
POST /api/confession/match/:confessionId
Authorization: Bearer <token>

// 响应 200
{
  "code": 200,
  "message": "匹配成功！🎉",
  "data": {
    "matched": true,
    "matchInfo": {
      "confessionId": "confession-uuid",
      "matchedWith": "user-uuid",
      "nickname": "小红",
      "confidence": 0.95
    },
    "chatRoom": {
      "roomId": "room-uuid",
      "token": "chat-token"
    }
  }
}

// 响应 200 (未匹配)
{
  "code": 200,
  "message": "对方还未看到你的表白",
  "data": {
    "matched": false,
    "status": "waiting"
  }
}
```

#### 4.3 获取我的红线
```typescript
GET /api/confession/my
Authorization: Bearer <token>

// 响应 200
{
  "code": 200,
  "data": {
    "sent": [
      {
        "id": "confession-uuid",
        "targetName": "小红",
        "content": "...",
        "isMatched": true,
        "matchedWith": "user-uuid",
        "createdAt": "2025-01-09T15:00:00Z"
      }
    ],
    "received": [
      {
        "id": "confession-uuid",
        "fromUser": {
          "id": "user-uuid",
          "nickname": "小明"
        },
        "content": "...",
        "createdAt": "2025-01-09T16:00:00Z"
      }
    ]
  }
}
```

### 五、树洞模块 (Treehole)

#### 5.1 发布树洞
```typescript
POST /api/treehole
Authorization: Bearer <token>
Content-Type: application/json

// 请求体
{
  "content": "今天工作好累，想找个地方倾诉...",
  "image": "https://cdn.example.com/treehole/xxx.jpg",
  "mood": "sad",
  "anonymous": true
}

// 响应 201
{
  "code": 201,
  "message": "发布成功",
  "data": {
    "id": "treehole-uuid",
    "content": "今天工作好累...",
    "mood": "sad",
    "likes": 0,
    "comments": 0,
    "createdAt": "2025-01-09T16:00:00Z"
  }
}
```

#### 5.2 获取树洞列表
```typescript
GET /api/treehole/public?skip=0&take=20&mood=sad&sort=new
Authorization: Bearer <token>

// 响应 200
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "treehole-uuid",
        "user": {
          "id": "user-uuid",
          "nickname": "匿名用户",
          "avatar": "anonymous-avatar"
        },
        "content": "今天工作好累...",
        "mood": "sad",
        "likes": 45,
        "comments": 12,
        "isLiked": false,
        "createdAt": "2025-01-09T16:00:00Z"
      }
    ],
    "pagination": {
      "skip": 0,
      "take": 20,
      "total": 234,
      "hasMore": true
    }
  }
}
```

#### 5.3 点赞树洞
```typescript
POST /api/treehole/like/:treeholeId
Authorization: Bearer <token>

// 响应 200
{
  "code": 200,
  "message": "点赞成功",
  "data": {
    "likes": 46,
    "isLiked": true
  }
}
```

### 六、缘分匹配模块 (Dating)

#### 6.1 获取匹配推荐
```typescript
POST /api/dating/matches/:userId
Authorization: Bearer <token>
Content-Type: application/json

// 请求体
{
  "limit": 10,
  "filters": {
    "zodiac": ["狮子座", "射手座"],
    "gender": "female"
  }
}

// 响应 200
{
  "code": 200,
  "data": {
    "matches": [
      {
        "user": {
          "id": "user-uuid",
          "nickname": "小红",
          "avatar": "avatar-url",
          "zodiacSign": "巨蟹座",
          "bio": "喜欢旅行和美食"
        },
        "scores": {
          "total": 92,
          "zodiac": 95,
          "element": 90,
          "personality": 88
        },
        "analysis": {
          "summary": "非常匹配，性格互补",
          "suggestion": "可以尝试深入了解"
        }
      }
    ],
    "statistics": {
      "total": 156,
      "today": 5
    }
  }
}
```

#### 6.2 发送消息
```typescript
POST /api/dating/message
Authorization: Bearer <token>
Content-Type: application/json

// 请求体
{
  "receiverId": "user-uuid",
  "content": "你好，很高兴认识你！"
}

// 响应 201
{
  "code": 201,
  "message": "发送成功",
  "data": {
    "id": "message-uuid",
    "content": "你好，很高兴认识你！",
    "createdAt": "2025-01-09T17:00:00Z"
  }
}
```

#### 6.3 获取聊天记录
```typescript
GET /api/dating/messages/:userId/:otherUserId?skip=0&take=20
Authorization: Bearer <token>

// 响应 200
{
  "code": 200,
  "data": {
    "messages": [
      {
        "id": "message-uuid",
        "sender": {
          "id": "user-uuid",
          "nickname": "小明"
        },
        "receiver": {
          "id": "user-uuid",
          "nickname": "小红"
        },
        "content": "你好，很高兴认识你！",
        "isRead": true,
        "createdAt": "2025-01-09T17:00:00Z"
      }
    ],
    "pagination": {
      "skip": 0,
      "take": 20,
      "total": 45,
      "hasMore": true
    }
  }
}
```

### 七、用户模块 (User)

#### 7.1 获取用户信息
```typescript
GET /api/user/:userId
Authorization: Bearer <token>

// 响应 200
{
  "code": 200,
  "data": {
    "id": "user-uuid",
    "nickname": "星辰",
    "avatar": "avatar-url",
    "bio": "热爱生活的占卜爱好者",
    "gender": "female",
    "zodiacSign": "狮子座",
    "fiveElements": { "wood": 2, "fire": 3, "earth": 1, "metal": 1, "water": 1 },
    "lunarDate": "乙亥年 七月初一",
    "stats": {
      "prayerCount": 12,
      "confessionCount": 3,
      "treeholeCount": 8,
      "matchCount": 5
    },
    "createdAt": "2025-01-01T10:00:00Z"
  }
}
```

#### 7.2 更新用户信息
```typescript
PUT /api/user/:userId
Authorization: Bearer <token>
Content-Type: application/json

// 请求体
{
  "nickname": "新的昵称",
  "bio": "新的简介",
  "avatar": "新的头像URL"
}

// 响应 200
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "nickname": "新的昵称",
    "bio": "新的简介",
    "avatar": "新的头像URL"
  }
}
```

## 🗄️ 数据库优化方案

### 一、索引优化

#### 1.1 用户表索引
```sql
-- 基本索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_created ON users(createdAt DESC);

-- 业务索引
CREATE INDEX idx_users_zodiac ON users(zodiacSign);
CREATE INDEX idx_users_gender ON users(gender);

-- 复合索引 (用于匹配查询)
CREATE INDEX idx_users_zodiac_gender ON users(zodiacSign, gender);
CREATE INDEX idx_users_birth ON users(birthYear, birthMonth, birthDay);

-- 全文搜索索引 (昵称搜索)
CREATE INDEX idx_users_nickname_trgm ON users USING gin(nickname gin_trgm_ops);
```

#### 1.2 祈愿表索引
```sql
-- 基本索引
CREATE INDEX idx_prayers_user ON prayers(userId);
CREATE INDEX idx_prayers_created ON prayers(createdAt DESC);

-- 热门祈愿查询
CREATE INDEX idx_prayers_count ON prayers(prayerCount DESC, createdAt DESC);

-- 状态索引
CREATE INDEX idx_prayers_status ON prayers(status, createdAt DESC)
WHERE status = 'active';

-- 复合索引 (用户个人祈愿)
CREATE INDEX idx_prayers_user_status ON prayers(userId, status, createdAt DESC);
```

#### 1.3 表白表索引
```sql
-- 基本索引
CREATE INDEX idx_confessions_user ON confessions(userId);
CREATE INDEX idx_confessions_created ON confessions(createdAt DESC);

-- 匹配相关索引
CREATE INDEX idx_confessions_match ON confessions(isMatched, matchedWith);
CREATE INDEX idx_confessions_target ON confessions(targetName);

-- 匿名查询
CREATE INDEX idx_confessions_anonymous ON confessions(isAnonymous, createdAt DESC)
WHERE isAnonymous = true;
```

#### 1.4 树洞表索引
```sql
-- 基本索引
CREATE INDEX idx_treeholes_user ON treeholes(userId);
CREATE INDEX idx_treeholes_created ON treeholes(createdAt DESC);

-- 互动排序
CREATE INDEX idx_treeholes_likes ON treeholes(likes DESC, createdAt DESC);
CREATE INDEX idx_treeholes_comments ON treeholes(comments DESC, createdAt DESC);

-- 情绪分类
CREATE INDEX idx_treeholes_mood ON treeholes(mood, createdAt DESC);

-- 复合索引 (热门查询)
CREATE INDEX idx_treeholes_hot ON treeholes(likes DESC, comments DESC, createdAt DESC);
```

#### 1.5 消息表索引
```sql
-- 聊天查询
CREATE INDEX idx_messages_conversation ON messages(senderId, receiverId, createdAt DESC);
CREATE INDEX idx_messages_receiver ON messages(receiverId, isRead, createdAt DESC);

-- 未读消息查询
CREATE INDEX idx_messages_unread ON messages(receiverId, isRead)
WHERE isRead = false;
```

#### 1.6 匹配表索引
```sql
-- 基本索引
CREATE INDEX idx_matches_user ON matches(userId, score DESC);
CREATE INDEX idx_matches_matched ON matches(matchedId, score DESC);

-- 唯一约束 (防止重复匹配)
CREATE UNIQUE INDEX idx_matches_unique ON matches(userId, matchedId);

-- 高分匹配查询
CREATE INDEX idx_matches_high_score ON matches(userId, score DESC)
WHERE score >= 80;
```

### 二、查询优化

#### 2.1 热门祈愿查询优化
```typescript
// 优化前 (N+1 查询)
const prayers = await prisma.prayer.findMany({
  skip: 0,
  take: 20,
  orderBy: { prayerCount: 'desc' }
});
// 然后循环查询用户信息

// 优化后 (使用 include)
const prayers = await prisma.prayer.findMany({
  skip: 0,
  take: 20,
  where: {
    status: 'active',
    createdAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7天内
    }
  },
  orderBy: [
    { prayerCount: 'desc' },
    { createdAt: 'desc' }
  ],
  include: {
    user: {
      select: {
        id: true,
        nickname: true,
        avatar: true
      }
    }
  }
});
```

#### 2.2 匹配查询优化
```typescript
// 使用原始 SQL 进行复杂匹配计算
const matches = await prisma.$queryRaw`
  SELECT
    u.id,
    u.nickname,
    u.zodiacSign,
    u.fiveElements,
    -- 星座匹配分数
    CASE
      WHEN u.zodiacSign IN (
        SELECT compatible_zodiac
        FROM zodiac_compatibility
        WHERE zodiac = ${user.zodiacSign}
      ) THEN 90
      ELSE 70
    END as zodiac_score,
    -- 五行匹配分数
    CASE
      WHEN ABS(u.fiveElements->>'wood'::int - ${user.fiveElements.wood}) <= 1
        AND ABS(u.fiveElements->>'fire'::int - ${user.fiveElements.fire}) <= 1
      THEN 85
      ELSE 70
    END as element_score
  FROM users u
  WHERE u.id != ${userId}
    AND u.gender != ${user.gender}
  ORDER BY (zodiac_score + element_score) DESC
  LIMIT ${limit}
`;
```

#### 2.3 树洞分页优化
```typescript
// 使用游标分页 (避免深度分页问题)
const cursor = await prisma.treehole.findFirst({
  where: {
    mood: 'sad',
    createdAt: {
      lt: lastCreatedAt // 上一页最后一条的时间
    }
  },
  orderBy: { createdAt: 'desc' }
});

const treeholes = await prisma.treehole.findMany({
  where: {
    mood: 'sad',
    createdAt: {
      lt: lastCreatedAt
    }
  },
  take: 20,
  skip: 1, // 跳过游标
  cursor: {
    id: cursor?.id
  },
  orderBy: { createdAt: 'desc' },
  include: {
    user: {
      select: {
        id: true,
        nickname: true,
        avatar: true
      }
    }
  }
});
```

### 三、缓存策略

#### 3.1 Redis 缓存设计
```typescript
// src/common/cache/redis-cache.service.ts

@Injectable()
export class RedisCacheService {
  constructor(
    private readonly redis: Redis,
    private readonly prisma: PrismaService
  ) {}

  // 用户信息缓存
  async getUserInfo(userId: string): Promise<User | null> {
    const cacheKey = `user:${userId}:info`;

    // 尝试从缓存获取
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 从数据库查询
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (user) {
      // 缓存 1 小时
      await this.redis.setex(cacheKey, 3600, JSON.stringify(user));
    }

    return user;
  }

  // 星盘计算结果缓存
  async getAstrologyResult(userId: string): Promise<any | null> {
    const cacheKey = `astrology:${userId}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 计算并缓存
    const result = await this.calculateAstrology(userId);
    if (result) {
      await this.redis.setex(cacheKey, 86400, JSON.stringify(result)); // 24小时
    }

    return result;
  }

  // 热门内容缓存
  async getHotContent(type: 'prayer' | 'treehole', limit: number = 20): Promise<any[]> {
    const cacheKey = `hot:${type}:${limit}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 数据库查询
    let data;
    if (type === 'prayer') {
      data = await this.prisma.prayer.findMany({
        where: { status: 'active' },
        orderBy: { prayerCount: 'desc' },
        take: limit,
        include: { user: true }
      });
    } else {
      data = await this.prisma.treehole.findMany({
        orderBy: [
          { likes: 'desc' },
          { comments: 'desc' }
        ],
        take: limit,
        include: { user: true }
      });
    }

    // 缓存 10 分钟
    await this.redis.setex(cacheKey, 600, JSON.stringify(data));
    return data;
  }

  // 缓存失效
  async invalidateUserCache(userId: string): Promise<void> {
    const patterns = [
      `user:${userId}:*`,
      `astrology:${userId}`,
      `matches:${userId}`,
      `prayer:user:${userId}`,
      `confession:user:${userId}`,
      `treehole:user:${userId}`
    ];

    for (const pattern of patterns) {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    }
  }
}
```

#### 3.2 缓存穿透防护
```typescript
// src/common/cache/cache-guard.service.ts

@Injectable()
export class CacheGuardService {
  constructor(private readonly redis: Redis) {}

  // 防止缓存穿透 (空值缓存)
  async getWithPenetrationProtection<T>(
    key: string,
    fetchFn: () => Promise<T | null>,
    ttl: number = 3600,
    nullTTL: number = 60 // 空值较短时间
  ): Promise<T | null> {
    const cached = await this.redis.get(key);

    if (cached !== null) {
      if (cached === 'NULL') {
        return null;
      }
      return JSON.parse(cached);
    }

    const data = await fetchFn();

    if (data === null) {
      // 缓存空值，防止穿透
      await this.redis.setex(key, nullTTL, 'NULL');
    } else {
      await this.redis.setex(key, ttl, JSON.stringify(data));
    }

    return data;
  }

  // 防止缓存雪崩 (随机过期时间)
  async setWithRandomTTL(
    key: string,
    value: any,
    baseTTL: number,
    variance: number = 0.2
  ): Promise<void> {
    const randomFactor = 1 + (Math.random() - 0.5) * variance * 2;
    const ttl = Math.floor(baseTTL * randomFactor);
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
}
```

### 四、数据库分表分区

#### 4.1 时间分区 (适用于历史数据)
```sql
-- 树洞表按月分区
CREATE TABLE treehole_2025_01 PARTITION OF treehole
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE treehole_2025_02 PARTITION OF treehole
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- 消息表按月分区
CREATE TABLE messages_2025_01 PARTITION OF messages
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

#### 4.2 分区查询优化
```typescript
// 自动选择分区查询
async getTreeholeByDate(startDate: Date, endDate: Date) {
  const partition = this.getPartitionName(startDate);

  return await this.prisma.$queryRawUnsafe(
    `SELECT * FROM ${partition}
     WHERE createdAt BETWEEN $1 AND $2
     ORDER BY createdAt DESC
     LIMIT 20`,
    startDate, endDate
  );
}

private getPartitionName(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `treehole_${year}_${month}`;
}
```

### 五、读写分离架构

#### 5.1 数据库连接配置
```typescript
// src/common/database/database.module.ts

@Module({
  imports: [
    PrismaModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      ttl: 3600
    })
  ],
  providers: [
    {
      provide: 'READ_PRISMA',
      useFactory: () => {
        return new PrismaService({
          datasources: {
            db: {
              url: process.env.DATABASE_READ_URL // 读库
            }
          }
        });
      }
    },
    {
      provide: 'WRITE_PRISMA',
      useFactory: () => {
        return new PrismaService({
          datasources: {
            db: {
              url: process.env.DATABASE_WRITE_URL // 写库
            }
          }
        });
      }
    }
  ],
  exports: ['READ_PRISMA', 'WRITE_PRISMA']
})
export class DatabaseModule {}
```

#### 5.2 服务层分离
```typescript
// src/modules/treehole/treehole.service.ts

@Injectable()
export class TreeholeService {
  constructor(
    @Inject('READ_PRISMA') private readonly readPrisma: PrismaService,
    @Inject('WRITE_PRISMA') private readonly writePrisma: PrismaService,
    private readonly cache: RedisCacheService
  ) {}

  // 读操作 (从库 + 缓存)
  async getTreeholes(skip: number = 0, take: number = 20) {
    const cacheKey = `treehole:list:${skip}:${take}`;

    return await this.cache.getWithPenetrationProtection(
      cacheKey,
      async () => {
        return await this.readPrisma.treehole.findMany({
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: { user: true }
        });
      }
    );
  }

  // 写操作 (主库 + 缓存失效)
  async createTreehole(userId: string, data: any) {
    const result = await this.writePrisma.treehole.create({
      data: {
        ...data,
        userId
      }
    });

    // 失效相关缓存
    await this.cache.invalidateTreeholeCache(userId);

    return result;
  }
}
```

### 六、性能监控

#### 6.1 查询性能监控
```typescript
// src/common/interceptors/performance.interceptor.ts

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Performance');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;

        if (duration > 1000) {
          this.logger.warn(
            `Slow Query: ${method} ${url} - ${duration}ms`
          );
        }

        // 记录到监控系统
        this.recordMetrics(method, url, duration);
      })
    );
  }

  private recordMetrics(method: string, url: string, duration: number) {
    // 发送到 Prometheus / Grafana 等监控系统
    // metrics.histogram('api_duration', duration, { method, url });
  }
}
```

#### 6.2 数据库慢查询日志
```sql
-- PostgreSQL 慢查询配置
ALTER DATABASE stardust SET log_min_duration_statement = 1000; -- 1秒以上记录
ALTER DATABASE stardust SET log_statement = 'all'; -- 记录所有查询

-- 查看慢查询
SELECT
  query,
  mean_exec_time,
  calls,
  total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 七、数据库备份与恢复

#### 7.1 自动备份脚本
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/postgresql"
FILENAME="stardust_${DATE}.sql"

# 创建备份
pg_dump -h localhost -U stardust_user -d stardust > ${BACKUP_DIR}/${FILENAME}

# 压缩
gzip ${BACKUP_DIR}/${FILENAME}

# 保留最近7天的备份
find ${BACKUP_DIR} -name "stardust_*.sql.gz" -mtime +7 -delete

# 上传到云存储 (可选)
aws s3 cp ${BACKUP_DIR}/${FILENAME}.gz s3://your-bucket/backups/
```

#### 7.2 备份恢复
```bash
# 恢复数据库
gunzip -c stardust_20250109_120000.sql.gz | psql -h localhost -U stardust_user -d stardust
```

---

## 总结

这套后端优化方案包含：

✅ **API 设计**: 完整的 RESTful 接口规范
✅ **索引优化**: 针对业务场景的索引设计
✅ **查询优化**: 避免 N+1，使用游标分页
✅ **缓存策略**: Redis 多层缓存 + 防护机制
✅ **分表分区**: 时间分区策略
✅ **读写分离**: 提升并发性能
✅ **监控告警**: 性能监控和慢查询追踪

这套方案可以确保系统在高并发下依然保持优秀的性能表现。
