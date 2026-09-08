#!/usr/bin/env python3
"""测试新实例的 OpenAI 兼容同步 images 接口"""
import json, urllib.request

KEY = ""
for line in open("/home/steve/github/stardust/backend/.env"):
    if line.strip().startswith("DASHSCOPE_API_KEY="):
        KEY = line.split("=", 1)[1].strip().strip('"')

HOST = "https://ws-kwk6ck8mjkdc07ua.cn-beijing.maas.aliyuncs.com"
payload = {"model": "wan2.7-i2v", "prompt": "星空下的少女, 唯美插画", "size": "1024*1024", "n": 1}
req = urllib.request.Request(
    f"{HOST}/compatible-mode/v1/images/generations",
    data=json.dumps(payload).encode(),
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {KEY}"},
)
try:
    with urllib.request.urlopen(req, timeout=180) as r:
        d = json.loads(r.read())
        url = d.get("data", [{}])[0].get("url", "")
        print("OK:", r.status, "| image url:", url[:100])
except urllib.error.HTTPError as e:
    print("HTTP", e.code, ":", e.read().decode()[:300])
except Exception as e:
    print("ERR:", e)
