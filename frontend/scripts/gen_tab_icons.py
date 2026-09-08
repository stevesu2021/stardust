# -*- coding: utf-8 -*-
"""生成「夜观星象」主题 tabBar 图标（81x81 PNG，8x 超采样抗锯齿）。

图标：home=四芒星 / dating=心 / shop=提袋 / user=人形
状态：normal=#6B7399（暗紫灰）/ active=#E8C36A（星光金）
输出到 src/static/，覆盖旧图标。
"""
import math
import os

from PIL import Image, ImageDraw

SIZE = 81
SS = 8  # 超采样倍数
W = SIZE * SS

INACTIVE = (107, 115, 153, 255)  # #6B7399
ACTIVE = (232, 195, 106, 255)  # #E8C36A

OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "static"))


def star4(draw, color):
    """四芒星 + 右上小星点（首页）"""
    cx = cy = 0.5 * W
    ro, ri = 0.34 * W, 0.125 * W
    pts = []
    for i in range(8):
        ang = math.pi / 2 + i * math.pi / 4
        r = ro if i % 2 == 0 else ri
        pts.append((cx + r * math.cos(ang), cy - r * math.sin(ang)))
    draw.polygon(pts, fill=color)
    draw.ellipse([0.78 * W, 0.13 * W, 0.845 * W, 0.195 * W], fill=color)


def heart(draw, color):
    """心形（交友）"""
    cx, cy = 0.5 * W, 0.545 * W
    scale = W * 0.0185
    pts = []
    for i in range(128):
        t = 2 * math.pi * i / 128
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((cx + x * scale, cy - y * scale))
    draw.polygon(pts, fill=color)


def bag(draw, color):
    """提袋（商城）"""
    cx = 0.5 * W
    hw = 0.185 * W
    # 提手：上半个椭圆的粗弧线
    draw.arc(
        [cx - hw, 0.14 * W, cx + hw, 0.56 * W],
        start=180,
        end=360,
        fill=color,
        width=int(0.052 * W),
    )
    # 袋身
    draw.rounded_rectangle(
        [0.18 * W, 0.36 * W, 0.82 * W, 0.84 * W],
        radius=0.10 * W,
        fill=color,
    )


def user(draw, color):
    """人形（我的）"""
    r = 0.155 * W
    draw.ellipse([0.5 * W - r, 0.12 * W, 0.5 * W + r, 0.12 * W + 2 * r], fill=color)
    draw.pieslice([0.18 * W, 0.48 * W, 0.82 * W, 1.18 * W], start=180, end=360, fill=color)


ICONS = {
    "home": star4,
    "dating": heart,
    "shop": bag,
    "user": user,
}


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for name, fn in ICONS.items():
        for state, color in (("normal", INACTIVE), ("active", ACTIVE)):
            img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            fn(draw, color)
            img = img.resize((SIZE, SIZE), Image.LANCZOS)
            path = os.path.join(OUT_DIR, f"tab-{name}-{'' if state == 'normal' else 'active-'}.png")
            path = os.path.join(OUT_DIR, f"tab-{name}.png" if state == "normal" else f"tab-{name}-active.png")
            img.save(path)
            print("saved", path)
    print("done:", len(ICONS) * 2, "icons")


if __name__ == "__main__":
    main()
