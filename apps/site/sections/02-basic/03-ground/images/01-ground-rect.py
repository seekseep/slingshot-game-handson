# 01-ground-rect.svg
# スキーマ: CONTAINER（画面の枠）+ CENTER-PERIPHERY（中心から半分ずつ広がる帯）
# this.add.rectangle(中心x, 中心y, 幅, 高さ) の 4 つの数字が、画面のどこを指すのかと、
# そこから上面 groundTop がどう決まるのかを見せる。
# 画面 720x480 を 0.6 倍で描き、数字はゲーム内の座標のまま出す。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, INK_SCALE, PALETTE

PALETTE["screen"] = {"bg": "#fdf6e3", "border": "#c2a878", "text": "#7c6636"}
PALETTE["ground"] = {"bg": "#888888", "border": "#6f6f6f", "text": "#ffffff"}

K = 0.6
SX, SY = 250.0, 120.0
SW, SH = 720 * K, 480 * K


def px(gx):
    return SX + gx * K


def py(gy):
    return SY + gy * K


c = Canvas(900, 512)

c.text(466, 48, "地面は、中心 (360, 440) に置いた 720 × 80 の帯", scale="xl")
c.text(466, 80,
       "this.add.rectangle(groundX, groundY, groundWidth, groundHeight, 色)",
       scale="md", font="technical", fill=INK_SCALE["dark"])

c.sticky(SX, SY, SW, SH, color="screen", rx=6)
c.raw(f'<circle cx="{px(0)}" cy="{py(0)}" r="5" fill="{INK_SCALE["ink"]}"/>')
c.text(px(0) - 8, py(0) - 14, "(0, 0)", scale="sm", align="right",
       font="technical")

# --- 地面の帯 ---
band = c.sticky(px(0), py(400), 720 * K, 80 * K, color="ground", rx=2)

# --- 中心の点と、そこから上面までの半分 ---
c.raw(f'<circle cx="{px(360)}" cy="{py(440)}" r="5" fill="#ffffff"/>')
c.text(px(360) + 16, py(440) + 6, "中心 (360, 440)", scale="md", align="left",
       fill="#ffffff", font="technical")
c.link((px(360), py(440)), (px(360), py(400)), both=True, primary=False)

# --- 上面 groundTop ---
c.link((px(0), py(400)), (px(720), py(400)), dash="dashed", primary=False,
       head=False)
c.text(px(20), py(400) - 36, "上面。ここに物が乗る（中心から高さの半分だけ上）",
       scale="sm", align="left")
c.text(px(20), py(400) - 12, "groundTop = 440 - 40 = 400", scale="md",
       align="left", fill=INK_SCALE["ink"], font="technical")

# --- 寸法線（画面の外へ出す）---
DIM_Y = py(480) + 44
DIM_X = px(720) + 44

for gy in (0, 400, 440, 480):
    c.link((px(720), py(gy)), (DIM_X + 10, py(gy)),
           dash="dotted", primary=False, head=False)
c.link((DIM_X, py(0)), (DIM_X, py(440)), both=True, primary=False)
c.text(DIM_X + 16, py(220) - 12, "groundY\n= 440", scale="md", align="left",
       fill=INK_SCALE["ink"], font="technical")
c.link((DIM_X, py(400)), (DIM_X, py(480)), both=True, primary=False)
c.text(DIM_X + 16, py(440) - 12, "groundHeight\n= 80", scale="md", align="left",
       fill=INK_SCALE["ink"], font="technical")

for gx in (0, 360, 720):
    c.link((px(gx), py(480)), (px(gx), DIM_Y + 10),
           dash="dotted", primary=False, head=False)
c.link((px(0), DIM_Y), (px(720), DIM_Y), both=True, primary=False,
       label="groundWidth = 720", label_font="technical")

c.text(466, DIM_Y + 40, "440 + 40 = 480。帯の下端が、画面の下端にちょうど届く",
       scale="sm")

c.save("01-ground-rect.svg")
