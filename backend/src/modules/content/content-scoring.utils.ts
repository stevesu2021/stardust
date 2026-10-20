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
