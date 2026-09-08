#!/usr/bin/env python3
"""stardust 前端 H5 全页面冒烟测试 (playwright + chromium headless shell)"""
import json, time, sys
from playwright.sync_api import sync_playwright

SHELL = "/home/steve/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome"
TOKEN = open("/tmp/sd_token").read().strip()
BASE = "http://127.0.0.1:8080"

PAGES = [
    "pages/index/index",
    "pages/auth/login",
    "pages/auth/register",
    "pages/astrology/calculate",
    "pages/prayer/list",
    "pages/prayer/create",
    "pages/confession/list",
    "pages/confession/create",
    "pages/treehole/list",
    "pages/treehole/create",
    "pages/dating/matches",
    "pages/user/profile",
]

INIT = f"try{{localStorage.setItem('user', JSON.stringify({{token: '{TOKEN}', id: '23323149-d5f5-4c01-9b88-6019208d5a61', nickname: '测试员1788877743'}}))}}catch(e){{}}"

def run():
    report = []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=SHELL, headless=True)
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        ctx.add_init_script(INIT)
        page = ctx.new_page()

        # 先探测路由风格: history vs hash
        page.goto(BASE + "/", wait_until="networkidle", timeout=30000)
        time.sleep(2)
        body_len = page.evaluate("document.body.innerText.length")
        hash_style = page.evaluate("location.hash.includes('pages/')")
        print(f"首页 body文本长度={body_len}, hash路由={hash_style}")
        style = "hash" if hash_style else "path"

        for path in PAGES:
            entry = {"page": path, "console_errors": [], "failed_reqs": [], "api_4xx_5xx": []}
            errors, fails, api = [], [], []
            page.on("console", lambda m, e=errors: e.append(m.text[:200]) if m.type == "error" else None)
            page.on("requestfailed", lambda r, f=fails: f.append(f"{r.url[:100]} {r.failure}"))
            page.on("response", lambda r, a=api: a.append(f"{r.status} {r.url[:100]}") if r.status >= 400 else None)

            url = f"{BASE}/#/{path}" if style == "hash" else f"{BASE}/{path}"
            try:
                page.goto(url, wait_until="networkidle", timeout=30000)
            except Exception as ex:
                try:
                    page.wait_for_load_state("networkidle", timeout=10000)
                except Exception:
                    errors.append(f"goto/timeout: {str(ex)[:120]}")
            time.sleep(2.5)
            txt = page.evaluate("document.body.innerText")
            entry["text_len"] = len(txt)
            entry["head"] = txt[:100].replace("\n", " ")
            entry["console_errors"] = errors[:8]
            entry["failed_reqs"] = fails[:8]
            entry["api_4xx_5xx"] = api[:8]
            report.append(entry)
            # 清掉监听器(重新创建page.on不可移除,改为每页新page)
            page2 = ctx.new_page()
            page.close()
            page = page2

        browser.close()
    print(json.dumps(report, ensure_ascii=False, indent=1))

if __name__ == "__main__":
    run()
