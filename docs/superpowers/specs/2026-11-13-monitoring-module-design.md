# 星契集每日监控模块设计（2026-11-13）

## 背景与目标

需要一个独立于业务代码的监控模块，每天早上 08:00（北京时间）自动运行一次，将以下数据整理成邮件发送到 suyong07@qq.com：

1. **访问量报告**：昨日 + 前 3 天（共 4 天）的站点访问数据
2. **大模型健康检查**：对系统用到的每个大模型自动调用一次，验证模型是否正常

## 决策记录（用户确认）

| 决策点 | 选择 |
|---|---|
| 部署形态 | 后端独立 MonitoringModule（复用现有镜像与部署管线） |
| 发件邮箱 | QQ 邮箱 SMTP 授权码（smtp.qq.com:465） |
| 统计窗口 | 昨天 + 前 3 天（共 4 天），以昨天为基准日 |
| 发送时间 | 每天 08:00 北京时间（cron `0 0 * * *` UTC） |

## 架构

```
backend/src/modules/monitoring/
├── monitoring.module.ts           # 模块定义，注册进 app.module.ts
├── monitoring.service.ts          # 编排：取数 → 探活 → 渲染 → 发信
├── umami-stats.service.ts         # 直连 umami-db postgres 查访问量
├── llm-health.service.ts          # 三个模型逐一最小调用探活
├── mailer.service.ts              # nodemailer + QQ SMTP 发信
├── monitoring.cron.ts             # 每日 08:00 北京时间触发
├── monitoring-admin.controller.ts # POST /api/admin/monitoring/run 手动触发（AdminGuard）
└── monitoring-report.util.ts      # 邮件 HTML 渲染纯函数（可单测）
```

### 解耦保证

- 不 import 任何业务模块（content/auth/face/…），业务代码零改动（仅 app.module.ts 注册一行）
- 只依赖：ConfigService、原生 fetch、pg（umami 只读查询）、nodemailer
- `MONITOR_ENABLED` 开关：服务器 true，本地 dev 不设即不跑

## 访问量统计（umami-stats.service）

站点前端已接入自托管 umami（stats.xingqiji.xyz，website_id=4f71f42e-a401-4629-b672-9e358f6425ad，2026-09-10 起有数据）。umami-db（postgres）与后端同在 stardust_stardust_network，可直连。

```sql
SELECT date(created_at AT TIME ZONE 'Asia/Shanghai') AS d,
       count(*)                   AS pv,      -- 浏览量
       count(DISTINCT session_id) AS uv,      -- 独立访客
       count(DISTINCT visit_id)   AS visits   -- 访问次数
FROM website_event
WHERE website_id = $1
  AND created_at >= <昨天-3天的北京0点，转UTC>
  AND created_at <  <今天的北京0点，转UTC>
GROUP BY 1 ORDER BY 1 DESC;
```

- 无数据日期补 0 行，保证 4 天完整
- 查询失败 → 邮件该节显示「数据暂不可用 + 原因」，不阻断其他部分
- pg Pool 用完即关（每日一次，无需常驻连接）

## 大模型健康检查（llm-health.service）

系统实际配置 3 个模型，探活复用现有 env：

| 模型 | env 前缀 | 用途 | 探活方式 |
|---|---|---|---|
| doubao-seed-2.1-lite | XIAOMIMIMO_* | 7 个业务的主文本模型 | POST {url}/chat/completions，messages=[{role:'user',content:'ping'}]，max_tokens 最小 |
| doubao-seedream-5.0-pro | ARK_T2I_* | 封面/头像文生图 | POST {url}，最小尺寸生成 1 张图 |
| qwen3-vl-32b-thinking | DASHSCOPE_* | 面相手相兜底 | POST {url}/chat/completions，同文本探活 |

- 未配置 key 的模型标记「未配置，跳过」
- `Promise.allSettled` 并行，单个失败不影响整体
- 30s 超时（AbortController）；记录：模型名、用途、状态（正常/异常）、耗时 ms、错误摘要（截断）
- 响应 2xx 且结构符合预期（chat 有 choices / 图片有 data）判为正常

## 邮件（mailer.service + monitoring-report.util）

- nodemailer，smtp.qq.com:465（SSL），账号 MONITOR 用 env：SMTP_USER + SMTP_PASS（授权码）
- 收件人 `MONITOR_MAIL_TO=suyong07@qq.com`
- 主题：`【星契集监控】YYYY-MM-DD 日报`
- HTML 邮件：暗色星空风表头（#0b0e1a 底、#e8c36a 金标题），两节内容：
  - 访问量表格（日期/PV/独立访客/访问次数/环比），环比列：与前一天对比百分比
  - 模型健康表（模型/用途/状态/耗时/错误摘要），异常行红色高亮
- 纯文本降级 altBody（QQ 邮箱等客户端不支持 HTML 时兜底）
- 渲染逻辑放 `monitoring-report.util.ts` 纯函数，输入 stats + llm results，输出 {subject, html, text}

## 配置（全部 env，不入 git）

```
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=<发件QQ邮箱>
SMTP_PASS=<授权码>
MONITOR_MAIL_TO=suyong07@qq.com
MONITOR_ENABLED=true
UMAMI_DB_URL=postgresql://umami:***@umami-db:5432/umami
UMAMI_WEBSITE_ID=4f71f42e-a401-4629-b672-9e358f6425ad
```

模型探活复用现有 XIAOMIMIMO_* / ARK_T2I_* / DASHSCOPE_* env，不重复配置。

## 错误处理

| 故障 | 行为 |
|---|---|
| umami 查询失败 | 邮件访问量节显示「数据暂不可用」+ 错误摘要，正常发信 |
| 单模型探活失败/超时 | 该模型标「异常」+ 错误摘要，不影响其他模型 |
| SMTP 发送失败 | 后端 ERROR 日志记录（次日 cron 重试天然存在） |
| 任一节失败 | 不阻断其他节（allSettled 模式） |

## 测试

- 单测（monitoring-report.util + 窗口计算）：
  - 日期窗口：北京时区边界（UTC 16:00 切日）、4 天补 0
  - HTML 渲染：正常/异常/缺数据三种输入的输出断言（关键行、异常高亮、环比）
- E2E：部署后调 POST /api/admin/monitoring/run（带 ADMIN_TOKEN）→ 真实邮箱收信验证

## 部署

- backend 镜像重建为 v20261114，新增依赖 nodemailer、pg
- recreate-backend.sh 增补 env：SMTP_*、MONITOR_*、UMAMI_*
- 前端无改动
