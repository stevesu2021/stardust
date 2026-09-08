#!/usr/bin/env python3
"""测试方舟 coding 端点是否支持图片输入（multimodal）"""
import base64, json, urllib.request

with open("/home/steve/github/stardust/tests/demo人脸.jpg", "rb") as f:
    b64 = base64.b64encode(f.read()).decode()

key = ""
for line in open("/home/steve/github/stardust/backend/.env"):
    if line.startswith("XIAOMIMIMO_API_KEY="):
        key = line.split("=", 1)[1].strip().strip('"')
        break

payload = {
    "model": "doubao-seed-2.0-lite",
    "messages": [{
        "role": "user",
        "content": [
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
            {"type": "text", "text": "一句话描述图片"},
        ],
    }],
    "max_tokens": 100,
}
req = urllib.request.Request(
    "https://ark.cn-beijing.volces.com/api/coding/v3/chat/completions",
    data=json.dumps(payload).encode(),
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
)
try:
    with urllib.request.urlopen(req, timeout=60) as r:
        d = json.loads(r.read())
        print("OK:", json.dumps(d.get("choices", [{}])[0].get("message", {}).get("content", ""), ensure_ascii=False)[:200])
except urllib.error.HTTPError as e:
    print("HTTP", e.code, ":", e.read().decode()[:300])
except Exception as e:
    print("ERR:", e)
