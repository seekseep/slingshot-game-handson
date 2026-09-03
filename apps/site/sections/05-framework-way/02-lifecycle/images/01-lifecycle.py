# 01-lifecycle.svg
# スキーマ: SOURCE-PATH-GOAL（scene.start という起点から shutdown という終点へ）
#          + VERTICALITY（上から下へ順番に呼ばれる）
#          + CYCLE（update だけがその場で回り続ける）
# Phaser がシーンのメソッドを「決まった順番で」呼んでいく流れ。呼ぶのは常に Phaser 側で、
# 私たちは呼ばれる場所に中身を書くだけ、という関係を1枚にする。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

W, H = 780, 750
SPINE = 360          # 縦の流れが通る線
CX0, CW = 80, 560    # カードの左端と幅
CH = 76              # カードの高さ

c = Canvas(W, H)

# --- 起点: this.scene.start('Game') ------------------------------------------
c.sticky(200, 30, 320, 56, color="orange")
c.text(360, 64, "this.scene.start('Game')", scale="md",
       font="technical", fill=PALETTE["orange"]["text"])

# --- 順番に呼ばれるメソッドたち -------------------------------------------------
STEPS = [
    (158, "teal",   "1f4e5", "init(data)",   "渡されたデータを受け取る",          "1 回"),        # 📥
    (282, "yellow", "1f4e6", "preload()",    "画像・音を読み込む",                "1 回"),        # 📦
    (406, "green",  "1f3ac", "create(data)", "オブジェクトを置く／イベントを登録", "1 回"),        # 🎬
    (530, "blue",   "1f501", "update()",     "進める・見張る",                    "約 60 回/秒"),  # 🔁
    (654, "gray",   "1f6aa", "shutdown()",   "後片付けをする",                    "1 回"),        # 🚪
]
for cy, color, cp, name, desc, freq in STEPS:
    c.sticky(CX0, cy - CH / 2, CW, CH, color=color)
    c.emoji(cp, 102, cy - 23, 46)
    c.text(166, cy - 4, name, scale="lg", font="technical",
           align="left", fill=PALETTE[color]["text"])
    c.text(166, cy + 24, desc, scale="sm", align="left")
    c.text(CX0 + CW - 18, cy - 4, freq, scale="sm", align="right",
           fill=PALETTE[color]["text"])

# --- 上から下へ ---------------------------------------------------------------
c.connector(SPINE, 88, SPINE, 116)
c.connector(SPINE, 198, SPINE, 240)
c.connector(SPINE, 322, SPINE, 364)
c.text(SPINE + 16, 347, "読み込みが終わってから", scale="sm", align="left")
c.connector(SPINE, 446, SPINE, 488)
c.connector(SPINE, 570, SPINE, 612)
c.text(SPINE + 16, 595, "別のシーンへ移ると", scale="sm", align="left")

# --- CYCLE: update だけがその場で回り続ける -------------------------------------
c.raw('<path d="M640 508 C 734 496, 734 564, 645 550" fill="none" '
      'stroke="#475569" stroke-width="3.5" stroke-linecap="round" '
      'marker-end="url(#aR)"/>')
c.text(694, 488, "毎フレーム", scale="sm")

# --- 主導権はどちらにあるか -----------------------------------------------------
c.text(360, 722, "呼ぶのは、ぜんぶ Phaser の側", scale="sm")

c.save("01-lifecycle.svg")
