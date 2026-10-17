# 星契集 · 「星读」内容中心设计文档

- **日期**：2026-10-17
- **状态**：设计已与产品确认（4 项决策已拍板），待实施计划
- **关联**：复用现有夜观星象设计系统（uni.scss / App.vue 全局工具类 / StardCard / StardButton / SectionTitle / EmptyState / LoadingSkeleton）

---

## 1. 背景与目标

星契集当前是"工具型"产品（星盘/面相手相/运势/祈愿/社交），用户用完即走。本设计新增「星读」内容中心，让用户在工具之外有可停留的阅读体验，培养"每日三件套"（今日运势 → 今日星读 → 每日一签）的回访习惯。

**北极星指标**：内容完读率、人均内容停留时长、次日回访率（以每日一签领取率代理）。

## 2. 已确认的产品决策

| # | 决策点 | 结论 |
|---|---|---|
| 1 | 内容入口形态 | **首页功能宫格加「星读」入口**，不新增 tabBar 项 |
| 2 | 伦理/女权内容路线 | **"女性成长科普"叙事**（自我价值/边界感/心理学科普），不做性别对立议题 |
| 3 | 审核流程 | **简易 admin 接口**（token 鉴权，API 操作，不做完整后台 UI） |
| 4 | 首期内容量级 | **30 篇 AI 种子文（人工审核）+ 日更 3-5 条自动化** |

## 3. 内容支柱与栏目

| 支柱 | 栏目 | type 枚举值 | 频率 | 生产方式 | 联动 |
|---|---|---|---|---|---|
| A 星象历法 | 今日星象、黄历宜忌 | `daily_astro` | 每日 | 天文历法引擎 + AI 润色 | 今日运势页 |
| A 星象历法 | 本周天象、12 星座周运 | `weekly_horoscope` | 每周 | AI 生成 + 人审 | 运势页/恋爱CP |
| B 星座人格 | 星座心理学·12 连载 | `zodiac_deep` | 每周 | AI + 人审 | 星盘解读页 |
| B 星座人格 | 配对实验室 | `pair_lab` | 每周 | AI + 人审 | 恋爱CP 页 |
| C 情感与自我 | 她的星空（女性成长）| `growth` | 每周 2 篇 | AI + 人审（价值观边界 prompt）| 树洞/复合祈愿 |
| C 情感与自我 | 亲密关系课 | `relationship` | 每周 1 篇 | AI + 人审 | 复合祈愿/月老红线 |
| C 情感与自我 | 星星的回信（树洞策展+AI回信）| `curated_ugc` | P2 起启用 | UGC 策展（需授权勾选）| 树洞 |
| D 轻互动 | 每日一签 | `sign`（独立签池表）| 每日领取 | 静态 64 支签池 + 确定性抽取 | 全站引流 |
| D 轻互动 | 名人日历 | `famous_calendar` | P2 起启用 | 复用 `famous_people` 表查询 | 星盘/名人页 |

**30 篇种子文构成**：星座心理学连载 12 + 她的星空 8 + 亲密关系课 5 + 配对实验室 5。

**日更 3-5 条的实现**：每日自动生成 2 条（今日星象、黄历宜忌）+ 深度栏目文章批量生成后按 `publishAt` 排期发布（每日出 1-3 篇）。

## 4. 内容生产：三条生产线

### 4.1 天文历法引擎（全自动，AI 只润色不造事实）
- 农历/节气/黄历宜忌：复用后端已装 `lunar-javascript`（现用于农历生日计算）。
- 行星相位/月相/水逆：采用简化的行星周期表算法（水星逆行窗口预置年表即可满足运营需求，不引入天文重库）。
- 事实数据（日期/节气/相位窗口）由程序计算，豆包模型仅做"占星师人设"的解读润色。

### 4.2 AI 内容工厂
- **写稿**：`XIAOMIMIMO`（doubao-seed-2.1-lite）。每个栏目一套固定人设 prompt 模板（含价值观边界、禁词表、输出 JSON 结构：title/summary/body 块数组）。
- **配图**：`ARK_T2I`（doubao-seedream-5.0-pro）统一生成"夜空鎏金插画风"头图（统一风格 prompt，1024x1024）。
- **流程**：AI 产出 → `draft` → 人工审核 → `published`。日报类（今日星象/黄历）可配置为"AI 全自动发布 + 每周人工抽检"；深度栏目一律人审。
- 图存 MinIO（复用 MinioService），`coverImage` 存公开 URL。

### 4.3 UGC 策展（P2 起）
- 树洞/表白创建页加"同意被精选（匿名脱敏）"勾选。
- 运营经 admin 接口把授权内容生成为 `curated_ugc` 草稿 + AI 回信，人审后发布。

## 5. 数据模型（Prisma 新增）

```prisma
model ContentTopic {
  id        String @id @default(uuid())
  slug      String @unique   // daily-astro / zodiac-deep / growth ...
  name      String
  cover     String?
  sortOrder Int    @default(0)
}

model Content {
  id              String   @id @default(uuid())
  topicId         String
  topic           ContentTopic @relation(fields: [topicId], references: [id])
  type            String   // daily_astro|weekly_horoscope|zodiac_deep|pair_lab|growth|relationship|curated_ugc
  title           String
  summary         String
  coverImage      String?
  body            Json     // [{h:段落标题, p:内容}, ...] 富文本块数组
  tags            Json     // ["水逆","边界感",...]
  zodiacSigns     Json     // ["狮子座"] 为空=全星座适用
  serializeGroupId String? // 连载组
  orderNum        Int      @default(0)   // 连载内序号
  source          String   @default("ai") // ai|manual|ugc
  status          String   @default("draft") // draft|pending|published|rejected
  publishAt       DateTime @default(now())
  viewCount       Int      @default(0)
  finishCount     Int      @default(0)
  likeCount       Int      @default(0)

  @@index([status, publishAt])
  @@index([type, publishAt])
}

model UserContentProgress {
  id        String   @id @default(uuid())
  userId    String
  contentId String
  status    String   // opened | finished
  lastReadAt DateTime @default(now())
  @@unique([userId, contentId])
}

model UserContentLike {
  id        String   @id @default(uuid())
  userId    String
  contentId String
  createdAt DateTime @default(now())
  @@unique([userId, contentId])
}

model UserFeedCursor {
  userId   String   @id
  cursor   String?  // 上次 feed 浏览到的最后一篇 contentId
  updatedAt DateTime @updatedAt
}

model DailySign {
  id             String @id @default(uuid())
  level          Int    // 1上上 ~ 6下下
  title          String
  poem           String // 签诗文
  interpretation String // 解签
  luckyAction    String // 宜
  avoidAction    String // 忌
}

model UserDailySign {
  id       String   @id @default(uuid())
  userId   String   // 未登录用 localStorage 匿名 id
  date     String   // yyyy-MM-dd
  signId   String
  drawnAt  DateTime @default(now())
  @@unique([userId, date])
}
```

## 6. 后端设计（NestJS）

### 6.1 模块结构
```
src/modules/content/
  content.module.ts
  content.service.ts        // feed 查询/排序/进度/点赞/统计
  content.controller.ts    // 公开接口
  content-generation.service.ts // AI 生成管线（prompt 模板 + 两条模型调用）
  content-admin.controller.ts   // admin 接口（x-admin-token 鉴权）
  cron: @nestjs/schedule 注册每日 02:30 生成当日内容
```
新增依赖仅 `@nestjs/schedule`。

### 6.2 公开 API
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/contents/feed?cursor=&topic=&limit=` | 个性化 feed（登录则个性化+去重；游客给通用热门+当日星象）。返回 `items + nextCursor` |
| GET | `/api/contents/:id` | 详情；body 富文本块；底部返回 3 篇相关（同栏目优先） |
| POST | `/api/contents/:id/progress` | `{status: opened|finished}` 上报；finished 时更新完读率并写 UserFeedCursor |
| POST | `/api/contents/:id/like` | 切换点赞（登录用户） |
| GET | `/api/contents/daily` | 今日星读（当日 daily_astro 最新一篇；无则取通用精选） |
| GET | `/api/contents/sign/today` | 每日一签：有记录返回已抽的签；无则 `hash(userId+date) % 64` 定签并落库 |

### 6.3 简易 Admin API（header：`x-admin-token`，值来自环境变量 `ADMIN_TOKEN`）
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/admin/contents?status=&type=&page=` | 列表（审核队列） |
| PUT | `/api/admin/contents/:id` | 修改标题/正文/标签/发布时间 |
| POST | `/api/admin/contents/:id/publish` | 发布（draft/rejected → published） |
| POST | `/api/admin/contents/:id/reject` | 驳回（附 reason 存 body 备注） |
| POST | `/api/admin/contents/generate` | `{type, count, zodiac?, topic?}` 批量生成草稿（写稿+配图） |
| POST | `/api/admin/cron/daily` | 手动触发当日自动管线（等同每日定时任务，便于补跑） |

鉴权用 NestJS Guard 读取 `ADMIN_TOKEN` 比对 header，常量时间比较；未配置 token 时该组接口全部 403（安全默认）。

### 6.4 Feed 排序与去重算法（L1 + L2）
```
候选集 = published 且 publishAt <= now
1) 排除已 finished 的内容（UserContentProgress）
2) opened 未 finished 的内容降权（避免顶置）
3) 基础分 = log(1+likeCount) + 完读率*2 + 新鲜度(72h 内 +1)
4) 加权：用户本命星座命中 zodiacSigns → +3
        当日星象相关标签（如"水逆"且今日在水逆窗口）→ +2
        与上次阅读同栏目的下一篇（连载续读）→ 置顶候选
5) 探索位：每页 20% 名额从"用户近 14 天未接触栏目"随机取
6) 确定性打散：score + jitter，jitter = hash(userId+date+contentId) ∈ [0,1]
   → 同一用户同一天顺序稳定，不同用户/次日自然变化
7) 返回 nextCursor（最后一篇 id），进入页面时若 UserFeedCursor 存在，
   定位到该篇并标金色「继续阅读」角标
```
连载续读：若用户 finished 连载组某篇，feed 优先插入 `orderNum+1` 的下一篇，文案"你想看的更新了"。

### 6.5 每日一签
- 静态签池 64 支（上上 8 / 上 12 / 中上 12 / 中 12 / 中下 10 / 下下 10），一次性 seed 导入（含 AI 生成的签文，人工校对）。
- 抽取：`sha256(userId + ':' + date)` → `% 64`，落 `UserDailySign`（同日重开一致）。
- 未登录：前端生成并持久化 localStorage 匿名 id 参与抽取（登录后不迁移，保持简单）。

## 7. 前端设计（uni-app，沿用夜观星象设计语言）

### 7.1 路由（pages.json 新增）
| 页面 | 路径 | 导航 |
|---|---|---|
| 星读栏目页 | `pages/content/list` | 原生导航「星读」 |
| 阅读页 | `pages/content/detail` | 原生导航（标题动态为文章名） |
| 每日一签 | `pages/content/sign` | custom（抽签动效需要全屏） |

### 7.2 首页改动
- 功能宫格新增第 11 项：`星读`，symbol `❂`，desc `星座·情感·她的星空`，`navigateTo /pages/content/list`。
- 今日运势卡下方新增「今日星读」卡（ContentDailyCard 组件）：seedream 封面图 + 衬线金标题 + 摘要两行 + "阅读全文 ›"。无数据时隐藏整卡（不占位）。

### 7.3 星读栏目页
- 结构：氛围层（nebula+stars）→ 栏目横向 Tab（SectionTitle 风格胶囊：推荐/星象/星座/她的星空/关系）→ 内容卡片流（封面图 + 标题 + 摘要 + 标签 sd-chip + 已读金色角标/连载标记）。
- Feed 无限滚动（cursor 分页）；下拉刷新。
- 「继续阅读」：进入时若 cursor 存在，列表自动滚动定位并高亮该卡。

### 7.4 阅读页
- 「古籍卷轴」气质：氛围层 + 衬线标题 + 金分隔线（sd-divider）+ 正文行高 1.8。
- 阅读完成判定：滚动至底部 80% 上报 finished。
- 文末三区：点赞（ StardButton outline sm ）+ 相关阅读 2 篇 + 返回栏目。
- 页脚固定 disclaimer（见 §8）。

### 7.5 每日一签页
- custom 导航 + 星空全屏；点击"抽签"→ 流星动画（复用 sd-shooting-star 思路）→ 签文卡（StardCard gold + 签级徽章 + 诗文衬线 + 解签/宜/忌 sd-chip）。
- 当日已抽：直接展示已抽结果（后端保障一致）。

## 8. 合规与风险护栏

1. **免责声明**：所有命理类内容页脚固定展示"内容仅供娱乐参考，请理性看待"。
2. **女性内容边界**：仅"成长叙事"（自我价值/边界感/心理科普）；生成 prompt 内置价值观边界与禁词表；一律人工审核。
3. **UGC 授权**：P2 的树洞策展必须用户主动勾选授权 + 强制匿名脱敏，解签/回信不引用可识别信息。
4. **AI 质量**：事实（日期/节气/相位）以程序计算为准；深度栏目 100% 人审；日报类每周抽检 ≥3 篇。

## 9. 分期路线与验收

**P1（MVP，本次实施范围）**
- Prisma 模型迁移 + seed（栏目 + 64 签池 + 30 篇 AI 种子文生成脚本经 admin 生成、人工审核发布）
- content 模块（公开 API + feed L1/L2 + 进度 + 一签）
- admin 接口（token 鉴权）+ @nestjs/schedule 每日管线
- 前端：星读栏目页 + 阅读页 + 一签页 + 首页宫格入口 + 今日星读卡
- 验收标准：
  - 同一用户当天重复打开 feed，顺序一致且无已读内容重现
  - finished 的文章次日不再出现；连载读到第 N 篇次日推第 N+1 篇
  - 一签当日重开结果一致、次日换新
  - admin 全流程：generate→列表→publish 后前台可见
  - H5 构建通过；页面零 emoji；风格符合夜观星象规范（REFACTOR_GUIDE.md）

**P2**：工具页场景化嵌入推荐、名人日历、周运自动化、UGC 授权勾选与「星星的回信」、标签体系完善。

**P3**：L3 行为权重推荐（点击/完读/停留）、专题运营（水逆/节气）。

## 10. 不在本次范围（Out of Scope）
- 不新增 tabBar 项；不做评论系统；不做完整的 admin Web UI（仅 API）；不做推荐算法离线训练/向量召回；L3 权重推荐推迟到 P3。

## 11. 环境变量新增
```
ADMIN_TOKEN=""          # admin 接口令牌，必配
```
（AI 相关沿用现有 XIAOMIMIMO_* 与 ARK_T2I_* 配置，无新增。）
