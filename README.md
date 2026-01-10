# Stardust - 多端部署系统

一套支持网站、Android App、iPhone App、微信小程序、抖音小程序等多种方式部署的系统。

## 技术栈

### 前端
- **框架**: Uni-app (Vue 3 + TypeScript)
- **UI组件**: uView UI
- **状态管理**: Pinia

### 后端
- **框架**: Node.js + Nest.js (TypeScript)
- **ORM**: Prisma
- **数据库**: PostgreSQL + Redis
- **认证**: JWT + Passport

## 功能特性

1. **阳历转农历**: 自动获取农历日期
2. **星座计算**: 根据出生日期计算星座
3. **五行分析**: 基于八字计算五行
4. **复合祈愿**: 失恋后祈祷求复合功能
5. **月老红线**: 暗恋告知月老功能
6. **树洞**: 匿名心情分享
7. **交友**: 基于星座五行的交友匹配

## 快速开始

### 安装依赖
```bash
npm run install:all
```

### 开发模式
```bash
npm run dev
```

### 构建
```bash
npm run build
```

## 项目结构

```
stardust/
├── frontend/          # Uni-app 前端项目
├── backend/           # Nest.js 后端项目
├── docs/              # 项目文档
└── package.json       # 根目录配置
```

## 部署

### 前端部署
- Web: Nginx + CDN
- App: 应用商店发布
- 小程序: 各平台审核发布

### 后端部署
- Docker + Nginx
- 云服务器部署

## 许可证

MIT