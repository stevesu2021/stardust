#!/usr/bin/env python3
"""stardust 前端 H5 冒烟 v2: hash 路由 + 真实登录 + 逐页采集 console/network 错误"""
import json, time
from playwright.sync_api import sync_playwright

CHROME = "/home/steve/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome"
BASE = "http://127.0.0.1:8080"
ACCOUNT = {"identifier": "", "password": ""}  # 从 /tmp/sd_account.json 读

PAGES = [
    ("pages/index/index", "首页"),
    ("pages/auth/login", "登录页"),
    ("pages/auth/register", "注册页"),
    ("pages/astrology/calculate", "星盘计算"),
    ("pages/prayer/list", "祈愿列表"),
    ("pages/prayer/create", "发起祈愿"),
    ("pages/confession/list", "告白墙"),
    ("pages/confession/create", "写告白"),
    ("pages/treehole/list", "树洞"),
    ("pages/treehole/create", "发树洞"),
    ("pages/dating/matches", "缘分匹配"),
    ("pages/user/profile", "我的"),
]

def new_page(ctx, listeners):
    page = ctx.new_page()
    errs, fails, apis = listeners
    page.on("console", lambda m: errs.append(m.text[:180]) if m.type == "error" else None)
    page.on("requestfailed", lambda r: fails.append(f"{r.url[:110]} {r.failure}"))
    page.on("response", lambda r: apis.append(f"{r.status} {r.url[:110]}") if r.status >= 400 else None)
    return page

def visit(page, listeners, path, label):
    errs, fails, apis = listeners
    errs.clear(); fails.clear(); apis.clear()
    url = f"{BASE}/#/{path}"
    try:
        page.goto(url, wait_until="networkidle", timeout=25000)
    except Exception as ex:
        try:
            page.wait_for_load_state("networkidle", timeout=8000)
        except Exception:
            errs.append(f"goto-timeout: {str(ex)[:100]}")
    time.sleep(2.2)
    txt = page.evaluate("document.body.innerText") or ""
    print(json.dumps({
        "page": label, "path": path, "text_len": len(txt),
        "head": txt[:90].replace("\n", " "),
        "console_errors": errs[:6], "failed_reqs": fails[:4], "api_4xx_5xx": apis[:6],
    }, ensure_ascii=False))

def run():
    acc = json.load(open("/tmp/sd_account.json"))
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, headless=True)
        ctx = browser.new_context(viewport={"width": 390, "height": 844})

        # ---- 1. 真实登录流程 ----
        listeners = ([], [], [])
        page = new_page(ctx, listeners)
        page.goto(f"{BASE}/#/pages/auth/login", wait_until="networkidle", timeout=25000)
        time.sleep(2)
        inputs = page.locator("input")
        inputs.nth(0).fill(acc["identifier"])
        inputs.nth(1).fill(acc["password"])
        page.locator("uni-button.btn").first.click()
        try:
            page.wait_for_response(lambda r: "/api/auth/login" in r.url, timeout=20000)
            lr = page.request  # noqa
        except Exception:
            pass
        page.wait_for_load_state("networkidle", timeout=20000)
        time.sleep(2.5)
        stored = page.evaluate("localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token?.length : 0")
        login_ok = bool(stored)
        print(json.dumps({"step": "登录", "ok": login_ok, "token_len": stored,
                          "console_errors": listeners[0][:5], "api_4xx_5xx": listeners[2][:5]},
                         ensure_ascii=False))

        # ---- 2. 登录态逐页冒烟 ----
        if login_ok:
            for path, label in PAGES:
                visit(page, listeners, path, label)

        # ---- 3. 首页点击「星盘计算」验证导航 ----
        if login_ok:
            listeners[0].clear(); listeners[2].clear()
            page.goto(f"{BASE}/#/pages/index/index", wait_until="networkidle", timeout=20000)
            time.sleep(2)
            try:
                page.get_by_text("星盘计算").first.click()
                time.sleep(2.5)
                txt = page.evaluate("document.body.innerText")
                print(json.dumps({"step": "点击星盘计算", "url_hash": page.evaluate("location.hash"),
                                  "text_head": txt[:80].replace(chr(10), ' ')}, ensure_ascii=False))
            except Exception as ex:
                print(json.dumps({"step": "点击星盘计算", "error": str(ex)[:120]}, ensure_ascii=False))

        browser.close()

if __name__ == "__main__":
    run()
