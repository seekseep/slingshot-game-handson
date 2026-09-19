# 01-ground-rect.svg
# スキーマ: CONTAINER（画面の枠）+ PART-WHOLE（画面の下 80 が地面）
# fillRect(左上のx, 左上のy, 幅, 高さ) の 4 つの数字が、画面のどこを指すのかを見せる。
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

c.text(466, 48, "地面は、左上 (0, 400) から 720 × 80 の帯", scale="xl")
c.text(466, 80, "ground.fillRect(groundX, groundY, groundWidth, groundHeight)",
       scale="md", font="technical", fill=INK_SCALE["dark"])

c.sticky(SX, SY, SW, SH, color="screen", rx=6)
c.raw(f'<circle cx="{px(0)}" cy="{py(0)}" r="5" fill="{INK_SCALE["ink"]}"/>')
c.text(px(0) - 8, py(0) - 14, "(0, 0)", scale="sm", align="right",
       font="technical")

# --- 地面の帯 ---
band = c.sticky(px(0), py(400), 720 * K, 80 * K, color="ground", rx=2)
c.text(band.cx, band.cy + 6, "地面", scale="md", fill="#ffffff")

c.raw(f'<circle cx="{px(0)}" cy="{py(400)}" r="5" fill="{INK_SCALE["ink"]}"/>')
c.text(px(0) + 14, py(400) - 34, "帯の左上の角", scale="sm", align="left")
c.text(px(0) + 14, py(400) - 12, "(0, 400)", scale="md", align="left",
       fill=INK_SCALE["ink"], font="technical")

# --- 寸法線（画面の外へ出す）---
DIM_Y = py(480) + 44
DIM_X = px(720) + 44

for gy in (0, 400, 480):
    c.link((px(720), py(gy)), (DIM_X + 10, py(gy)),
           dash="dotted", primary=False, head=False)
c.link((DIM_X, py(0)), (DIM_X, py(400)), both=True, primary=False)
c.text(DIM_X + 16, py(200) - 12, "groundY\n= 400", scale="md", align="left",
       fill=INK_SCALE["ink"], font="technical")
c.link((DIM_X, py(400)), (DIM_X, py(480)), both=True, primary=False)
c.text(DIM_X + 16, py(440) - 12, "groundHeight\n= 80", scale="md", align="left",
       fill=INK_SCALE["ink"], font="technical")

for gx in (0, 720):
    c.link((px(gx), py(480)), (px(gx), DIM_Y + 10),
           dash="dotted", primary=False, head=False)
c.link((px(0), DIM_Y), (px(720), DIM_Y), both=True, primary=False,
       label="groundWidth = 720", label_font="technical")

c.text(466, DIM_Y + 40, "400 + 80 = 480。帯の下端が、画面の下端にちょうど届く",
       scale="sm")

c.save("01-ground-rect.svg")
