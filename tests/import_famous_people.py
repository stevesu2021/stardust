#!/usr/bin/env python3
"""解析 famous_people.md 并导入 stardust 后端"""
import json, re, urllib.request

MD = "/home/steve/github/stardust/famous_people.md"
URL = "http://127.0.0.1:3000/api/famous-people/import"

# 章节标题 -> category
CAT_MAP = {
    "科学": "科学技术", "政治": "政治军事", "商业": "商业领袖",
    "文学": "文学哲学", "艺术": "艺术影视", "体育": "体育其他",
}
ZODIAC_FIX = {"白羊": "白羊座", "金牛": "金牛座", "双子": "双子座", "巨蟹": "巨蟹座",
              "狮子": "狮子座", "处女": "处女座", "天秤": "天秤座", "天蝎": "天蝎座",
              "射手": "射手座", "摩羯": "摩羯座", "水瓶": "水瓶座", "双鱼": "双鱼座"}

category = "其他"
people = []

for line in open(MD, encoding="utf-8"):
    line = line.strip()
    if not line:
        continue
    m = re.match(r"^[^\s]+ ([^（]+)（(\d+)人）", line)
    if m and "人）" in line:
        cat = m.group(1).strip()
        category = next((v for k, v in CAT_MAP.items() if k in cat), cat)
        continue
    # 数据行: 1. 姓名   国籍   YYYY-MM-DD   ♑ 摩羯
    m = re.match(r"^\d+\.\s+(.+?)\s{2,}(.+?)\s{2,}(-?\d{4}-\d{2}-\d{2})\s{2,}(.+)$", line)
    if not m:
        continue
    name, nat, date, zod = (g.strip() for g in m.groups())
    zodiac = None
    for k, v in ZODIAC_FIX.items():
        if k in zod:
            zodiac = v
            break
    if not zodiac:
        print("跳过(星座未识别):", line[:60])
        continue
    people.append({"name": name, "nationality": nat, "birthDate": date,
                   "zodiacSign": zodiac, "category": category})

print(f"解析出 {len(people)} 人")

req = urllib.request.Request(URL, data=json.dumps({"people": people}).encode(),
                             headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req, timeout=30) as r:
    print("导入结果:", r.read().decode())
