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
  continueId: string | null;  // 连载续读置顶
}

/** 北京日期 yyyy-MM-dd（纯函数，供生成/服务层共用） */
export function beijingDate(d = new Date()): string {
  return new Date(d.getTime() + 8 * 3600_000).toISOString().slice(0, 10);
}

/** cursor 定位：返回下一页起点（无 cursor 或未命中回首页 0） */
export function locateCursor(ranked: FeedCandidate[], cursor?: string | null): number {
  if (!cursor) return 0;
  const idx = ranked.findIndex((c) => c.id === cursor);
  return idx >= 0 ? idx + 1 : 0;
}

/**
 * 探索位抽取：从未上页且满足 untouched 条件的剩余候选中随机抽取。
 * 返回的探索项由调用方追加到页尾，但【不推进 nextCursor】——否则下一页 start
 * 会越过主列表中段，造成内容被整段跳过。
 */
export function pickExploration(
  ranked: FeedCandidate[],
  start: number,
  limit: number,
  slots: number,
  untouched: (c: FeedCandidate) => boolean,
  excludeIds: Set<string>,
  rng: () => number = Math.random,
): FeedCandidate[] {
  const poolRange = ranked.slice(start + limit);
  const picks: FeedCandidate[] = [];
  for (let i = 0; i < slots; i++) {
    const pool = poolRange.filter(
      (c) => !excludeIds.has(c.id) && !picks.some((p) => p.id === c.id) && untouched(c),
    );
    if (!pool.length) break;
    picks.push(pool[Math.floor(rng() * pool.length)]);
  }
  return picks;
}

/** 确定性随机：同用户同日稳定，异用户/次日自然变化 */
export function seededJitter(userId: string, date: string, contentId: string): number {
  const h = createHash('sha256').update(`${userId}:${date}:${contentId}`).digest('hex');
  return parseInt(h.slice(0, 8), 16) / 0x100000000;
}

export function baseScore(c: FeedCandidate, now: Date): number {
  const like = Math.log(1 + c.likeCount);
  const finishRate = c.viewCount > 0 ? c.finishCount / c.viewCount : 0;
  const ageHours = (now.getTime() - c.publishAt.getTime()) / 3_600_000;
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
