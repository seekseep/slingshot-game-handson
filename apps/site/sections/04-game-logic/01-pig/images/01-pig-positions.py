# 01-pig-positions.svg
# スキーマ: CONTAINER（画面の枠）+ VERTICALITY（地面の上 / タワーの上）
# pigPositions の 3 つの座標が、画面のどこを指すのかを見せる。
# 丸の絵も中心ぞろえなので、地面の上に置くには半径ぶん上げる。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, INK_SCALE, PALETTE

PALETTE["screen"] = {"bg": "#fdf6e3", "border": "#c2a878", "text": "#7c6636"}
PALETTE["ground"] = {"bg": "#888888", "border": "#6f6f6f", "text": "#ffffff"}
PALETTE["box"] = {"bg": "#dddddd", "border": "#333333", "text": "#333333"}
PALETTE["pig"] = {"bg": "#aaaaaa", "border": "#333333", "text": "#333333"}

K = 0.6
SX, SY = 250.0, 120.0
SW, SH = 720 * K, 480 * K

GROUND_Y, BOX_SIZE, TOWER_X, PIG_R = 400, 40, 560, 16


def px(gx):
    return SX + gx * K


def py(gy):
    return SY + gy * K


c = Canvas(900, 512)

c.text(466, 48, "ブタは 3 か所。地面の上が 2 匹、箱タワーの上が 1 匹", scale="xl")
c.text(466, 80, "this.add.circle(pos.x, pos.y, pigRadius, 0xaaaaaa)",
       scale="md", font="technical", fill=INK_SCALE["dark"])

c.sticky(SX, SY, SW, SH, color="screen", rx=6)
c.raw(f'<circle cx="{px(0)}" cy="{py(0)}" r="5" fill="{INK_SCALE["ink"]}"/>')
c.text(px(0) - 8, py(0) - 14, "(0, 0)", scale="sm", align="right",
       font="technical")

# --- 前の節までに置いたもの（地面と箱タワー）---
c.sticky(px(0), py(GROUND_Y), 720 * K, 80 * K, color="ground", rx=2)
c.text(px(120), py(440) + 6, "地面", scale="md", fill="#ffffff")
for i in range(3):
    box_y = GROUND_Y - BOX_SIZE / 2 - i * BOX_SIZE
    c.sticky(px(TOWER_X - BOX_SIZE / 2), py(box_y - BOX_SIZE / 2),
             BOX_SIZE * K, BOX_SIZE * K, color="box", rx=3)

# --- ブタ 3 匹 ---
GROUND_PIG_Y = GROUND_Y - PIG_R                      # 384
TOWER_PIG_Y = GROUND_Y - BOX_SIZE * 3 - PIG_R        # 264
PIGS = [(460, GROUND_PIG_Y), (TOWER_X, TOWER_PIG_Y), (660, GROUND_PIG_Y)]

pigs = [c.ellipse(px(gx), py(gy), PIG_R * K, PIG_R * K, color="pig")
        for gx, gy in PIGS]

# 同じ高さであることを示す破線と、その高さの計算式
c.link((px(0), py(GROUND_PIG_Y)), (pigs[0].left, py(GROUND_PIG_Y)),
       dash="dashed", primary=False, head=False)
c.text((px(0) + pigs[0].left) / 2, py(GROUND_PIG_Y) - 10,
       "groundTop - pigRadius = 384", scale="sm", font="technical",
       fill=INK_SCALE["ink"])
c.link((pigs[2].right, py(GROUND_PIG_Y)), (px(720), py(GROUND_PIG_Y)),
       dash="dashed", primary=False, head=False)

c.link((px(0), py(TOWER_PIG_Y)), (pigs[1].left, py(TOWER_PIG_Y)),
       dash="dashed", primary=False, head=False)
c.text((px(0) + pigs[1].left) / 2, py(TOWER_PIG_Y) - 10,
       "groundTop - boxSize * 3 - pigRadius = 264", scale="sm",
       font="technical", fill=INK_SCALE["ink"])

# 横位置は、画面の下に x の目盛りを引いて示す
RULER_Y = py(480) + 26
c.link((px(0), RULER_Y), (px(720), RULER_Y), primary=False)
c.text(px(720) + 16, RULER_Y + 6, "x", scale="md", align="left",
       fill=INK_SCALE["ink"], font="technical")

for pig, (gx, _) in zip(pigs, PIGS):
    c.raw(f'<line x1="{pig.cx}" y1="{py(GROUND_Y)}" x2="{pig.cx}" '
          f'y2="{py(480)}" stroke="#ffffff" stroke-width="1.5" '
          f'stroke-dasharray="2 4"/>')
    c.link((pig.cx, py(480)), (pig.cx, RULER_Y - 7),
           dash="dotted", primary=False, head=False)
    c.raw(f'<line x1="{pig.cx}" y1="{RULER_Y - 6}" x2="{pig.cx}" '
          f'y2="{RULER_Y + 6}" stroke="{INK_SCALE["ink"]}" stroke-width="2"/>')
    c.text(pig.cx, RULER_Y + 30, f"{gx}", scale="md", font="technical",
           fill=INK_SCALE["ink"])

c.text(466, RULER_Y + 64,
       "丸も中心ぞろえ。地面の上に置くには、半径ぶん (16) 上げる", scale="sm")

c.save("01-pig-positions.svg")
