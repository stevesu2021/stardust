#!/usr/bin/env python3
"""同步服务器 backend.env: 用本地 .env 的 AI 配置更新服务器 env 文件(其余键保持不动)"""
import re

LOCAL = "/home/steve/github/stardust/backend/.env"
REMOTE = "/tmp/backend.env.remote"

local_kv = {}
for line in open(LOCAL):
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    k, v = line.split("=", 1)
    local_kv[k.strip()] = v.strip().strip('"')

# 需要同步到服务器的 AI 配置键
SYNC_KEYS = [
    "XIAOMIMIMO_API_KEY", "XIAOMIMIMO_API_URL", "XIAOMIMIMO_MODEL",
    "DASHSCOPE_API_KEY", "DASHSCOPE_BASE_URL", "DASHSCOPE_MODEL",
    "DASHSCOPE_TEXT_MODEL", "DASHSCOPE_T2I_MODEL", "DASHSCOPE_API_HOST",
]

out = []
seen = set()
for line in open(REMOTE):
    line = line.rstrip("\n")
    m = re.match(r"^([A-Z_]+)=", line)
    if m and m.group(1) in SYNC_KEYS:
        k = m.group(1)
        if k in local_kv:
            out.append(f"{k}={local_kv[k]}")
            seen.add(k)
            continue
        # 键在服务器但本地没有(旧键且本地已删) -> 删除
        out.append(f"#{DELETED_SYNC_PLACEHOLDER} {line}" if False else f"# removed in v20260908 sync: {line}")
        continue
    if line.startswith("# removed in v20260908 sync:"):
        # 旧占位行直接丢弃
        m2 = re.search(r"^([A-Z_]+)=", line.split(": ", 1)[1] if ": " in line else "")
        continue
    out.append(line)

# 追加服务器上不存在的新键
for k in SYNC_KEYS:
    if k not in seen and k in local_kv:
        out.append(f"{k}={local_kv[k]}")

open(REMOTE, "w").write("\n".join(out) + "\n")
print("updated keys:", sorted(seen))
print("appended new keys:", [k for k in SYNC_KEYS if k not in seen and k in local_kv])
