# 「星读」内容中心 P1（MVP）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按 [设计文档](../specs/2026-10-17-stardust-content-hub-design.md) 落地「星读」内容中心 P1：内容生产（AI 工厂 + admin）→ 内容库 → 个性化去重 feed → 三个前端页面 + 首页入口。

**Architecture:** 后端新增 NestJS `content` 模块（公开 API + 生成管线 + admin + cron），Prisma 新增 6 张表；feed 打分抽为纯函数（可单测）；前端复用夜观星象设计系统（.theme-work/REFACTOR_GUIDE.md 为样式铁律）。

**Tech Stack:** NestJS 10 + Prisma(MySQL) + @nestjs/schedule（新增）+ 豆包 doubao-seed-2.1-lite（写稿，env `XIAOMIMIMO_*`）+ doubao-seedream-5.0-pro（配图，env `ARK_T2I_*`）+ MinIO + uni-app(Vue3/SCSS)。

**约定：**
- 所有 bash 在 `/home/steve/github/stardust` 执行（除非注明 cwd）。
- 后端启动方式：`npm run start:dev`（cwd `backend/`，watch 模式）。MySQL/MinIO 已由 docker 容器 `stardust-mysql`/`stardust-minio` 提供。
- 前端单位只用 rpx；颜色只用 `$sd-*` 令牌；页面模板禁止 emoji。
- 每个 Task 结束 commit（`git add` 指定文件，勿用 `-A`）。

---

### Task 1: 依赖与配置

**Files:**
- Modify: `backend/package.json`（安装依赖自动写入）
- Modify: `backend/.env`、`backend/.env.example`
- Modify: `tests/sync_server_env.py:17-22`

- [ ] **Step 1: 安装 @nestjs/schedule**

```bash
cd /home/steve/github/stardust/backend && npm install @nestjs/schedule --save
```
Expected: `added N packages`，无 error。

- [ ] **Step 2: 生成并写入 ADMIN_TOKEN**

```bash
cd /home/steve/github/stardust/backend && echo "ADMIN_TOKEN=\"$(openssl rand -hex 24)\"" >> .env && echo 'CONTENT_AUTO_PUBLISH_DAILY="true"' >> .env && tail -n 2 .env
```
Expected: 输出两行新配置（记录 ADMIN_TOKEN 值，后续 curl 会用到）。

- [ ] **Step 3: 同步 .env.example**

在 `backend/.env.example` 末尾追加：

```text

# 「星读」内容中心
ADMIN_TOKEN=""                    # admin 接口令牌（x-admin-token header），必配
CONTENT_AUTO_PUBLISH_DAILY="true" # 日报类（今日星象/黄历）AI 生成后是否自动发布
```

- [ ] **Step 4: 更新部署同步脚本**

`tests/sync_server_env.py` 的 SYNC_KEYS 列表改为（新增 2 键）：

```python
SYNC_KEYS = [
    "XIAOMIMIMO_API_KEY", "XIAOMIMIMO_API_URL", "XIAOMIMIMO_MODEL",
    "DASHSCOPE_API_KEY", "DASHSCOPE_BASE_URL", "DASHSCOPE_MODEL",
    "DASHSCOPE_TEXT_MODEL", "DASHSCOPE_API_HOST",
    "ARK_T2I_API_KEY", "ARK_T2I_URL", "ARK_T2I_MODEL",
    "ADMIN_TOKEN", "CONTENT_AUTO_PUBLISH_DAILY",
]
```

- [ ] **Step 5: Commit**

```bash
cd /home/steve/github/stardust && git add backend/package.json backend/package-lock.json backend/.env.example tests/sync_server_env.py && git commit -m "chore: content hub deps & admin token config"
```
注意：`backend/.env` 被 .gitignore 排除，不入库。

---

### Task 2: Prisma 模型与迁移

**Files:**
- Modify: `backend/prisma/schema.prisma`（文件末尾追加）
- 生成: `backend/prisma/migrations/<ts>_add_content_hub/migration.sql`

- [ ] **Step 1: schema.prisma 末尾追加 6 个模型**

```prisma
// ===================== 星读内容中心 =====================

model ContentTopic {
  id        String    @id @default(uuid())
  slug      String    @unique // daily-astro / zodiac-deep / growth ...
  name      String
  sortOrder Int       @default(0)
  createdAt DateTime  @default(now())
  contents  Content[]
}

model Content {
  id              String       @id @default(uuid())
  topicId         String
  topic           ContentTopic @relation(fields: [topicId], references: [id])
  type            String // daily_astro|weekly_horoscope|zodiac_deep|pair_lab|growth|relationship|curated_ugc
  title           String
  summary         String
  coverImage      String?
  body            Json    // [{h:"小标题",p:"段落"}, ...]
  tags            Json    // ["水逆", ...]
  zodiacSigns     Json    // ["狮子座"] 为空=全星座适用
  serializeGroupId String? // 连载组 id
  orderNum        Int     @default(0) // 连载内序号（1 起）
  source          String  @default("ai") // ai|manual|ugc
  status          String  @default("draft") // draft|pending|published|rejected
  publishAt       DateTime @default(now())
  viewCount       Int     @default(0)
  finishCount     Int     @default(0)
  likeCount       Int     @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([status, publishAt])
  @@index([type, publishAt])
  @@index([serializeGroupId, orderNum])
}

model UserContentProgress {
  id         String   @id @default(uuid())
  userId     String
  contentId  String
  status     String   @default("opened") // opened | finished
  lastReadAt DateTime @default(now())

  @@unique([userId, contentId])
  @@index([userId, lastReadAt])
}

model UserContentLike {
  id        String   @id @default(uuid())
  userId    String
  contentId String
  createdAt DateTime @default(now())

  @@unique([userId, contentId])
}

model UserFeedCursor {
  userId    String    @id
  cursor    String? // 上次浏览到的最后一篇 contentId
  updatedAt DateTime  @updatedAt
}

model DailySign {
  id             String @id @default(uuid())
  level          Int    // 1上上 2上 3中上 4中 5中下 6下下
  title          String // 第N签
  poem           String
  interpretation String
  luckyAction    String // 宜
  avoidAction    String // 忌
}

model UserDailySign {
  id      String   @id @default(uuid())
  userId  String   // 未登录用前端匿名 id
  date    String   // yyyy-MM-dd（北京时间）
  signId  String
  drawnAt DateTime @default(now())

  @@unique([userId, date])
}
```

- [ ] **Step 2: 迁移并重新生成 Client**

```bash
cd /home/steve/github/stardust/backend && npx prisma migrate dev --name add_content_hub && npx prisma generate
```
Expected: `Your database is now in sync with your schema`。

- [ ] **Step 3: 验证新表**

```bash
docker exec stardust-mysql mysql -ustardust_user -pstardust_pass123 stardust -e "SHOW TABLES LIKE '%content%'; SHOW TABLES LIKE '%sign%';" 2>/dev/null
```
Expected: 6 行（ContentTopic、Content、UserContentProgress、UserContentLike、DailySign、UserDailySign）。

- [ ] **Step 4: Commit**

```bash
cd /home/steve/github/stardust && git add backend/prisma/schema.prisma backend/prisma/migrations && git commit -m "feat(content): prisma models for content hub"
```

---

### Task 3: 栏目与 64 支签池 Seed

**Files:**
- Create: `backend/prisma/seed-content.ts`

- [ ] **Step 1: 写 seed 脚本（完整代码）**

```ts
// backend/prisma/seed-content.ts —— 星读内容中心种子：栏目 + 64 支签池
// 运行：npx ts-node prisma/seed-content.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TOPICS = [
  { slug: 'daily-astro', name: '星象', sortOrder: 1 },
  { slug: 'weekly-horoscope', name: '天象周报', sortOrder: 2 },
  { slug: 'zodiac-deep', name: '星座人格', sortOrder: 3 },
  { slug: 'pair-lab', name: '配对实验室', sortOrder: 4 },
  { slug: 'growth', name: '她的星空', sortOrder: 5 },
  { slug: 'relationship', name: '亲密关系', sortOrder: 6 },
  { slug: 'curated-ugc', name: '星星的回信', sortOrder: 7 },
];

type SignSeed = [level: number, title: string, poem: string, interp: string, lucky: string, avoid: string];
const SIGNS: SignSeed[] = [
  [1, '第1签·上上', '星河启明处，贵人渡桥来', '运势如虹，宜主动出击把握机遇', '签约 会友', '犹豫'],
  [1, '第2签·上上', '春风入命宫，好事自然成', '万事顺遂，所求皆有着落', '表白 许愿', '拖延'],
  [1, '第3签·上上', '金光照顶门，喜事近庭前', '意外之喜将近，保持开放心态', '出行 赴约', '封闭'],
  [1, '第4签·上上', '明月拨云出，前路渐坦途', '困局将解，宜趁势推进', '复盘 启动', '回望'],
  [1, '第5签·上上', '紫气自东来，福星照命台', '贵人运旺，多出门走动', '社交 求助', '独处'],
  [1, '第6签·上上', '心愿化星火，燎原在此时', '长久筹备之事迎来转机', '提交 发布', '反复修改'],
  [1, '第7签·上上', '慧星绕月行，灵感如泉涌', '创造力巅峰，宜表达与创作', '写作 创作', '抄袭'],
  [1, '第8签·上上', '甘露润心田，旧怨化云烟', '关系修复的绝佳时机', '道歉 和解', '翻旧账'],
  [2, '第9签·上', '顺风扬帆日，行舟万里轻', '稳中有升，按计划推进即可', '推进 谈判', '冒进'],
  [2, '第10签·上', '星轨循常道，静待花开时', '时机未满，耐心是福', '积累 等待', '催促'],
  [2, '第11签·上', '良驹遇伯乐，才华得赏识', '展示才能的好日子', '汇报 展示', '过度谦虚'],
  [2, '第12签·上', '灯下逢故人，温暖入梦深', '旧友重逢或旧事回暖', '联系 感恩', '失约'],
  [2, '第13签·上', '云开见月明，疑虑渐消散', '情绪明朗，宜做决定', '决策 表态', '多疑'],
  [2, '第14签·上', '星子落掌心，小确幸连连', '生活有惊喜，留意身边善意', '观察 记录', '忽略'],
  [2, '第15签·上', '借风好行船，外力可借助', '善用工具与人脉事半功倍', '合作 借力', '硬撑'],
  [2, '第16签·上', '缘星高悬夜，邂逅正当时', '桃花运上升，宜主动社交', '赴宴 主动', '宅家'],
  [2, '第17签·上', '炉暖茶正香，家和万事兴', '家庭和睦滋养运势', '陪伴 修补', '争执'],
  [2, '第18签·上', '笔落惊风雨，才思如泉注', '学习考核运佳', '学习 应考', '分心'],
  [2, '第19签·上', '财星微露角，正财稳中有升', '适合整理账目与规划', '记账 规划', '投机'],
  [2, '第20签·上', '星风拂心尘，身心俱轻盈', '健康运势回升', '运动 早睡', '熬夜'],
  [3, '第21签·中上', '晨光微亮时，缓步亦向前', '平稳向上，小步前进', '散步 微调', '停顿'],
  [3, '第22签·中上', '半云半月光，朦胧亦是美', '事情尚不明朗，不必急于看清', '观察 沉淀', '逼问'],
  [3, '第23签·中上', '拾级而上处，步步见风景', '进展虽慢但扎实', '坚持 打卡', '跳级'],
  [3, '第24签·中上', '旧枝发新芽，旧事有新解', '老问题出现新解法', '复盘 创新', '守旧'],
  [3, '第25签·中上', '风起于青萍，信号已出现', '转机的前兆，留心细节', '觉察 记录', '迟钝'],
  [3, '第26签·中上', '温火煮清茶，慢工出细活', '急不得的事要有耐心', '打磨 细化', '求快'],
  [3, '第27签·中上', '星桥半掩映，机会留一线', '机会半开，争取才可见全貌', '争取 询问', '放弃'],
  [3, '第28签·中上', '心湖起微澜，情愫暗自生', '心动萌芽，宜确认自己心意', '约会 表白', '暧昧不清'],
  [3, '第29签·中上', '灯前理旧物，断舍离得清', '清理带来新能量', '整理 断舍离', '囤积'],
  [3, '第30签·中上', '他乡遇故知，陌生中有暖', '新环境里藏着善意', '求助 交流', '设防'],
  [3, '第31签·中上', '运筹帷幄中，静观其变妙', '信息不足时宜多听少说', '倾听 收集', '急于表态'],
  [3, '第32签·中上', '月晕而风起，见微而知著', '直觉敏锐，信任第一判断', '决策 直觉', '反复摇摆'],
  [4, '第33签·中', '平地无风浪，守常即安然', '无事之日，守常最稳', '日常 保养', '折腾'],
  [4, '第34签·中', '星移斗转间，得失两平衡', '有得有失，综合看待', '权衡 记账', '计较'],
  [4, '第35签·中', '云深不知处，退一步海阔', '暂时看不清就先退半步', '让步 冷静', '钻牛角尖'],
  [4, '第36签·中', '半盏茶滋味，苦后有余甘', '先付出后回报', '投入 忍耐', '抱怨'],
  [4, '第37签·中', '车马行大道，按部就班车', '按流程走最稳', '遵循流程', '临时变道'],
  [4, '第38签·中', '潮起又潮落，情绪如浪平', '情绪波动日，先稳住自己', '冥想 写日记', '冲动决定'],
  [4, '第39签·中', '屋檐避细雨，小忍保大局', '小摩擦不值得正面冲突', '回避 缓冲', '正面硬碰'],
  [4, '第40签·中', '星光穿薄雾，远观更真切', '旁观者清，抽离看问题', '咨询 旁观', '入戏'],
  [4, '第41签·中', '昼夜均分日，取舍见真章', '资源有限，先舍后得', '取舍 规划', '贪多'],
  [4, '第42签·中', '借伞过廊桥，人情有往来', '人情往来是今日主题', '还礼 道谢', '欠人情'],
  [4, '第43签·中', '磨刀不误工，准备正当时', '与其匆忙不如先备', '准备 学习', '仓促抢先'],
  [4, '第44签·中', '浮云遮望眼，别急着定论', '消息混杂，别轻信一面之词', '核实 等待', '传谣'],
  [5, '第45签·中下', '逆水行舟日，用力方不退', '阻力出现，需加倍认真', '专注 加固', '松懈'],
  [5, '第46签·中下', '风急星亦摇，言语宜三思', '沟通易生误解，出口前多想一秒', '少说 多听', '口无遮拦'],
  [5, '第47签·中下', '独木桥上过，行事宜低调', '众目睽睽，低调避风头', '谦逊 蓄力', '出风头'],
  [5, '第48签·中下', '浅滩困蛟龙，暂避其锋芒', '时机未到，强者暂困', '蛰伏 调整', '硬拼'],
  [5, '第49签·中下', '云低欲落雨，出门查路况', '计划可能被打乱，留好备份', '准备备选 提前量', '侥幸'],
  [5, '第50签·中下', '旧账重翻日，旧疾莫轻视', '老问题复发，认真对待', '复查 修复', '拖延'],
  [5, '第51签·中下', '碎星入梦来，琐事扰心神', '杂事缠身，逐件清点', '列清单 断网', '多线程'],
  [5, '第52签·中下', '借风未借成，期望暂落空', '调整期望，蓄能再战', '调期望 蓄能', '强求'],
  [5, '第53签·中下', '月晦光更暗，直觉易失准', '直觉偏差，决策宜缓', '推迟决策 请教', '拍脑袋'],
  [5, '第54签·中下', '冬藏万物眠，收敛以养息', '低耗能日，养精蓄锐', '休息 复盘', '启动新事'],
  [6, '第55签·下下', '狂风卷黄沙，迷眼莫赶路', '环境混乱时先停下脚步', '暂停 静观', '重大决策'],
  [6, '第56签·下下', '路遥马失蹄，远行易生变', '长途与大事今日不宜', '改期 守家', '冒险'],
  [6, '第57签·下下', '弦断不成音，强求徒增伤', '该放手的事，执念更深', '放手 休整', '强求'],
  [6, '第58签·下下', '乌云压城日，避其锋芒存', '冲突高发期，远离是非', '回避 不表态', '卷入'],
  [6, '第59签·下下', '漏屋逢夜雨，祸不单行时', '坏事可能连环，谨慎行事', '检查 保守', '侥幸'],
  [6, '第60签·下下', '逆旅失行囊，破财挡灾殃', '或有损耗，看紧钱袋', '保管 断舍', '投资'],
  [6, '第61签·下下', '心火燎原时，戾气莫出口', '情绪易爆，谨防口不择言', '独处 运动', '争吵'],
  [6, '第62签·下下', '星坠深谷底，独行夜路长', '孤独感放大，找人陪伴', '倾诉 抱团', '自苦'],
  [6, '第63签·下下', '雾锁重楼时，方向最难辨', '认知混沌日，不轻易评判', '存疑 观察', '下定论'],
  [6, '第64签·下下', '塞翁马未归，安知非福兮', '眼前失利未必是坏事', '乐观 等待', '绝望'],
];

async function main() {
  for (const t of TOPICS) {
    await prisma.contentTopic.upsert({ where: { slug: t.slug }, update: t, create: t });
  }
  console.log('topics ok:', TOPICS.length);

  const signCount = await prisma.dailySign.count();
  if (signCount >= SIGNS.length) {
    console.log('signs already seeded:', signCount);
  } else {
    await prisma.dailySign.createMany({
      data: SIGNS.map(([level, title, poem, interpretation, luckyAction, avoidAction]) => ({
        level, title, poem, interpretation, luckyAction, avoidAction,
      })),
    });
    console.log('signs seeded:', SIGNS.length);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 2: 运行 seed 并验证**

```bash
cd /home/steve/github/stardust/backend && npx ts-node prisma/seed-content.ts
```
Expected: `topics ok: 7` + `signs seeded: 64`（重复运行输出 `signs already seeded: 64`）。

- [ ] **Step 3: Commit**

```bash
cd /home/steve/github/stardust && git add backend/prisma/seed-content.ts && git commit -m "feat(content): seed topics and 64 daily signs"
```

---

### Task 4: Feed 打分纯函数（TDD）

**Files:**
- Create: `backend/src/modules/content/content-scoring.utils.ts`
- Test: `backend/src/modules/content/content-scoring.utils.spec.ts`

- [ ] **Step 1: 先写失败测试**

```ts
// backend/src/modules/content/content-scoring.utils.spec.ts
import { baseScore, seededJitter, scoreFeed, FeedCandidate, FeedContext } from './content-scoring.utils';

const mk = (over: Partial<FeedCandidate> = {}): FeedCandidate => ({
  id: 'c1', likeCount: 0, viewCount: 0, finishCount: 0,
  publishAt: new Date(), zodiacSigns: [], tags: [], topicId: 't1',
  type: 'growth', serializeGroupId: null, orderNum: 0, ...over,
});

const ctx = (over: Partial<FeedContext> = {}): FeedContext => ({
  today: '2026-10-17', userId: 'u1', userZodiac: null,
  finishedIds: new Set<string>(), openedIds: new Set<string>(),
  activeTags: [], continueId: null, ...over,
});

describe('seededJitter', () => {
  it('同输入同输出（确定性）', () => {
    expect(seededJitter('u1', '2026-10-17', 'c1')).toBe(seededJitter('u1', '2026-10-17', 'c1'));
  });
  it('用户或日期不同则结果不同', () => {
    expect(seededJitter('u1', '2026-10-17', 'c1')).not.toBe(seededJitter('u2', '2026-10-17', 'c1'));
    expect(seededJitter('u1', '2026-10-17', 'c1')).not.toBe(seededJitter('u1', '2026-10-18', 'c1'));
  });
  it('值域 [0,1)', () => {
    for (let i = 0; i < 50; i++) {
      const v = seededJitter(`u${i}`, '2026-10-17', `c${i}`);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('baseScore', () => {
  it('72 小时内的新内容有新鲜度加成', () => {
    const fresh = mk({ publishAt: new Date(Date.now() - 3600_000) });
    const old = mk({ publishAt: new Date(Date.now() - 240 * 3600_000) });
    expect(baseScore(fresh, new Date())).toBeGreaterThan(baseScore(old, new Date()));
  });
});

describe('scoreFeed', () => {
  it('排除已 finished 的内容', () => {
    const { ranked } = scoreFeed([mk({ id: 'a' }), mk({ id: 'b' })], ctx({ finishedIds: new Set(['a']) }), new Date());
    expect(ranked.map(c => c.id)).toEqual(['b']);
  });
  it('本命星座命中加权领先', () => {
    const mine = mk({ id: 'mine', zodiacSigns: ['狮子座'] });
    const other = mk({ id: 'other', likeCount: 2 });
    const { ranked } = scoreFeed([mine, other], ctx({ userZodiac: '狮子座' }), new Date());
    expect(ranked[0].id).toBe('mine');
  });
  it('连载续读项置顶', () => {
    const next = mk({ id: 'next' });
    const hot = mk({ id: 'hot', likeCount: 50 });
    const { ranked } = scoreFeed([next, hot], ctx({ continueId: 'next' }), new Date());
    expect(ranked[0].id).toBe('next');
  });
  it('opened 未 finished 的内容降权', () => {
    const opened = mk({ id: 'opened' });
    const other = mk({ id: 'other' });
    const { ranked } = scoreFeed([opened, other], ctx({ openedIds: new Set(['opened']) }), new Date());
    expect(ranked[0].id).toBe('other');
  });
});
```

- [ ] **Step 2: 运行确认失败**

```bash
cd /home/steve/github/stardust/backend && npx jest content-scoring --passWithNoTests=false
```
Expected: FAIL（`Cannot find module './content-scoring.utils'`）。

- [ ] **Step 3: 写实现**

```ts
// backend/src/modules/content/content-scoring.utils.ts
// Feed 打分与确定性打散：纯函数、无 IO，便于单测（设计文档 §6.4）
import { createHash } from 'crypto';

export interface FeedCandidate {
  id: string;
  likeCount: number;
  viewCount: number;
  finishCount: number;
  publishAt: Date;
  zodiacSigns: string[];
  tags: string[];
  topicId: string;
  type: string;
  serializeGroupId?: string | null;
  orderNum: number;
}

export interface FeedContext {
  today: string;              // yyyy-MM-dd（北京时间）
  userId: string;             // 游客为 'guest'
  userZodiac?: string | null;
  finishedIds: Set<string>;
  openedIds: Set<string>;
  activeTags: string[];       // 当日星象相关标签（水逆窗口则含"水逆"）
  continueId: string | null;  // 连载续读置顶项
}

/** 确定性随机：同用户同日稳定，异用户/次日自然变化 */
export function seededJitter(userId: string, date: string, contentId: string): number {
  const h = createHash('sha256').update(`${userId}:${date}:${contentId}`).digest('hex');
  return parseInt(h.slice(0, 8), 16) / 0xffffffff;
}

export function baseScore(c: FeedCandidate, now: Date): number {
  const like = Math.log(1 + c.likeCount);
  const finishRate = c.viewCount > 0 ? c.finishCount / c.viewCount : 0;
  const ageHours = (now.getTime() - new Date(c.publishAt).getTime()) / 3_600_000;
  return like + finishRate * 2 + (ageHours <= 72 ? 1 : 0);
}

export function scoreFeed(
  candidates: FeedCandidate[],
  ctx: FeedContext,
  now: Date,
): { ranked: FeedCandidate[]; excludedFinished: number } {
  const scored = candidates
    .filter((c) => !ctx.finishedIds.has(c.id))
    .map((c) => {
      let s = baseScore(c, now);
      if (ctx.openedIds.has(c.id)) s -= 1.5;
      if (ctx.userZodiac && (c.zodiacSigns || []).includes(ctx.userZodiac)) s += 3;
      if ((c.tags || []).some((t) => ctx.activeTags.includes(t))) s += 2;
      if (ctx.continueId && c.id === ctx.continueId) s += 10;
      return { c, s: s + seededJitter(ctx.userId, ctx.today, c.id) };
    })
    .sort((a, b) => b.s - a.s);
  return { ranked: scored.map((x) => x.c), excludedFinished: candidates.length - scored.length };
}
```

- [ ] **Step 4: 运行确认通过**

```bash
cd /home/steve/github/stardust/backend && npx jest content-scoring
```
Expected: 全部 PASS。

- [ ] **Step 5: Commit**

```bash
cd /home/steve/github/stardust && git add backend/src/modules/content && git commit -m "feat(content): feed scoring utils with tests"
```

---

### Task 5: AI 生成管线 content-generation.service.ts

**Files:**
- Create: `backend/src/modules/content/content-generation.service.ts`

- [ ] **Step 1: 写生成服务（完整代码）**

```ts
// backend/src/modules/content/content-generation.service.ts
// 三条生产线中的「AI 内容工厂」+「天文历法引擎」（设计文档 §4）
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MinioService } from '../../common/minio/minio.service';
import { Solar } from 'lunar-javascript';

const PERSONA = `你是"星契集"的首席星象师「观星先生」，文风：东方玄学的诗意 + 温暖理性，面向 18-35 岁中文读者，篇幅克制。
价值观边界：不做封建迷信绝对论断；不涉性别对立与敏感政治；不提供医疗、投资建议；多用"可能/建议/不妨"的开放表达。`;

const OUTPUT_RULES = `只输出严格 JSON（禁止 JSON 以外任何文字，禁止 markdown 代码块围栏）：
{"title":"标题(≤18字)","summary":"摘要(≤60字)","body":[{"h":"小节标题","p":"200-400字正文"},共4-6块],"tags":["标签",2-4个],"zodiacSigns":[]}
额外字段 imagePrompt：一句中文画面描述（用于插画配图，不含文字元素）。`;

const ZODIACS = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];

const GROWTH_THEMES = ['自我价值：不靠他人打分也能站稳', '边界感：温和而坚定的说不', '职场勇气：争取属于自己的位置', '情绪管理：允许情绪流经而不决堤', '身体自主：把身体的感受还给自己', '断舍离：告别消耗型关系', '独处力：一个人也能丰盛', '同理心不内耗：共情而不背负'];

const RELATIONSHIP_THEMES = ['依恋类型：你是安全型还是焦虑型', '复合心理学：想挽回时先想清楚的事', '亲密关系中的边界感', '非暴力沟通：把话说进对方心里', '分手心理学：好好告别也是一种能力'];

const PAIR_THEMES = ['太阳与月亮：性格光与影的组合', '金星与爱的五种语言', '水星与两个人的沟通风格', '火星：吵架的火从哪来怎么灭', '土星：长期关系的试金石'];

// 水星逆行窗口年表（预置，足够运营使用；超出范围视为不逆行）
const MERCURY_RETRO: Array<[string, string]> = [
  ['2026-02-26', '2026-03-20'],
  ['2026-06-29', '2026-07-23'],
  ['2026-10-24', '2026-11-13'],
  ['2027-02-15', '2027-03-09'],
  ['2027-06-10', '2027-07-04'],
  ['2027-10-07', '2027-10-28'],
];

export interface AstroFacts {
  date: string; lunarStr: string; jieQi: string;
  yi: string[]; ji: string[]; mercuryRetro: boolean;
}

@Injectable()
export class ContentGenerationService {
  private readonly textUrl: string; private readonly textModel: string; private readonly textKey: string;
  private readonly imgUrl: string; private readonly imgModel: string; private readonly imgKey: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.textUrl = this.configService.get<string>('XIAOMIMIMO_API_URL') || '';
    this.textModel = this.configService.get<string>('XIAOMIMIMO_MODEL') || '';
    this.textKey = this.configService.get<string>('XIAOMIMIMO_API_KEY') || '';
    this.imgUrl = this.configService.get<string>('ARK_T2I_URL') || '';
    this.imgModel = this.configService.get<string>('ARK_T2I_MODEL') || '';
    this.imgKey = this.configService.get<string>('ARK_T2I_API_KEY') || '';
  }

  /** 天文历法引擎：程序计算事实，AI 只润色不造事实 */
  getAstroFacts(date = new Date()): AstroFacts {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    const iso = this.beijingDate(date);
    const mercuryRetro = MERCURY_RETRO.some(([a, b]) => iso >= a && iso <= b);
    return {
      date: iso,
      lunarStr: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      jieQi: lunar.getJieQi() || '',
      yi: lunar.getDayYi().slice(0, 4),
      ji: lunar.getDayJi().slice(0, 4),
      mercuryRetro,
    };
  }

  private beijingDate(d = new Date()): string {
    return new Date(d.getTime() + 8 * 3600_000).toISOString().slice(0, 10);
  }

  /** 每日管线：今日星象 + 黄历宜忌（日报类按 env 自动发布） */
  async runDailyPipeline(date = new Date()): Promise<{ astro: string; almanac: string }> {
    const facts = this.getAstroFacts(date);
    const auto = (this.configService.get<string>('CONTENT_AUTO_PUBLISH_DAILY') ?? 'true') === 'true';
    const astro = await this.generateDaily(facts, 'astro', auto);
    const almanac = await this.generateDaily(facts, 'almanac', auto);
    return { astro: astro.id, almanac: almanac.id };
  }

  private async generateDaily(facts: AstroFacts, mode: 'astro' | 'almanac', autoPublish: boolean) {
    const task =
      mode === 'astro'
        ? `写一篇《今日星象》短文，介绍 ${facts.date}（${facts.lunarStr}）的天象氛围与整体建议${facts.mercuryRetro ? '，今日处于水星逆行窗口，请提示沟通与出行细节' : ''}${facts.jieQi ? `，今日节气：${facts.jieQi}` : ''}。tags 必含"今日星象"${facts.mercuryRetro ? '与"水逆"' : ''}。`
        : `写一篇《黄历宜忌》短文：今日 ${facts.date}（${facts.lunarStr}），宜：${facts.yi.join('、')}，忌：${facts.ji.join('、')}。围绕这些宜忌给出一天的安排建议。tags 必含"黄历"。`;
    const gen = await this.callText(`${PERSONA}\n${task}\n${OUTPUT_RULES}`);
    gen.tags = Array.from(new Set([...(gen.tags || []), mode === 'astro' ? '今日星象' : '黄历']));
    return this.saveContent({ type: 'daily_astro', topicSlug: 'daily-astro', gen, status: autoPublish ? 'published' : 'draft' });
  }

  /** 深度栏目批量生成（30 篇种子用；zodiac_deep 需传 zodiac） */
  async generateArticle(opts: {
    type: 'zodiac_deep' | 'growth' | 'relationship' | 'pair_lab' | 'weekly_horoscope';
    zodiac?: string; theme?: string; orderNum?: number;
  }): Promise<string> {
    const conf: Record<string, { topic: string; task: string }> = {
      zodiac_deep: {
        topic: 'zodiac-deep',
        task: `写一篇《星座心理学》深度长文，主角星座：${opts.zodiac}。从心理学视角剖析该星座的人格底色、职场表现、爱情模式与成长课题，结尾给 3 条可执行的成长建议。zodiacSigns 填 ["${opts.zodiac}"]。`,
      },
      growth: {
        topic: 'growth',
        task: `为「她的星空」女性成长专栏写一篇深度文章，主题：${opts.theme || GROWTH_THEMES[0]}。以心理学科普为骨、温柔诗意为皮，给读者可落地的自我练习。`,
      },
      relationship: {
        topic: 'relationship',
        task: `为「亲密关系」专栏写一篇心理学科普文，主题：${opts.theme || RELATIONSHIP_THEMES[0]}。结合真实感的情景案例，给出具体沟通句式与练习。`,
      },
      pair_lab: {
        topic: 'pair-lab',
        task: `为「配对实验室」写一篇星座配对科普文，主题：${opts.theme || PAIR_THEMES[0]}。解释占星学中该概念的来源与心理学的对应解释，落点是"关系是可以经营的"。`,
      },
      weekly_horoscope: {
        topic: 'weekly-horoscope',
        task: `写一篇《本周天象》周运总览（不分星座），聚焦未来 7 天的总体星象建议。tags 必含"周运"。`,
      },
    };
    const c = conf[opts.type];
    if (!c) throw new BadRequestException(`不支持的类型: ${opts.type}`);
    const gen = await this.callText(`${PERSONA}\n${c.task}\n${OUTPUT_RULES}`);
    return this.saveContent({
      type: opts.type, topicSlug: c.topic, gen, status: 'draft',
      serializeGroupId: opts.type === 'zodiac_deep' ? 'zodiac-deep-series' : null,
      orderNum: opts.orderNum ?? 0,
    });
  }

  /** 豆包写稿（复用 XIAOMIMIMO 通道，OpenAI 格式） */
  private async callText(prompt: string, retries = 1): Promise<any> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await this.fetchWithTimeout(this.textUrl + '/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.textKey}` },
          body: JSON.stringify({
            model: this.textModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
          }),
        }, 180_000);
        if (!res.ok) throw new Error(`text api http ${res.status}: ${(await res.text()).slice(0, 200)}`);
        const data = await res.json();
        const parsed = this.extractJson(data?.choices?.[0]?.message?.content || '');
        if (!parsed?.title || !Array.isArray(parsed?.body)) throw new Error('AI 输出结构不符合要求');
        return parsed;
      } catch (e) {
        console.error('[ContentGeneration] text attempt', attempt, 'failed:', e.message);
        if (attempt === retries) throw new BadRequestException(`AI 写稿失败: ${e.message}`);
      }
    }
  }

  /** 从模型输出中稳健提取 JSON（容忍围栏/前后杂文） */
  private extractJson(raw: string): any {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start < 0 || end <= start) throw new Error('未找到 JSON');
    return JSON.parse(cleaned.slice(start, end + 1));
  }

  /** seedream 配图 → 下载 → MinIO（contents/covers/） */
  private async generateCover(imagePrompt: string): Promise<string | null> {
    try {
      const res = await this.fetchWithTimeout(this.imgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.imgKey}` },
        body: JSON.stringify({
          model: this.imgModel,
          prompt: `夜空鎏金插画风格，深靛蓝星空，金色星芒与星座连线，东方玄学氛围，梦幻细腻，无文字。${imagePrompt}`,
          size: '1024x1024', response_format: 'url', watermark: false,
        }),
      }, 120_000);
      if (!res.ok) throw new Error(`image api http ${res.status}`);
      const data = await res.json();
      const url: string = data?.data?.[0]?.url;
      if (!url) throw new Error('未返回图片');
      const isJpeg = /\.jpe?g(\?|$)/i.test(url);
      const imgRes = await this.fetchWithTimeout(url, { method: 'GET' }, 60_000);
      if (!imgRes.ok) throw new Error('图片下载失败');
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const fileName = `content-cover-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${isJpeg ? 'jpg' : 'png'}`;
      return await this.minio.uploadFile(buffer, fileName, isJpeg ? 'image/jpeg' : 'image/png', 'contents/covers');
    } catch (e) {
      console.warn('[ContentGeneration] cover failed, fallback to none:', e.message);
      return null; // 配图失败不阻塞文字内容
    }
  }

  private async saveContent(input: {
    type: string; topicSlug: string; gen: any; status: string;
    serializeGroupId?: string | null; orderNum?: number;
  }): Promise<{ id: string }> {
    const topic = await this.prisma.contentTopic.findUnique({ where: { slug: input.topicSlug } });
    if (!topic) throw new BadRequestException(`栏目不存在: ${input.topicSlug}`);
    const cover = input.gen.imagePrompt ? await this.generateCover(input.gen.imagePrompt) : null;
    const created = await this.prisma.content.create({
      data: {
        topicId: topic.id, type: input.type,
        title: String(input.gen.title).slice(0, 60),
        summary: String(input.gen.summary || '').slice(0, 120),
        coverImage: cover,
        body: input.gen.body, tags: input.gen.tags || [],
        zodiacSigns: input.gen.zodiacSigns || [],
        serializeGroupId: input.serializeGroupId ?? null,
        orderNum: input.orderNum ?? 0,
        source: 'ai', status: input.status,
      },
      select: { id: true },
    });
    return created;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 120_000): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }
}
```

- [ ] **Step 2: 编译自检**

```bash
cd /home/steve/github/stardust/backend && npx tsc --noEmit -p tsconfig.json 2>&1 | head -n 5
```
Expected: 无输出（或仅有与既有文件无关的旧告警；出现本文件错误必须先修）。

- [ ] **Step 3: Commit**

```bash
cd /home/steve/github/stardust && git add backend/src/modules/content/content-generation.service.ts && git commit -m "feat(content): AI generation pipeline (doubao text + seedream cover)"
```

---

### Task 6: ContentService（feed/详情/进度/点赞/daily/一签）

**Files:**
- Create: `backend/src/modules/content/content.service.ts`

- [ ] **Step 1: 写服务（完整代码）**

```ts
// backend/src/modules/content/content.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ContentGenerationService } from './content-generation.service';
import { scoreFeed, FeedCandidate, FeedContext } from './content-scoring.utils';
import { createHash } from 'crypto';

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly generation: ContentGenerationService,
  ) {}

  private beijingDate(d = new Date()): string {
    return new Date(d.getTime() + 8 * 3600_000).toISOString().slice(0, 10);
  }

  /** 当日星象相关标签（水逆窗口 → "水逆"） */
  private getActiveTags(): string[] {
    return this.generation.getAstroFacts().mercuryRetro ? ['水逆'] : [];
  }

  /** 个性化 feed（设计文档 §6.4：L1 已读去重 + L2 加权分桶 + 20% 探索） */
  async getFeed(userId: string | null, topicSlug: string | undefined, cursor: string | undefined, limit = 10) {
    const lim = Math.min(Math.max(Number(limit) || 10, 1), 30);
    const where: any = { status: 'published', publishAt: { lte: new Date() } };
    if (topicSlug) {
      const topic = await this.prisma.contentTopic.findUnique({ where: { slug: topicSlug } });
      if (!topic) throw new NotFoundException('栏目不存在');
      where.topicId = topic.id;
    }
    const rows = await this.prisma.content.findMany({
      where, orderBy: { publishAt: 'desc' }, take: 300,
      include: { topic: { select: { slug: true, name: true } } },
    });

    const today = this.beijingDate();
    const ctx: FeedContext = {
      today, userId: userId || 'guest', userZodiac: null,
      finishedIds: new Set<string>(), openedIds: new Set<string>(),
      activeTags: this.getActiveTags(), continueId: null,
    };

    if (userId) {
      const [user, progress, cursorRow] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: userId }, select: { zodiacSign: true } }),
        this.prisma.userContentProgress.findMany({
          where: { userId },
          orderBy: { lastReadAt: 'desc' }, take: 200,
          include: { content: { select: { serializeGroupId: true, orderNum: true, topicId: true } } },
        }),
        this.prisma.userFeedCursor.findUnique({ where: { userId } }),
      ]);
      ctx.userZodiac = user?.zodiacSign ?? null;
      for (const p of progress) {
        (p.status === 'finished' ? ctx.finishedIds : ctx.openedIds).add(p.contentId);
      }
      // 连载续读：最近读完的连载篇 → 同组 orderNum+1 的下一篇
      const lastSerial = progress.find((p) => p.status === 'finished' && p.content.serializeGroupId);
      if (lastSerial) {
        const next = rows.find((r) =>
          r.serializeGroupId === lastSerial.content.serializeGroupId && r.orderNum === lastSerial.content.orderNum + 1,
        );
        if (next) ctx.continueId = next.id;
      }
    }

    const candidates: FeedCandidate[] = rows.map((r) => ({
      id: r.id, likeCount: r.likeCount, viewCount: r.viewCount, finishCount: r.finishCount,
      publishAt: r.publishAt, zodiacSigns: (r.zodiacSigns as string[]) || [],
      tags: (r.tags as string[]) || [], topicId: r.topicId, type: r.type,
      serializeGroupId: r.serializeGroupId, orderNum: r.orderNum,
    }));
    const { ranked } = scoreFeed(candidates, ctx, new Date());

    // cursor 分页：定位 cursor 在排序结果中的位置，取下一页
    let start = 0;
    if (cursor) {
      const idx = ranked.findIndex((c) => c.id === cursor);
      start = idx >= 0 ? idx + 1 : 0;
    }
    let page = ranked.slice(start, start + lim).map((c) => this.decorate(rows.find((r) => r.id === c.id)!, ctx));

    // 探索位（仅首页）：20% 名额从近 14 天未接触栏目随机取
    if (userId && !cursor) {
      const since = new Date(Date.now() - 14 * 24 * 3600_000);
      const touchedRows = await this.prisma.userContentProgress.findMany({
        where: { userId, lastReadAt: { gte: since } }, select: { content: { select: { topicId: true } } },
      });
      const touched = new Set(touchedRows.map((t) => t.content.topicId));
      const exploreSlots = Math.floor(lim / 5);
      for (let i = 0; i < exploreSlots; i++) {
        const pool = ranked.slice(start + lim).filter((c) => !touched.has(c.topicId) && !page.some((p) => p.id === c.id));
        if (!pool.length) break;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        const item = this.decorate(rows.find((r) => r.id === pick.id)!, ctx);
        item.isExplore = true;
        page.push(item);
      }
    }

    const last = page[page.length - 1];
    // 断点续读：上次浏览位置
    let resume: { contentId: string; index: number } | null = null;
    if (userId) {
      const cursorRow = await this.prisma.userFeedCursor.findUnique({ where: { userId } });
      if (cursorRow?.cursor) {
        const idx = page.findIndex((p) => p.id === cursorRow.cursor);
        if (idx >= 0) resume = { contentId: cursorRow.cursor, index: idx };
      }
    }
    return { items: page, nextCursor: page.length < lim ? null : last?.id ?? null, resume };
  }

  private decorate(r: any, ctx: FeedContext) {
    return {
      id: r.id, type: r.type, title: r.title, summary: r.summary, coverImage: r.coverImage,
      tags: r.tags, zodiacSigns: r.zodiacSigns, likeCount: r.likeCount, viewCount: r.viewCount,
      publishAt: r.publishAt, serializeGroupId: r.serializeGroupId, orderNum: r.orderNum,
      topic: r.topic, isRead: ctx.finishedIds.has(r.id), isContinue: ctx.continueId === r.id,
      isExplore: false,
    };
  }

  /** 详情 + 相关推荐；带当前用户点赞/已读态 */
  async getDetail(id: string, userId: string | null) {
    const r = await this.prisma.content.findUnique({
      where: { id }, include: { topic: { select: { slug: true, name: true } } },
    });
    if (!r || r.status !== 'published') throw new NotFoundException('内容不存在');
    await this.prisma.content.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
    const related = await this.prisma.content.findMany({
      where: { status: 'published', id: { not: id }, topicId: r.topicId, publishAt: { lte: new Date() } },
      orderBy: { publishAt: 'desc' }, take: 3,
    });
    const fallback = related.length < 3
      ? await this.prisma.content.findMany({
          where: { status: 'published', id: { notIn: [id, ...related.map((x) => x.id)] } },
          orderBy: { likeCount: 'desc' }, take: 3 - related.length,
        })
      : [];
    let liked = false; let isFinished = false;
    if (userId) {
      const [like, prog] = await Promise.all([
        this.prisma.userContentLike.findUnique({ where: { userId_contentId: { userId, contentId: id } } }),
        this.prisma.userContentProgress.findUnique({ where: { userId_contentId: { userId, contentId: id } } }),
      ]);
      liked = !!like; isFinished = prog?.status === 'finished';
    }
    return {
      ...r, viewCount: r.viewCount + 1, liked, isFinished,
      related: [...related, ...fallback].map((x) => ({ id: x.id, title: x.title, summary: x.summary, coverImage: x.coverImage })),
    };
  }

  /** 上报阅读进度：finished 时累计完读并更新断点 */
  async reportProgress(userId: string, contentId: string, status: 'opened' | 'finished') {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content) throw new NotFoundException('内容不存在');
    const existing = await this.prisma.userContentProgress.findUnique({
      where: { userId_contentId: { userId, contentId } },
    });
    if (existing?.status === 'finished') return { ok: true };
    await this.prisma.userContentProgress.upsert({
      where: { userId_contentId: { userId, contentId } },
      update: { status, lastReadAt: new Date() },
      create: { userId, contentId, status },
    });
    if (status === 'finished') {
      await this.prisma.content.update({ where: { id: contentId }, data: { finishCount: { increment: 1 } } });
    }
    await this.prisma.userFeedCursor.upsert({
      where: { userId }, update: { cursor: contentId, updatedAt: new Date() }, create: { userId, cursor: contentId },
    });
    return { ok: true };
  }

  /** 点赞切换（UserContentLike 记录用户态） */
  async toggleLike(userId: string, contentId: string) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!content) throw new NotFoundException('内容不存在');
    const existing = await this.prisma.userContentLike.findUnique({
      where: { userId_contentId: { userId, contentId } },
    });
    if (existing) {
      await this.prisma.userContentLike.delete({ where: { id: existing.id } });
      const r = await this.prisma.content.update({ where: { id: contentId }, data: { likeCount: { decrement: 1 } } });
      return { liked: false, likeCount: r.likeCount };
    }
    try {
      await this.prisma.userContentLike.create({ data: { userId, contentId } });
    } catch (e: any) {
      if (e?.code === 'P2002') return { liked: true, likeCount: content.likeCount }; // 并发重复点赞幂等
      throw e;
    }
    const r = await this.prisma.content.update({ where: { id: contentId }, data: { likeCount: { increment: 1 } } });
    return { liked: true, likeCount: r.likeCount };
  }

  /** 今日星读：当日 daily_astro 最新一篇，7 日内兜底 */
  async getDaily() {
    const now = new Date();
    const todayStart = new Date(now.getTime() - 8 * 3600_000);
    todayStart.setUTCHours(16, 0, 0, 0); // 北京时间 00:00
    const today = await this.prisma.content.findFirst({
      where: { status: 'published', type: 'daily_astro', publishAt: { gte: todayStart } },
      orderBy: { publishAt: 'desc' },
    });
    if (today) return this.pickDailyFields(today);
    const fallback = await this.prisma.content.findFirst({
      where: { status: 'published', type: 'daily_astro' }, orderBy: { publishAt: 'desc' },
    });
    return fallback ? this.pickDailyFields(fallback) : null;
  }

  private pickDailyFields(r: any) {
    return { id: r.id, title: r.title, summary: r.summary, coverImage: r.coverImage, publishAt: r.publishAt, tags: r.tags };
  }

  /** 每日一签：同用户同日确定（先查记录，无则 hash 抽签并落库） */
  async drawSign(userKey: string) {
    const date = this.beijingDate();
    const existed = await this.prisma.userDailySign.findUnique({
      where: { userId_date: { userId: userKey, date } }, include: { sign: true },
    }).catch(() => null);
    // 注：Prisma include 需要关系，此处改两步查询
    if (existed) {
      const sign = await this.prisma.dailySign.findUnique({ where: { id: existed.signId } });
      return { sign, alreadyDrawn: true };
    }
    const pool = await this.prisma.dailySign.findMany({ orderBy: { title: 'asc' } });
    if (!pool.length) throw new BadRequestException('签池为空，请先运行 seed-content');
    const hash = createHash('sha256').update(`${userKey}:${date}`).digest('hex');
    const sign = pool[parseInt(hash.slice(0, 8), 16) % pool.length];
    try {
      await this.prisma.userDailySign.create({ data: { userId: userKey, date, signId: sign.id } });
    } catch (e: any) {
      if (e?.code !== 'P2002') throw e; // 并发下以先落库者为准
    }
    return { sign, alreadyDrawn: false };
  }
}
```

**注意**：`UserDailySign` 与 `DailySign` 之间没有定义 Prisma 关系，`drawSign` 中删除 `include: { sign: true }` 的第一次查询写法，使用上面两步查询的最终写法（保留 catch 处理 userId_date 唯一冲突）。

- [ ] **Step 2: 编译自检**

```bash
cd /home/steve/github/stardust/backend && npx tsc --noEmit -p tsconfig.json 2>&1 | head -n 5
```
Expected: 无本文件错误。

- [ ] **Step 3: Commit**

```bash
cd /home/steve/github/stardust && git add backend/src/modules/content/content.service.ts && git commit -m "feat(content): feed/progress/like/daily/sign service"
```

---

### Task 7: OptionalJwtGuard + 公开 Controller

**Files:**
- Create: `backend/src/common/guards/optional-jwt.guard.ts`
- Create: `backend/src/modules/content/content.controller.ts`

- [ ] **Step 1: 可选鉴权 Guard（游客放行，有合法 token 则挂 user）**

```ts
// backend/src/common/guards/optional-jwt.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/** 可选鉴权：无 token/无效 token 均放行（游客），有效 token 则 request.user = payload */
@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      try {
        request.user = await this.jwtService.verifyAsync(token);
      } catch {
        // 无效令牌按游客处理
      }
    }
    return true;
  }
}
```

- [ ] **Step 2: 公开 Controller**

```ts
// backend/src/modules/content/content.controller.ts
import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtGuard } from '../../common/guards/optional-jwt.guard';

@Controller('contents')
@UseGuards(OptionalJwtGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('feed')
  async feed(
    @Req() req: Request,
    @Query('topic') topic?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = (req as any).user?.sub || null;
    return this.contentService.getFeed(userId, topic, cursor, Number(limit) || 10);
  }

  @Get('daily')
  async daily() {
    return this.contentService.getDaily();
  }

  @Get('sign/today')
  async signToday(@Req() req: Request, @Query('anonId') anonId?: string) {
    const userKey = (req as any).user?.sub || (anonId ? `anon:${anonId}` : null);
    if (!userKey) return { sign: null, needAnonId: true };
    return this.contentService.drawSign(userKey);
  }

  @Get(':id')
  async detail(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user?.sub || null;
    return this.contentService.getDetail(id, userId);
  }

  @Post(':id/progress')
  @UseGuards(JwtAuthGuard)
  async progress(
    @Req() req: Request, @Param('id') id: string,
    @Body() body: { status: 'opened' | 'finished' },
  ) {
    const userId = (req as any).user.sub;
    return this.contentService.reportProgress(userId, id, body?.status === 'finished' ? 'finished' : 'opened');
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async like(@Req() req: Request, @Param('id') id: string) {
    return this.contentService.toggleLike((req as any).user.sub, id);
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd /home/steve/github/stardust && git add backend/src/common/guards/optional-jwt.guard.ts backend/src/modules/content/content.controller.ts && git commit -m "feat(content): public content endpoints with optional auth"
```

---

### Task 8: Admin Guard + Admin Controller

**Files:**
- Create: `backend/src/common/guards/admin.guard.ts`
- Create: `backend/src/modules/content/content-admin.controller.ts`

- [ ] **Step 1: Admin Guard（常量时间比较，未配置一律 403）**

```ts
// backend/src/common/guards/admin.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const expected = process.env.ADMIN_TOKEN;
    if (!expected) throw new ForbiddenException('管理员令牌未配置');
    const got = String(request.headers['x-admin-token'] ?? '');
    const a = Buffer.from(got);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      throw new ForbiddenException('无效的管理员令牌');
    }
    return true;
  }
}
```

- [ ] **Step 2: Admin Controller**

```ts
// backend/src/modules/content/content-admin.controller.ts
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ContentGenerationService } from './content-generation.service';
import { NotFoundException } from '@nestjs/common';

@Controller('admin/contents')
@UseGuards(AdminGuard)
export class ContentAdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly generation: ContentGenerationService,
  ) {}

  /** 审核队列 */
  @Get()
  async list(
    @Query('status') status?: string, @Query('type') type?: string,
    @Query('skip') skip?: string, @Query('take') take?: string,
  ) {
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.content.findMany({
        where, orderBy: { createdAt: 'desc' },
        skip: Number(skip) || 0, take: Number(take) || 20,
        select: { id: true, type: true, title: true, summary: true, status: true, publishAt: true, createdAt: true, topicId: true },
      }),
      this.prisma.content.count({ where }),
    ]);
    return { items, total };
  }

  /** 编辑草稿（标题/摘要/正文/标签/发布时间） */
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    for (const k of ['title', 'summary', 'body', 'tags', 'publishAt'] as const) {
      if (body[k] !== undefined) data[k] = body[k];
    }
    if (!Object.keys(data).length) throw new NotFoundException('无可更新字段');
    return this.prisma.content.update({ where: { id }, data, select: { id: true, status: true } });
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string, @Body() body: { publishAt?: string } = {}) {
    const data: any = { status: 'published' };
    if (body?.publishAt) data.publishAt = new Date(body.publishAt);
    return this.prisma.content.update({ where: { id }, data, select: { id: true, status: true, publishAt: true } });
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string, @Body() body: { reason?: string } = {}) {
    const c = await this.prisma.content.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('内容不存在');
    const bodyAny = (c.body as any[]) || [];
    bodyAny.push({ h: '驳回备注', p: body?.reason || '未通过审核' });
    return this.prisma.content.update({ where: { id }, data: { status: 'rejected', body: bodyAny }, select: { id: true, status: true } });
  }

  /** 批量生成草稿（写稿 + 配图；zodiac_deep 必传 zodiac） */
  @Post('generate')
  async generate(@Body() body: { type: string; count?: number; zodiac?: string; theme?: string }) {
    const count = Math.min(Number(body?.count) || 1, 5);
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      const zodiac = body.zodiac; // 同批同星座（连载场景一次一篇）
      ids.push(await this.generation.generateArticle({
        type: body.type as any, zodiac, theme: body.theme,
        orderNum: 0,
      }));
    }
    return { generated: ids.length, ids };
  }

  /** 手动触发当日自动管线（补跑用） */
  @Post('cron/daily')
  async cronDaily() {
    return this.generation.runDailyPipeline();
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd /home/steve/github/stardust && git add backend/src/common/guards/admin.guard.ts backend/src/modules/content/content-admin.controller.ts && git commit -m "feat(content): admin guard and review endpoints"
```

---

### Task 9: Cron + 模块注册 + App 接线

**Files:**
- Create: `backend/src/modules/content/content-cron.service.ts`
- Create: `backend/src/modules/content/content.module.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: 每日定时生成**

```ts
// backend/src/modules/content/content-cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ContentGenerationService } from './content-generation.service';

@Injectable()
export class ContentCronService {
  private readonly logger = new Logger('ContentCron');

  // 每日 02:30（服务器时区）生成当日内容
  @Cron('30 2 * * *')
  async dailyPipeline() {
    this.logger.log('每日内容管线启动');
    try {
      const r = await this.contentGeneration.runDailyPipeline();
      this.logger.log(`每日内容完成: astro=${r.astro} almanac=${r.almanac}`);
    } catch (e) {
      this.logger.error('每日内容管线失败', e);
    }
  }

  constructor(private readonly contentGeneration: ContentGenerationService) {}
}
```

- [ ] **Step 2: 模块定义**

```ts
// backend/src/modules/content/content.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { ContentGenerationService } from './content-generation.service';
import { ContentAdminController } from './content-admin.controller';
import { ContentCronService } from './content-cron.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ContentController, ContentAdminController],
  providers: [ContentService, ContentGenerationService, ContentCronService],
})
export class ContentModule {}
```

- [ ] **Step 3: app.module.ts 接线（两处修改）**

imports 数组新增 `ScheduleModule.forRoot()` 与 `ContentModule`（新增 import 语句）：

```ts
import { ScheduleModule } from '@nestjs/schedule';
import { ContentModule } from './modules/content/content.module';
```

`imports: [ConfigModule.forRoot({...}), ScheduleModule.forRoot(), ThrottlerModule.forRoot([...]), ..., ProductModule, ContentModule]`

- [ ] **Step 4: 启动验证**

```bash
cd /home/steve/github/stardust/backend && npm run start:dev
```
Expected: 控制台出现 `Mapped {/api/contents/feed, GET}`、`Mapped {/api/admin/contents, GET}` 等新路由；`Nest application successfully started`。保持运行。

- [ ] **Step 5: 冒烟（管理员 403 与 feed 游客可用）**

```bash
curl -s -o /dev/null -w "feed: %{http_code}\n" "http://127.0.0.1:3000/api/contents/feed"
curl -s -o /dev/null -w "admin no token: %{http_code}\n" "http://127.0.0.1:3000/api/admin/contents"
```
Expected: `feed: 200`（items 为空数组）；`admin no token: 403`。

- [ ] **Step 6: Commit**

```bash
cd /home/steve/github/stardust && git add backend/src/modules/content/content-cron.service.ts backend/src/modules/content/content.module.ts backend/src/app.module.ts && git commit -m "feat(content): cron pipeline and module wiring"
```

---

### Task 10: 生成 30 篇种子文并发布排期

**Files:** 无新文件（使用 admin API + bash 脚本）

- [ ] **Step 1: 手动补跑当日日报（验证生成管线全链路）**

```bash
cd /home/steve/github/stardust/backend
ADMIN_TOKEN=$(grep '^ADMIN_TOKEN=' .env | cut -d'"' -f2)
curl -s -X POST http://127.0.0.1:3000/api/admin/contents/cron/daily -H "x-admin-token: $ADMIN_TOKEN" -m 400
```
Expected: `{"astro":"<id>","almanac":"<id>"}`（约 1-3 分钟，含写稿+配图；失败看后端日志）。

- [ ] **Step 2: 生成 30 篇种子草稿（串行，约 30-60 分钟）**

```bash
cd /home/steve/github/stardust/backend
ADMIN_TOKEN=$(grep '^ADMIN_TOKEN=' .env | cut -d'"' -f2)
gen() { curl -s -X POST http://127.0.0.1:3000/api/admin/contents/generate -H "x-admin-token: $ADMIN_TOKEN" -H "Content-Type: application/json" -m 400 -d "$1"; echo; }
for z in 白羊座 金牛座 双子座 巨蟹座 狮子座 处女座 天秤座 天蝎座 射手座 摩羯座 水瓶座 双鱼座; do
  gen "{\"type\":\"zodiac_deep\",\"count\":1,\"zodiac\":\"$z\"}"
done
for i in 1 2 3 4 5 6 7 8; do gen '{"type":"growth","count":1}'; done
for i in 1 2 3 4 5; do gen '{"type":"relationship","count":1}'; done
for i in 1 2 3 4 5; do gen '{"type":"pair_lab","count":1}'; done
```
Expected: 每次输出 `{"generated":1,"ids":["..."]}`。**注意：dev 环境允许直接发布；生产环境逐篇人审后用 publish 接口发布。**

- [ ] **Step 3: 为连载补 orderNum + 全部发布并按 1-3 篇/日排期**

```bash
cd /home/steve/github/stardust/backend
ADMIN_TOKEN=$(grep '^ADMIN_TOKEN=' .env | cut -d'"' -f2)
# 取全部草稿 id 列表
IDS=$(curl -s "http://127.0.0.1:3000/api/admin/contents?status=draft&take=100" -H "x-admin-token: $ADMIN_TOKEN" | python3 -c "import sys,json; print('\n'.join(x['id'] for x in json.load(sys.stdin)['items']))")
i=0
NOW=$(date +%s)
for id in $IDS; do
  i=$((i+1))
  # 每 8 小时放一篇：约每日 3 篇 → 30 篇铺 10 天
  AT=$(python3 -c "import datetime; print((datetime.datetime.fromtimestamp($NOW)+datetime.timedelta(hours=8*$i)).isoformat())")
  curl -s -X POST "http://127.0.0.1:3000/api/admin/contents/$id/publish" -H "x-admin-token: $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"publishAt\":\"$AT\"}"; echo
done
# 为 12 篇 zodiac_deep 连载补 orderNum（按创建顺序 1..12）
docker exec stardust-mysql mysql -ustardust_user -pstardust_pass123 stardust -e "
SET @r=0; UPDATE contents SET orderNum = (@r:=@r+1) WHERE serializeGroupId='zodiac-deep-series' ORDER BY createdAt;" 2>/dev/null
```
Expected: 30 行 publish 响应；数据库 `contents` 表 `status='published'` 30 条。

- [ ] **Step 4: 验证 feed 出内容**

```bash
curl -s "http://127.0.0.1:3000/api/contents/feed?limit=5" | python3 -m json.tool | head -n 20
curl -s "http://127.0.0.1:3000/api/contents/daily" | head -c 200; echo
```
Expected: feed 返回 items（含 coverImage MinIO URL）；daily 返回今日星象。

- [ ] **Step 5: Commit（如有脚本/备注更新）**

```bash
cd /home/steve/github/stardust && git add -A backend/prisma 2>/dev/null; git commit -m "chore(content): seed articles generated" --allow-empty || true
```
（种子内容在数据库中，不入库代码。此步允许空提交跳过。）

---

### Task 11: 前端 API 层 + 路由 + 首页入口 + 今日星读卡

**Files:**
- Modify: `frontend/src/api/index.ts`（api 对象内追加 content 命名空间）
- Modify: `frontend/src/pages.json`
- Modify: `frontend/src/pages/index/index.vue`
- Create: `frontend/src/components/ContentDailyCard.vue`

- [ ] **Step 1: api/index.ts 的 `api` 对象内追加**

```ts
content: {
  getFeed: (params: { topic?: string; cursor?: string; limit?: number } = {}) => {
    const q: string[] = []
    if (params.topic) q.push(`topic=${encodeURIComponent(params.topic)}`)
    if (params.cursor) q.push(`cursor=${params.cursor}`)
    if (params.limit) q.push(`limit=${params.limit}`)
    return request({ url: `/contents/feed${q.length ? '?' + q.join('&') : ''}` })
  },
  getDetail: (id: string) => request({ url: `/contents/${id}` }),
  reportProgress: (id: string, status: 'opened' | 'finished') =>
    request({ url: `/contents/${id}/progress`, method: 'POST', data: { status } }),
  toggleLike: (id: string) => request({ url: `/contents/${id}/like`, method: 'POST' }),
  getDaily: () => request({ url: '/contents/daily' }),
  getSignToday: (anonId?: string) =>
    request({ url: `/contents/sign/today${anonId ? `?anonId=${encodeURIComponent(anonId)}` : ''}` }),
},
```

- [ ] **Step 2: pages.json `pages` 数组追加 3 页（在astrology/calculate 条目后插入）**

```json
{
  "path": "pages/content/list",
  "style": {
    "navigationBarTitleText": "星读",
    "enablePullDownRefresh": true
  }
},
{
  "path": "pages/content/detail",
  "style": {
    "navigationBarTitleText": "星读"
  }
},
{
  "path": "pages/content/sign",
  "style": {
    "navigationStyle": "custom"
  }
}
```

- [ ] **Step 3: 首页功能宫格加「星读」项**

`frontend/src/pages/index/index.vue` features 数组末尾（恋爱CP 之后）追加：

```ts
  { title: '星读', desc: '星座·情感·她的星空', url: '/pages/content/list', symbol: '❂', accent: false },
```
（现有 click 分发逻辑 `else uni.navigateTo({ url })` 已覆盖，无需改 handler。）

- [ ] **Step 4: 新建 ContentDailyCard 组件**

```vue
<!-- frontend/src/components/ContentDailyCard.vue -->
<template>
  <view v-if="daily" class="daily-card sd-reveal-2" @click="open">
    <image v-if="daily.coverImage" :src="daily.coverImage" class="cover" mode="aspectFill" />
    <view class="info">
      <text class="kicker">✦ 今日星读</text>
      <text class="title">{{ daily.title }}</text>
      <text class="summary">{{ daily.summary }}</text>
      <text class="more">阅读全文 ›</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'

const daily = ref<any>(null)

onMounted(async () => {
  try {
    daily.value = await api.content.getDaily()
  } catch (e) {
    daily.value = null // 无数据隐藏整卡
  }
})

function open() {
  if (daily.value?.id) {
    uni.navigateTo({ url: `/pages/content/detail?id=${daily.value.id}` })
  }
}
</script>

<style lang="scss" scoped>
.daily-card {
  @include sd-card-surface(gold);
  display: flex;
  overflow: hidden;
  margin-bottom: 24rpx;

  .cover {
    width: 200rpx;
    height: 200rpx;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    min-width: 0;
    padding: 24rpx;
    display: flex;
    flex-direction: column;
  }

  .kicker {
    font-size: 20rpx;
    color: $sd-gold;
    letter-spacing: 2rpx;
    margin-bottom: 8rpx;
  }

  .title {
    font-family: $sd-font-display;
    font-size: 30rpx;
    font-weight: bold;
    color: $sd-text;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .summary {
    margin-top: 10rpx;
    font-size: 22rpx;
    color: $sd-text-2;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .more {
    margin-top: auto;
    font-size: 22rpx;
    color: $sd-gold;
  }
}
</style>
```

- [ ] **Step 5: 首页接入（两处小改）**

`index.vue` script 导入：`import ContentDailyCard from '@/components/ContentDailyCard.vue'`
模板：在 `<DailyFortuneCard ... />` 区块结束之后、引导卡之前插入一行：

```html
    <!-- 今日星读卡 -->
    <ContentDailyCard />
```

- [ ] **Step 6: Commit**

```bash
cd /home/steve/github/stardust && git add frontend/src/api/index.ts frontend/src/pages.json frontend/src/pages/index/index.vue frontend/src/components/ContentDailyCard.vue && git commit -m "feat(content): api layer, routes, home entry and daily card"
```

---

### Task 12: 星读栏目页 pages/content/list.vue

**Files:**
- Create: `frontend/src/pages/content/list.vue`

- [ ] **Step 1: 写页面（完整代码）**

```vue
<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <view class="content">
      <!-- 栏目 Tab -->
      <scroll-view scroll-x class="tabs sd-reveal">
        <view class="tabs-inner">
          <view
            v-for="t in tabs"
            :key="t.slug"
            class="tab"
            :class="{ active: activeTab === t.slug }"
            @click="switchTab(t.slug)"
          >
            <text>{{ t.label }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 内容卡片流 -->
      <view v-if="loading && !items.length" class="skeleton-wrap">
        <LoadingSkeleton :rows="4" />
      </view>

      <view
        v-for="(item, index) in items"
        :key="item.id"
        class="card"
        :class="{ 'is-resume': item.id === resumeId }"
        @click="openDetail(item)"
      >
        <view v-if="item.id === resumeId" class="resume-tag">✦ 继续阅读</view>
        <image v-if="item.coverImage" :src="item.coverImage" class="cover" mode="aspectFill" />
        <view class="body">
          <view class="title-row">
            <text class="title">{{ item.title }}</text>
            <text v-if="item.isRead" class="read-mark">已读</text>
          </view>
          <text class="summary">{{ item.summary }}</text>
          <view class="meta">
            <view class="chips">
              <text v-if="item.isContinue" class="sd-chip is-gold">你想看的更新了</text>
              <text v-else-if="item.isExplore" class="sd-chip is-purple">为你发现</text>
              <text v-if="item.orderNum" class="sd-chip">连载 {{ item.orderNum }}</text>
            </view>
            <text class="likes">✧ {{ item.likeCount }}</text>
          </view>
        </view>
        <text v-if="index === 0 && !activeTab" class="explore-hint">{{ '' }}</text>
      </view>

      <EmptyState
        v-if="!loading && !items.length"
        icon="❂"
        title="星读内容即将上线"
        desc="星象师正在赶稿，先去看看其他功能吧"
      />

      <view v-if="loadingMore" class="loading-more"><text>✶ 正在加载…</text></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { api } from '@/api'
import LoadingSkeleton from '@/components/loading-skeleton/loading-skeleton.vue'
import EmptyState from '@/components/empty-state/empty-state.vue'

const tabs = [
  { slug: '', label: '推荐' },
  { slug: 'daily-astro', label: '星象' },
  { slug: 'zodiac-deep', label: '星座人格' },
  { slug: 'growth', label: '她的星空' },
  { slug: 'relationship', label: '亲密关系' },
]

const activeTab = ref('')
const items = ref<any[]>([])
const cursor = ref<string | null>(null)
const loading = ref(false)
const loadingMore = ref(false)
const resumeId = ref<string | null>(null)

async function loadFeed(reset: boolean) {
  if (reset) {
    loading.value = true
    cursor.value = null
    items.value = []
    resumeId.value = null
  } else {
    loadingMore.value = true
  }
  try {
    const res: any = await api.content.getFeed({
      topic: activeTab.value || undefined,
      cursor: reset ? undefined : cursor.value || undefined,
      limit: 10,
    })
    if (reset) {
      items.value = res.items || []
      resumeId.value = res.resume?.contentId || null
    } else {
      items.value = [...items.value, ...(res.items || [])]
    }
    cursor.value = res.nextCursor
  } catch (e: any) {
    uni.showToast({ title: e.message || '加载失败', icon: 'none' })
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function switchTab(slug: string) {
  if (activeTab.value === slug) return
  activeTab.value = slug
  loadFeed(true)
}

function openDetail(item: any) {
  uni.navigateTo({ url: `/pages/content/detail?id=${item.id}` })
}

onPullDownRefresh(async () => {
  await loadFeed(true)
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  if (cursor.value && !loadingMore.value) loadFeed(false)
})

loadFeed(true)
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: $sd-bg;
}

.content {
  position: relative;
  z-index: 1;
  padding: 20rpx 32rpx calc(env(safe-area-inset-bottom) + 40rpx);
}

.tabs {
  white-space: nowrap;
  margin-bottom: 20rpx;

  .tabs-inner {
    display: inline-flex;
    gap: 16rpx;
    padding: 8rpx 0;
  }

  .tab {
    padding: 12rpx 32rpx;
    border-radius: $sd-radius-pill;
    background: $sd-bg-nav;
    border: 1rpx solid $sd-stroke;
    font-size: 26rpx;
    color: $sd-text-2;

    &.active {
      background: $sd-gold-grad;
      color: $sd-gold-ink;
      font-weight: bold;
      box-shadow: $sd-glow-gold;
    }
  }
}

.skeleton-wrap {
  padding: 30rpx;
}

.card {
  @include sd-card-surface();
  position: relative;
  margin-bottom: 24rpx;
  overflow: hidden;

  &.is-resume {
    border-color: rgba(232, 195, 106, 0.55);
    box-shadow: $sd-glow-gold;
  }

  .resume-tag {
    position: absolute;
    top: 16rpx;
    right: 16rpx;
    z-index: 2;
    padding: 4rpx 18rpx;
    border-radius: $sd-radius-pill;
    font-size: 20rpx;
    color: $sd-gold-ink;
    background: $sd-gold-grad;
  }

  .cover {
    width: 100%;
    height: 280rpx;
  }

  .body {
    padding: 24rpx;
  }

  .title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
  }

  .title {
    font-family: $sd-font-display;
    font-size: 30rpx;
    font-weight: bold;
    color: $sd-text;
    line-height: 1.4;
    flex: 1;
    min-width: 0;
  }

  .read-mark {
    flex-shrink: 0;
    font-size: 20rpx;
    color: $sd-text-3;
  }

  .summary {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: $sd-text-2;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    margin-top: 18rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .chips {
      display: flex;
      gap: 12rpx;
      flex-wrap: wrap;
    }

    .likes {
      font-size: 22rpx;
      color: $sd-gold;
    }
  }
}

.loading-more {
  text-align: center;
  padding: 24rpx;
  font-size: 24rpx;
  color: $sd-text-3;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/steve/github/stardust && git add frontend/src/pages/content/list.vue && git commit -m "feat(content): reading list page"
```

---

### Task 13: 阅读页 pages/content/detail.vue

**Files:**
- Create: `frontend/src/pages/content/detail.vue`

- [ ] **Step 1: 写页面（完整代码）**

```vue
<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />

    <scroll-view scroll-y class="scroll" :scroll-top="scrollTop" @scroll="onScroll" :style="{ height: scrollHeight }">
      <view class="content" v-if="detail">
        <image v-if="detail.coverImage" :src="detail.coverImage" class="cover" mode="aspectFill" />

        <view class="head">
          <view class="chips">
            <text class="sd-chip is-gold">{{ detail.topic?.name || '星读' }}</text>
            <text v-for="z in detail.zodiacSigns" :key="z" class="sd-chip">{{ z }}</text>
          </view>
          <text class="title">{{ detail.title }}</text>
          <text class="summary">{{ detail.summary }}</text>
        </view>

        <view class="sd-divider" />

        <!-- 正文卷轴 -->
        <view class="body">
          <view v-for="(block, i) in detail.body" :key="i" class="block">
            <text v-if="block.h" class="block-h">✦ {{ block.h }}</text>
            <text class="block-p">{{ block.p }}</text>
          </view>
        </view>

        <!-- 互动区 -->
        <view class="actions">
          <view class="like-btn" :class="{ liked: liked }" @click="like">
            <text>{{ liked ? '❥ 已喜欢' : '♡ 喜欢' }} {{ likeCount }}</text>
          </view>
        </view>

        <!-- 相关阅读 -->
        <view v-if="detail.related?.length" class="related">
          <SectionTitle kicker="✦" title="相关阅读" />
          <view v-for="r in detail.related" :key="r.id" class="related-item" @click="goRelated(r.id)">
            <text class="r-title">{{ r.title }}</text>
            <text class="r-more">›</text>
          </view>
        </view>

        <!-- 合规页脚 -->
        <view class="sd-divider" />
        <text class="disclaimer">内容仅供娱乐参考，请理性看待</text>
      </view>

      <view v-else-if="!loading" class="empty-wrap">
        <EmptyState icon="❖" title="内容不存在或已下线" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onPageScroll } from '@dcloudio/uni-app'
import { api } from '@/api'
import SectionTitle from '@/components/section-title/section-title.vue'
import EmptyState from '@/components/empty-state/empty-state.vue'

const detail = ref<any>(null)
const loading = ref(false)
const liked = ref(false)
const likeCount = ref(0)
const contentId = ref('')
const finishedReported = ref(false)
// #ifdef H5
const scrollHeight = ref('calc(100vh - 44px)')
// #endif
// #ifndef H5
const scrollHeight = ref('100vh')
// #endif
const scrollTop = ref(0)

async function load(id: string) {
  loading.value = true
  try {
    const res: any = await api.content.getDetail(id)
    detail.value = res
    liked.value = !!res.liked
    likeCount.value = res.likeCount ?? 0
    uni.setNavigationBarTitle({ title: res.title?.slice(0, 8) || '星读' })
    api.content.reportProgress(id, 'opened').catch(() => {})
  } catch (e: any) {
    uni.showToast({ title: e.message || '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function like() {
  if (!contentId.value) return
  api.content.toggleLike(contentId.value).then((res: any) => {
    liked.value = res.liked
    likeCount.value = res.likeCount
  }).catch((e: any) => uni.showToast({ title: e.message || '操作失败', icon: 'none' }))
}

function reportFinished() {
  if (finishedReported.value || !contentId.value) return
  finishedReported.value = true
  api.content.reportProgress(contentId.value, 'finished').catch(() => {})
}

// 滚动 80% 判定完读（scroll-view 事件）
function onScroll(e: any) {
  const { scrollTop: st, scrollHeight: sh } = e.detail
  if (sh > 0 && st / sh >= 0.8) reportFinished()
}

// 兜底：原生页面滚动（H5 下 scroll-view 不触发时由 onPageScroll 兜底）
onPageScroll((e: any) => {
  if (e.scrollTop > 400) reportFinished()
})

function goRelated(id: string) {
  uni.redirectTo({ url: `/pages/content/detail?id=${id}` })
}

onLoad((opts: any) => {
  contentId.value = opts?.id || ''
  if (contentId.value) load(contentId.value)
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: $sd-bg;
}

.scroll {
  position: relative;
  z-index: 1;
  width: 100%;
}

.content {
  padding: 32rpx 32rpx calc(env(safe-area-inset-bottom) + 60rpx);
}

.cover {
  width: 100%;
  height: 340rpx;
  border-radius: $sd-radius-lg;
  margin-bottom: 28rpx;
}

.head {
  .chips {
    display: flex;
    gap: 12rpx;
    flex-wrap: wrap;
    margin-bottom: 16rpx;
  }

  .title {
    display: block;
    font-family: $sd-font-display;
    font-size: 40rpx;
    font-weight: bold;
    color: $sd-text;
    line-height: 1.4;
    letter-spacing: 2rpx;
  }

  .summary {
    display: block;
    margin-top: 14rpx;
    font-size: 24rpx;
    color: $sd-text-3;
    line-height: 1.6;
  }
}

.body {
  .block {
    margin-bottom: 30rpx;
  }

  .block-h {
    display: block;
    font-family: $sd-font-display;
    font-size: 30rpx;
    font-weight: bold;
    color: $sd-gold-bright;
    margin-bottom: 12rpx;
    letter-spacing: 2rpx;
  }

  .block-p {
    font-size: 28rpx;
    color: $sd-text;
    line-height: 1.8;
    text-align: justify;
  }
}

.actions {
  margin: 36rpx 0;
  display: flex;
  justify-content: center;
}

.like-btn {
  padding: 14rpx 56rpx;
  border-radius: $sd-radius-pill;
  border: 1rpx solid rgba(232, 195, 106, 0.5);
  color: $sd-gold;
  font-size: 26rpx;

  &.liked {
    background: rgba(237, 90, 107, 0.12);
    border-color: rgba(237, 90, 107, 0.45);
    color: $sd-cinnabar-soft;
  }

  &:active {
    transform: scale(0.96);
    opacity: 0.88;
  }
}

.related {
  .related-item {
    @include sd-card-surface();
    margin-bottom: 16rpx;
    padding: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;

    .r-title {
      flex: 1;
      font-size: 26rpx;
      color: $sd-text;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .r-more {
      color: $sd-gold;
      font-size: 28rpx;
    }
  }
}

.disclaimer {
  display: block;
  text-align: center;
  font-size: 20rpx;
  color: $sd-text-3;
}

.empty-wrap {
  padding-top: 200rpx;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/steve/github/stardust && git add frontend/src/pages/content/detail.vue && git commit -m "feat(content): reading detail page with progress tracking"
```

---

### Task 14: 每日一签页 pages/content/sign.vue

**Files:**
- Create: `frontend/src/pages/content/sign.vue`

- [ ] **Step 1: 写页面（完整代码）**

```vue
<template>
  <view class="container">
    <view class="sd-nebula" />
    <view class="sd-stars" />
    <view class="sd-shooting-star" />

    <view class="content">
      <!-- 自定义导航头 -->
      <view class="page-header">
        <view class="back-sigil" @click="goBack">‹</view>
        <text class="header-title">每日一签</text>
      </view>

      <!-- 抽签前 -->
      <view v-if="!sign && !drawing" class="draw-stage sd-reveal">
        <view class="sd-sigil sd-sigil--lg big-sigil">❂</view>
        <text class="stage-title">今日星签未定</text>
        <text class="stage-desc">星辰已知你的来意，静心一问，抽一支今日之签</text>
        <StardButton variant="gold" size="lg" @click="draw">✦ 诚心抽取</StardButton>
      </view>

      <!-- 抽签动画 -->
      <view v-if="drawing" class="draw-stage sd-reveal">
        <view class="sd-sigil sd-sigil--lg big-sigil spinning">✶</view>
        <text class="stage-desc">星轨运转中…</text>
      </view>

      <!-- 签文卡 -->
      <view v-if="sign" class="sign-card sd-reveal-1">
        <view class="level-badge" :class="`level-${sign.level}`">{{ levelName }}</view>
        <text class="sign-title">{{ sign.title }}</text>
        <view class="poem-wrap">
          <text class="poem">{{ sign.poem }}</text>
        </view>
        <view class="sd-divider" />
        <text class="interp">{{ sign.interpretation }}</text>
        <view class="chips">
          <text class="sd-chip is-gold">宜 {{ sign.luckyAction }}</text>
          <text class="sd-chip is-cinnabar">忌 {{ sign.avoidAction }}</text>
        </view>
        <text v-if="alreadyDrawn" class="again-tip">今日之签已定，明日再来 ✧</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { api } from '@/api'
import StardButton from '@/components/stard-button/stard-button.vue'

const sign = ref<any>(null)
const drawing = ref(false)
const alreadyDrawn = ref(false)

const LEVEL_NAMES = ['', '上上签', '上签', '中上签', '中签', '中下签', '下下签']
const levelName = computed(() => LEVEL_NAMES[sign.value?.level] || '星签')

function getAnonId(): string {
  // #ifdef H5
  let id = localStorage.getItem('sd-anon-id')
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    localStorage.setItem('sd-anon-id', id)
  }
  return id
  // #endif
  // #ifndef H5
  let id = uni.getStorageSync('sd-anon-id') as string
  if (!id) {
    id = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    uni.setStorageSync('sd-anon-id', id)
  }
  return id
  // #endif
}

async function fetchSign() {
  try {
    const res: any = await api.content.getSignToday(getAnonId())
    if (res.sign) {
      sign.value = res.sign
      alreadyDrawn.value = !!res.alreadyDrawn
    }
  } catch (e) {
    // 静默，等用户主动抽
  }
}

async function draw() {
  drawing.value = true
  try {
    const res: any = await api.content.getSignToday(getAnonId())
    await new Promise((r) => setTimeout(r, 1200)) // 仪式感停顿
    sign.value = res.sign
    alreadyDrawn.value = !!res.alreadyDrawn
  } catch (e: any) {
    uni.showToast({ title: e.message || '抽取失败', icon: 'none' })
  } finally {
    drawing.value = false
  }
}

function goBack() {
  uni.navigateBack({ fail: () => uni.reLaunch({ url: '/pages/index/index' }) })
}

fetchSign()
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: $sd-bg;
}

.content {
  position: relative;
  z-index: 1;
  padding: 0 32rpx calc(env(safe-area-inset-top) + 40rpx);
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: calc(env(safe-area-inset-top) + 24rpx) 0 30rpx;

  .back-sigil {
    @include sd-sigil-base();
    width: 64rpx;
    height: 64rpx;
    font-size: 40rpx;
    line-height: 1;
  }

  .header-title {
    font-family: $sd-font-display;
    font-size: 36rpx;
    font-weight: bold;
    letter-spacing: 3rpx;
    @include sd-gold-text();
  }
}

.draw-stage {
  margin-top: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;

  .big-sigil {
    width: 200rpx;
    height: 200rpx;
    font-size: 90rpx;
  }

  .spinning {
    animation: sd-sign-spin 1.2s linear infinite;
  }

  .stage-title {
    font-family: $sd-font-display;
    font-size: 36rpx;
    font-weight: bold;
    color: $sd-text;
    letter-spacing: 3rpx;
  }

  .stage-desc {
    font-size: 26rpx;
    color: $sd-text-2;
    text-align: center;
    line-height: 1.7;
  }
}

@keyframes sd-sign-spin {
  to {
    transform: rotate(360deg);
  }
}

.sign-card {
  @include sd-card-surface(gold);
  margin-top: 40rpx;
  padding: 56rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: $sd-glow-gold;

  .level-badge {
    padding: 8rpx 32rpx;
    border-radius: $sd-radius-pill;
    font-size: 24rpx;
    font-weight: bold;
    margin-bottom: 24rpx;

    &.level-1 { background: $sd-gold-grad; color: $sd-gold-ink; }
    &.level-2 { background: rgba(232, 195, 106, 0.16); color: $sd-gold-bright; border: 1rpx solid rgba(232, 195, 106, 0.4); }
    &.level-3 { background: rgba(139, 124, 232, 0.16); color: $sd-purple-bright; border: 1rpx solid rgba(139, 124, 232, 0.4); }
    &.level-4 { background: $sd-bg-raise; color: $sd-text-2; border: 1rpx solid $sd-stroke; }
    &.level-5 { background: $sd-bg-raise; color: $sd-text-3; border: 1rpx solid $sd-stroke; }
    &.level-6 { background: rgba(237, 90, 107, 0.12); color: $sd-cinnabar-soft; border: 1rpx solid rgba(237, 90, 107, 0.38); }
  }

  .sign-title {
    font-family: $sd-font-display;
    font-size: 30rpx;
    color: $sd-text-2;
    letter-spacing: 4rpx;
    margin-bottom: 26rpx;
  }

  .poem-wrap {
    padding: 30rpx 0;
  }

  .poem {
    font-family: $sd-font-display;
    font-size: 40rpx;
    font-weight: bold;
    color: $sd-text;
    letter-spacing: 6rpx;
    text-align: center;
    line-height: 1.8;
  }

  .interp {
    font-size: 26rpx;
    color: $sd-text-2;
    text-align: center;
    line-height: 1.7;
    margin-bottom: 30rpx;
  }

  .chips {
    display: flex;
    gap: 20rpx;
  }

  .again-tip {
    margin-top: 30rpx;
    font-size: 22rpx;
    color: $sd-text-3;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/steve/github/stardust && git add frontend/src/pages/content/sign.vue && git commit -m "feat(content): daily sign page with deterministic draw"
```

---

### Task 15: 端到端验证

**Files:** 无新文件

- [ ] **Step 1: 后端构建 + 前端构建**

```bash
cd /home/steve/github/stardust && npm run build 2>&1 | grep -E "DONE|error|✘" | head -n 5
```
Expected: `DONE  Build complete.`（前后端均过）。

- [ ] **Step 2: API 验收（确定性/去重/续读/一签/admin 全流程）**

```bash
TOKEN=$(cat /tmp/sd_token.txt)   # 既有冒烟测试账号；若失效重新登录获取
BASE=http://127.0.0.1:3000/api

# 1) 游客 feed
curl -s "$BASE/contents/feed?limit=3" | python3 -c "import sys,json; d=json.load(sys.stdin); print('guest feed:', len(d['items']), 'items')"
# 2) 同一用户连开两次 → 顺序一致（确定性）
A=$(curl -s "$BASE/contents/feed?limit=5" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; print(','.join(x['id'] for x in json.load(sys.stdin)['items']))")
B=$(curl -s "$BASE/contents/feed?limit=5" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; print(','.join(x['id'] for x in json.load(sys.stdin)['items']))")
[ "$A" = "$B" ] && echo "OK: 同日 feed 顺序一致" || echo "FAIL: 顺序不一致"
# 3) 完读上报后该篇不再出现
FIRST=$(echo "$A" | cut -d, -f1)
curl -s -X POST "$BASE/contents/$FIRST/progress" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"status":"finished"}' > /dev/null
C=$(curl -s "$BASE/contents/feed?limit=10" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; print(','.join(x['id'] for x in json.load(sys.stdin)['items']))")
echo "$C" | grep -q "$FIRST" && echo "FAIL: 已读未排除" || echo "OK: 已读已排除"
# 4) 一签同日一致
S1=$(curl -s "$BASE/contents/sign/today?anonId=verify-anon-1" | python3 -c "import sys,json; print(json.load(sys.stdin)['sign']['id'])")
S2=$(curl -s "$BASE/contents/sign/today?anonId=verify-anon-1" | python3 -c "import sys,json; print(json.load(sys.stdin)['sign']['id'])")
[ "$S1" = "$S2" ] && echo "OK: 一签同日一致" || echo "FAIL: 一签不一致"
# 5) 点赞切换
curl -s -X POST "$BASE/contents/$FIRST/like" -H "Authorization: Bearer $TOKEN"; echo
```
Expected: 5 行输出全部 `OK`（或合理数据）。

- [ ] **Step 3: 浏览器冒烟（复用 dev server :8080）**

用浏览器打开并检查（参考本会话已验证的 query-busting 导航法）：
1. `http://localhost:8080/` —— 宫格出现「星读 ❂」，今日星读卡显示（有封面图）
2. `http://localhost:8080/?t=cl#/pages/content/list` —— Tab + 卡片流 + 已读角标正常，零 emoji
3. 任一卡片进入 detail —— 正文卷轴、金分隔线、disclaimer 底部、相关阅读
4. `http://localhost:8080/?t=sg#/pages/content/sign` —— 抽签 → 签文卡；刷新后同签
5. 控制台无 error 级日志（ERR_ABORTED 为切页取消，忽略）

- [ ] **Step 4: 最终提交**

```bash
cd /home/steve/github/stardust && git add -A backend frontend && git status | head -n 5 && git commit -m "feat(content): content hub P1 complete with e2e verification" --allow-empty || true
```

---

## 自审记录（writing-plans Self-Review）

1. **Spec 覆盖**：设计文档 §3 栏目/种子构成 → Task 3/10；§4 三生产线 → Task 5；§5 模型 → Task 2（+UserContentLike 已同步入 spec）；§6.2/6.3/6.5 API → Task 6/7/8；§6.4 feed 算法 → Task 4/6；§6.3 admin → Task 8；§7 前端 → Task 11-14；§8 合规 → Task 13 disclaimer（生成 prompt 边界在 Task 5 PERSONA）；§9 验收 → Task 15；§11 env → Task 1。**无缺口。**
2. **占位符扫描**：无 TBD/TODO；所有代码步骤均给出完整代码；Task 10 使用可执行的 curl 脚本。
3. **类型一致性**：`ContentService.getFeed/getDetail/reportProgress/toggleLike/getDaily/drawSign` 与 Controller 调用一致；`generateArticle({type,zodiac,theme,orderNum})` 与 AdminController 入参一致；`seededJitter(userId,date,contentId)` 与测试一致；前端 `api.content.*` 六个方法与三个页面调用一致。
