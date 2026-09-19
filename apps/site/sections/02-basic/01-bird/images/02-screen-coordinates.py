# 02-screen-coordinates.svg
# スキーマ: CONTAINER（画面という枠）+ SOURCE-PATH-GOAL（左上から右・下へ数える）
# this.add.circle(140, 340, ...) の 140 と 340 が画面のどこを指すのかを見せる。
# 画面 720x480 を 0.6 倍で描き、数字はゲーム内の座標のまま出す。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, INK_SCALE, PALETTE

PALETTE["screen"] = {"bg": "#fdf6e3", "border": "#c2a878", "text": "#7c6636"}
PALETTE["bird"] = {"bg": "#ffffff", "border": "#333333", "text": "#333333"}

K = 0.6                      # ゲーム座標 → 図の縮尺
SX, SY = 250.0, 120.0        # 画面の左上を図のどこに置くか
SW, SH = 720 * K, 480 * K    # 432 x 288


def px(gx):
    return SX + gx * K


def py(gy):
    return SY + gy * K


c = Canvas(900, 490)

c.text(466, 48, "左上が (0, 0)。x は右へ、y は下へ数える", scale="xl")
c.text(466, 80, "this.add.circle(140, 340, 18, 0xffffff)", scale="md",
       font="technical", fill=INK_SCALE["dark"])

screen = c.sticky(SX, SY, SW, SH, color="screen", rx=6)
c.text(px(720) - 14, py(480) - 16, "(720, 480)", scale="sm",
       align="right", fill=PALETTE["screen"]["text"], font="technical")

# --- 原点と、そこから伸びる 2 方向 ---
c.raw(f'<circle cx="{px(0)}" cy="{py(0)}" r="5" fill="{INK_SCALE["ink"]}"/>')
c.text(px(0) - 8, py(0) - 14, "(0, 0)", scale="md", align="right",
       font="technical")
c.link((px(0) + 16, py(0) + 16), (px(0) + 96, py(0) + 16))
c.text(px(0) + 108, py(0) + 23, "x", scale="md", align="left",
       fill=INK_SCALE["ink"], font="technical")
c.link((px(0) + 16, py(0) + 16), (px(0) + 16, py(0) + 96))
c.text(px(0) + 16, py(0) + 126, "y", scale="md",
       fill=INK_SCALE["ink"], font="technical")

# --- 鳥（実際の見た目のまま白い丸＋濃い輪郭）---
bird = c.ellipse(px(140), py(340), 18 * K, 18 * K, color="bird")
c.text(bird.cx, bird.top - 14, "鳥 (140, 340)", scale="md",
       fill=INK_SCALE["ink"])

# --- 寸法線（画面の外に出して、鳥から点線で引き出す）---
DIM_Y = py(480) + 44     # 下の寸法線
DIM_X = px(720) + 44     # 右の寸法線

c.link((bird.cx, bird.bottom), (bird.cx, DIM_Y + 10),
       dash="dotted", primary=False, head=False)
c.link((px(0), py(480)), (px(0), DIM_Y + 10),
       dash="dotted", primary=False, head=False)
c.link((px(0), DIM_Y), (bird.cx, DIM_Y), both=True, primary=False)
c.text((px(0) + bird.cx) / 2, DIM_Y - 12, "左から 140", scale="md",
       fill=INK_SCALE["ink"])

c.link((bird.right, bird.cy), (DIM_X + 10, bird.cy),
       dash="dotted", primary=False, head=False)
c.link((px(720), py(0)), (DIM_X + 10, py(0)),
       dash="dotted", primary=False, head=False)
c.link((DIM_X, py(0)), (DIM_X, bird.cy), both=True, primary=False)
c.text(DIM_X + 16, (py(0) + bird.cy) / 2, "上から 340", scale="md",
       align="left", fill=INK_SCALE["ink"])

c.save("02-screen-coordinates.svg")
