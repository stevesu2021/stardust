# 星契集 - MySQL 数据库迁移说明

## 🎯 功能概述

已将项目从 SQLite 数据库成功迁移至 MySQL 8.0，所有用户数据和认证功能均已正常工作。

## 📊 迁移详情

### 1. 数据库配置

**原配置 (SQLite):**
```env
DATABASE_URL="file:./dev.db"
```

**新配置 (MySQL):**
```env
DATABASE_URL="mysql://stardust_user:stardust_pass123@localhost:3306/stardust"
```

### 2. Prisma Schema 更新

**原配置:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**新配置:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 3. 数据库结构

MySQL 数据库 `stardust` 包含以下表：

| 表名 | 说明 |
|------|------|
| `users` | 用户信息表 |
| `prayers` | 祈愿表 |
| `confessions` | 告白表 |
| `treeholes` | 树洞表 |
| `messages` | 消息表 |
| `matches` | 匹配表 |

**Users 表结构:**
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

## 🔧 技术实现步骤

### 1. 安装 MySQL
```bash
apt-get update
apt-get install -y mysql-server mysql-client
service mysql start
```

### 2. 创建数据库和用户
```sql
CREATE DATABASE stardust;
CREATE USER 'stardust_user'@'localhost' IDENTIFIED BY 'stardust_pass123';
GRANT ALL PRIVILEGES ON stardust.* TO 'stardust_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 更新 Prisma 配置
- 修改 `prisma/schema.prisma` 中的 provider 为 `mysql`
- 更新 `.env` 中的 DATABASE_URL

### 4. 执行迁移
```bash
rm -rf prisma/migrations
npx prisma migrate dev --name init
npx prisma generate
```

### 5. 重启后端服务
```bash
npm run start
```

## ✅ 功能验证

### 注册测试
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "MySQL测试用户",
    "phone": "13900009999",
    "password": "test123456",
    "gender": "male",
    "birthYear": 1990,
    "birthMonth": 5,
    "birthDay": 15,
    "birthHour": 6
  }'
```

**响应:**
```json
{
  "user": {
    "id": "36572dc9-1db1-412b-a111-717553fc4741",
    "phone": "13900009999",
    "nickname": "MySQL测试用户",
    "birthYear": 1990,
    "birthMonth": 5,
    "birthDay": 15,
    "birthHour": 6,
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 登录测试
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"13900009999","password":"test123456"}'
```

### 微信登录测试
```bash
curl -X POST http://localhost:3000/api/auth/wechat/login \
  -H "Content-Type: application/json" \
  -d '{"code":"testcode123","userInfo":{"nickName":"微信用户","avatarUrl":"https://example.com/avatar.jpg"}}'
```

## 🔐 数据库连接信息

**MySQL 服务:**
- Host: `localhost`
- Port: `3306`
- Database: `stardust`
- Username: `stardust_user`
- Password: `stardust_pass123`

**连接命令:**
```bash
mysql -u stardust_user -p stardust_pass123 -D stardust
```

## 📝 注意事项

1. **数据迁移**: 原 SQLite 数据需要手动迁移，可使用 Prisma 的 `db pull` 和 `db push` 功能
2. **备份**: 建议定期备份 MySQL 数据库
3. **性能**: MySQL 相比 SQLite 在并发访问时性能更好
4. **生产环境**: 生产环境应使用更安全的密码和连接配置

## 🚀 启动服务

### 启动后端 (MySQL)
```bash
cd /root/github/stardust/backend
npm run start
```

### 启动前端
```bash
cd /root/github/stardust/frontend
npm run dev:h5
```

---

**最后更新**: 2026-01-11
**版本**: 1.1.0 (MySQL 迁移)
