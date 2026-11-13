// backend/src/modules/monitoring/llm-health.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmCheckResult } from './monitoring-report.util';

const PROBE_TIMEOUT_MS = 30_000;

@Injectable()
export class LlmHealthService {
  constructor(private readonly config: ConfigService) {}

  /** 三模型并行探活；单个失败/超时只记结果，永不 reject。显示名取实际配置的模型名 */
  async checkAll(): Promise<LlmCheckResult[]> {
    return Promise.all([
      this.checkChat(
        '文本生成（主模型）',
        this.config.get<string>('XIAOMIMIMO_API_URL') || '',
        this.config.get<string>('XIAOMIMIMO_API_KEY') || '',
        this.config.get<string>('XIAOMIMIMO_MODEL') || '',
        'doubao(XIAOMIMIMO)',
      ),
      this.checkChat(
        '面相手相兜底',
        this.config.get<string>('DASHSCOPE_BASE_URL') || '',
        this.config.get<string>('DASHSCOPE_API_KEY') || '',
        this.config.get<string>('DASHSCOPE_MODEL') || '',
        'qwen(DASHSCOPE)',
      ),
      this.checkImage(
        '封面/头像配图',
        this.config.get<string>('ARK_T2I_URL') || '',
        this.config.get<string>('ARK_T2I_API_KEY') || '',
        this.config.get<string>('ARK_T2I_MODEL') || '',
        'seedream(ARK)',
      ),
    ]);
  }

  private async checkChat(usage: string, url: string, key: string, model: string, fallbackName: string): Promise<LlmCheckResult> {
    const name = model || fallbackName;
    if (!url || !key || !model) return { name, usage, ok: false, skipped: true, latencyMs: 0 };
    const t0 = Date.now();
    try {
      // max_tokens 256：兼容 thinking 类模型（推理链较长，过小会误报异常）
      const { ok, status, data } = await requestJsonWithTimeout(`${url.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 256, temperature: 0 }),
      });
      if (!ok) throw new Error(`http ${status}: ${JSON.stringify(data).slice(0, 150)}`);
      if (!data?.choices?.[0]?.message) throw new Error('响应缺少 choices[0].message');
      return { name, usage, ok: true, skipped: false, latencyMs: Date.now() - t0 };
    } catch (e: any) {
      return { name, usage, ok: false, skipped: false, latencyMs: Date.now() - t0, error: String(e?.message || e).slice(0, 200) };
    }
  }

  private async checkImage(usage: string, url: string, key: string, model: string, fallbackName: string): Promise<LlmCheckResult> {
    const name = model || fallbackName;
    if (!url || !key || !model) return { name, usage, ok: false, skipped: true, latencyMs: 0 };
    const t0 = Date.now();
    try {
      // 与生产 generateCover 相同参数（已知可用组合），只验证不出图内容
      const { ok, status, data } = await requestJsonWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model, prompt: '一枚金色五角星，深蓝纯色背景，极简', size: '1024x1024',
          response_format: 'url', watermark: false,
        }),
      });
      if (!ok) throw new Error(`http ${status}: ${JSON.stringify(data).slice(0, 150)}`);
      if (!data?.data?.[0]?.url && !data?.data?.[0]?.b64_json) throw new Error('响应缺少 data[0].url');
      return { name, usage, ok: true, skipped: false, latencyMs: Date.now() - t0 };
    } catch (e: any) {
      return { name, usage, ok: false, skipped: false, latencyMs: Date.now() - t0, error: String(e?.message || e).slice(0, 200) };
    }
  }
}

/** fetch + json 读取全程置于同一超时窗口（响应头快但 body 挂起也能及时中止） */
async function requestJsonWithTimeout(url: string, init: RequestInit): Promise<{ ok: boolean; status: number; data: any }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch (e: any) {
    if (e?.name === 'AbortError') throw new Error(`请求超时(${PROBE_TIMEOUT_MS / 1000}s)`);
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
