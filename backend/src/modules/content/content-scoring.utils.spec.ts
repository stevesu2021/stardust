import { baseScore, seededJitter, scoreFeed, beijingDate, locateCursor, pickExploration, FeedCandidate, FeedContext } from './content-scoring.utils';

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
  it('contentId 不同则结果不同', () => {
    expect(seededJitter('u1', '2026-10-17', 'c1')).not.toBe(seededJitter('u1', '2026-10-17', 'c2'));
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

describe('scoreFeed 补充断言（自审）', () => {
  it('excludedFinished 统计被排除数量', () => {
    const { excludedFinished } = scoreFeed(
      [mk({ id: 'a' }), mk({ id: 'b' }), mk({ id: 'c' })],
      ctx({ finishedIds: new Set(['a', 'c']) }),
      new Date(),
    );
    expect(excludedFinished).toBe(2);
  });
  it('activeTags 命中加权领先', () => {
    const tagged = mk({ id: 'tagged', tags: ['水逆'] });
    const plain = mk({ id: 'plain' });
    const { ranked } = scoreFeed([plain, tagged], ctx({ activeTags: ['水逆'] }), new Date());
    expect(ranked[0].id).toBe('tagged');
  });
  it('完播率高的内容排序领先', () => {
    const good = mk({ id: 'good', viewCount: 100, finishCount: 100 });
    const bad = mk({ id: 'bad', viewCount: 100, finishCount: 0 });
    const { ranked } = scoreFeed([bad, good], ctx(), new Date());
    expect(ranked[0].id).toBe('good');
  });
  it('同输入两次调用排序一致（端到端确定性）', () => {
    const cs = [mk({ id: 'a', likeCount: 3 }), mk({ id: 'b', likeCount: 5 })];
    const r1 = scoreFeed(cs, ctx(), new Date('2026-10-17T12:00:00Z'));
    const r2 = scoreFeed(cs, ctx(), new Date('2026-10-17T12:00:00Z'));
    expect(r1.ranked.map((c) => c.id)).toEqual(r2.ranked.map((c) => c.id));
  });
});

describe('scoreFeed 边界用例', () => {
  it('空候选集返回空列表', () => {
    const { ranked, excludedFinished } = scoreFeed([], ctx(), new Date());
    expect(ranked).toEqual([]);
    expect(excludedFinished).toBe(0);
  });
  it('全部已读时全部排除', () => {
    const { ranked, excludedFinished } = scoreFeed(
      [mk({ id: 'a' }), mk({ id: 'b' })],
      ctx({ finishedIds: new Set(['a', 'b']) }),
      new Date(),
    );
    expect(ranked).toEqual([]);
    expect(excludedFinished).toBe(2);
  });
  it('大分差（连载+10）在任意 seed 下恒置顶', () => {
    for (let i = 0; i < 50; i++) {
      const next = mk({ id: 'next' });
      const hot = mk({ id: 'hot', likeCount: 50 });
      const { ranked } = scoreFeed([hot, next], ctx({ userId: `u${i}`, continueId: 'next' }), new Date());
      expect(ranked[0].id).toBe('next');
    }
  });
});

describe('beijingDate', () => {
  it('UTC 时间转北京日期', () => {
    expect(beijingDate(new Date('2026-10-19T16:30:00Z'))).toBe('2026-10-20');
    expect(beijingDate(new Date('2026-10-19T01:30:00Z'))).toBe('2026-10-19');
  });
});

describe('locateCursor', () => {
  const cs = [mk({ id: 'a' }), mk({ id: 'b' }), mk({ id: 'c' })];
  it('无 cursor 回首页', () => {
    expect(locateCursor(cs, null)).toBe(0);
    expect(locateCursor(cs, undefined)).toBe(0);
  });
  it('命中返回下一位置', () => {
    expect(locateCursor(cs, 'b')).toBe(2);
  });
  it('未命中回首页', () => {
    expect(locateCursor(cs, 'zz')).toBe(0);
  });
});

describe('pickExploration', () => {
  const cs = Array.from({ length: 30 }, (_, i) => mk({ id: `c${i}`, topicId: i < 15 ? 't1' : 't2' }));
  it('只从未上页与未接触栏目取，数量受 slots 限制', () => {
    const picks = pickExploration(
      cs, 0, 10, 2,
      (c) => c.topicId === 't2',
      new Set(Array.from({ length: 10 }, (_, i) => `c${i}`)),
      () => 0.5,
    );
    expect(picks.length).toBe(2);
    for (const p of picks) {
      expect(p.topicId).toBe('t2');
      expect(['c10', 'c11', 'c12', 'c13', 'c14']).not.toContain(p.id);
    }
  });
  it('候选池空时返回空', () => {
    const picks = pickExploration(cs.slice(0, 5), 0, 10, 2, () => true, new Set());
    expect(picks).toEqual([]);
  });
});

describe('翻页契约（回归：探索项不推进游标）', () => {
  it('30 项 limit 10 翻 3 页全覆盖且无跳过', () => {
    const cs = Array.from({ length: 30 }, (_, i) => mk({ id: `c${i}` }));
    const seen: string[] = [];
    let cursor: string | null = null;
    for (let round = 0; round < 4; round++) {
      const start = locateCursor(cs, cursor);
      const mainPage = cs.slice(start, start + 10);
      if (!mainPage.length) break;
      seen.push(...mainPage.map((c) => c.id));
      cursor = mainPage.length < 10 ? null : mainPage[mainPage.length - 1].id;
      if (!cursor) break;
    }
    expect(seen).toEqual(cs.map((c) => c.id));
  });
});
