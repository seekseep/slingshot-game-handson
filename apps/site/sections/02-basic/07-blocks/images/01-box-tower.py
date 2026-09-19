# 01-box-tower.svg
# スキーマ: VERTICALITY（y が小さいほど上）+ SCALE（40 ずつ積み上がる）
# boxY = groundY - boxSize / 2 - i * boxSize が、どの高さを指すのかを見せる。
# 四角の絵は中心ぞろえなので、箱の中心に点を打って基準点が分かるようにする。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, INK_SCALE, PALETTE

PALETTE["screen"] = {"bg": "#fdf6e3", "border": "#c2a878", "text": "#7c6636"}
PALETTE["ground"] = {"bg": "#888888", "border": "#6f6f6f", "text": "#ffffff"}
PALETTE["box"] = {"bg": "#dddddd", "border": "#333333", "text": "#333333"}

K = 0.6
SX, SY = 250.0, 120.0
SW, SH = 720 * K, 480 * K

GROUND_Y, BOX_SIZE, TOWER_X = 400, 40, 560


def px(gx):
    return SX + gx * K


def py(gy):
    return SY + gy * K


c = Canvas(900, 512)

c.text(466, 48, "箱は中心ぞろえ。地面の上から 40 ずつ積み上がる", scale="xl")
c.text(466, 80, "boxY = groundY - boxSize / 2 - i * boxSize", scale="md",
       font="technical", fill=INK_SCALE["dark"])

c.sticky(SX, SY, SW, SH, color="screen", rx=6)
c.raw(f'<circle cx="{px(0)}" cy="{py(0)}" r="5" fill="{INK_SCALE["ink"]}"/>')
c.text(px(0) - 8, py(0) - 14, "(0, 0)", scale="sm", align="right",
       font="technical")

c.sticky(px(0), py(GROUND_Y), 720 * K, 80 * K, color="ground", rx=2)
c.text(px(360), py(440) + 6, "地面", scale="md", fill="#ffffff")

# --- 箱 3 つ。中心の y が 40 ずつ小さくなる ---
centers = []
for i in range(3):
    box_y = GROUND_Y - BOX_SIZE / 2 - i * BOX_SIZE
    box = c.sticky(px(TOWER_X - BOX_SIZE / 2), py(box_y - BOX_SIZE / 2),
                   BOX_SIZE * K, BOX_SIZE * K, color="box", rx=3)
    c.raw(f'<circle cx="{box.cx}" cy="{box.cy}" r="2.5" '
          f'fill="{INK_SCALE["ink"]}"/>')
    c.link((box.left, box.cy), (444, box.cy),
           dash="dotted", primary=False, head=False)
    c.text(434, box.cy + 6, f"i = {i} → y = {box_y:g}", scale="md",
           align="right", fill=INK_SCALE["ink"])
    centers.append(box.cy)

c.text(px(TOWER_X), py(GROUND_Y - 3 * BOX_SIZE) - 14, "40 × 40 の箱",
       scale="md", fill=INK_SCALE["ink"])

# --- 寸法線（画面の外へ出す）---
DIM_Y = py(480) + 44
DIM_X = px(720) + 44

for cy in (centers[0], centers[2]):
    c.link((px(TOWER_X + BOX_SIZE / 2), cy), (DIM_X + 10, cy),
           dash="dotted", primary=False, head=False)
c.link((DIM_X, centers[2]), (DIM_X, centers[0]), both=True, primary=False)
c.text(DIM_X + 16, centers[1] - 12, "40 ずつ\n(1 段ぶん)", scale="md",
       align="left", fill=INK_SCALE["ink"])

c.link((px(TOWER_X), py(GROUND_Y)), (px(TOWER_X), DIM_Y + 10),
       dash="dotted", primary=False, head=False)
c.link((px(0), py(480)), (px(0), DIM_Y + 10),
       dash="dotted", primary=False, head=False)
c.link((px(0), DIM_Y), (px(TOWER_X), DIM_Y), both=True, primary=False,
       label="towerX = 560", label_font="technical")

c.text(466, DIM_Y + 40,
       "y が 40 小さいほど 1 段上。いちばん下の箱は半分 (20) 上げて地面に乗る",
       scale="sm")

c.save("01-box-tower.svg")
