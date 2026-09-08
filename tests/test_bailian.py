#!/usr/bin/env python3
"""验证新百炼 MaaS 专属实例: 文本 / 视觉 / 文生图任务创建"""
import base64, json, urllib.request

KEY = ""
HOST = ""
for line in open("/home/steve/github/stardust/backend/.env"):
    line = line.strip()
    if line.startswith("DASHSCOPE_API_KEY="):
        KEY = line.split("=", 1)[1].strip().strip('"')
    if line.startswith("DASHSCOPE_API_HOST="):
        HOST = line.split("=", 1)[1].strip().strip('"')

def post(url, payload, extra=None, timeout=90):
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {KEY}"}
    if extra:
        headers.update(extra)
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:300]

# 1. 文本模型
st, d = post(f"{HOST.replace('/api/v1','')}/compatible-mode/v1/chat/completions",
             {"model": "qwen3.7-plus", "messages": [{"role": "user", "content": "回复ok"}], "max_tokens": 8})
print("TEXT qwen3.7-plus:", st, str(d)[:150])

# 2. 视觉模型
b64 = base64.b64encode(open("/home/steve/github/stardust/tests/demo人脸.jpg", "rb").read()).decode()
st, d = post(f"{HOST.replace('/api/v1','')}/compatible-mode/v1/chat/completions",
             {"model": "qwen3-vl-32b-thinking",
              "messages": [{"role": "user", "content": [
                  {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                  {"type": "text", "text": "一句话描述图片"}]}],
              "max_tokens": 60})
print("VISION qwen3-vl-32b:", st, str(d)[:150])

# 3. 文生图任务创建 (DashScope 原生异步)
st, d = post(f"{HOST}/services/aigc/text2image/image-synthesis",
             {"model": "wan2.7-i2v", "input": {"prompt": "星空下的少女, 唯美插画"},
              "parameters": {"size": "1024*1024", "n": 1}},
             extra={"X-DashScope-Async": "enable"}, timeout=60)
print("T2I wan2.7-i2v:", st, str(d)[:200])
