/** 星契集 · 星座与五行共享工具（夜观星象主题配色） */

export interface ElementMeta {
  key: string
  name: string
  color: string
}

/** 五行元数据（暗色主题适配色） */
export const ELEMENTS: ElementMeta[] = [
  { key: 'wood', name: '木', color: '#6fbf8f' },
  { key: 'fire', name: '火', color: '#e8735e' },
  { key: 'earth', name: '土', color: '#c09a6b' },
  { key: 'metal', name: '金', color: '#d9c08a' },
  { key: 'water', name: '水', color: '#6a9bd8' },
]

/** 黄道十二宫符号 */
export const ZODIAC_SYMBOLS: Record<string, string> = {
  白羊座: '♈',
  金牛座: '♉',
  双子座: '♊',
  巨蟹座: '♋',
  狮子座: '♌',
  处女座: '♍',
  天秤座: '♎',
  天蝎座: '♏',
  射手座: '♐',
  摩羯座: '♑',
  水瓶座: '♒',
  双鱼座: '♓',
}

export function zodiacSymbol(sign?: string | null): string {
  if (!sign) return '✦'
  return ZODIAC_SYMBOLS[sign] || '✦'
}

/** 解析用户 fiveElements JSON 字符串为计数表 */
export function parseFiveElements(raw?: string | null): Record<string, number> {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    const out: Record<string, number> = {}
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'number' && Number.isFinite(v)) out[k] = v
    }
    return out
  } catch {
    return {}
  }
}

/** 主导五行 */
export function dominantElement(raw?: string | null): ElementMeta | null {
  const elements = parseFiveElements(raw)
  const entries = Object.entries(elements).sort((a, b) => b[1] - a[1])
  const key = entries[0]?.[0]
  if (!key) return null
  return ELEMENTS.find((e) => e.key === key) || null
}

/** 按计数降序返回出现的五行 */
export function activeElements(raw?: string | null): Array<ElementMeta & { count: number }> {
  const elements = parseFiveElements(raw)
  return ELEMENTS.filter((e) => (elements[e.key] || 0) > 0)
    .map((e) => ({ ...e, count: elements[e.key] }))
    .sort((a, b) => b.count - a.count)
}
