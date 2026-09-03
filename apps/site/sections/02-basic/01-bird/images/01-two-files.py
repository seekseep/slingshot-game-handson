# 01-two-files.svg
# スキーマ: CONTAINER（game/ の中に2ファイル）+ LINK（index.html が2つを読み込む）
# game/ に置くのは index.html と main.js の2つだけ。index.html は入れ物で、
# Phaser 本体（CDN）と main.js を読み込む役をする。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

W, H = 900, 410
c = Canvas(W, H)

c.text(450, 46, "index.html が、Phaser 本体と main.js を読み込む", scale="xl")

# --- CONTAINER: game/ ------------------------------------------------------------
c.sticky(40, 78, 460, 270, color="yellow")
c.emoji("1f4c1", 66, 94, 40)
c.text(120, 122, "game/", scale="lg", align="left",
       fill=PALETTE["yellow"]["text"], font="technical")

c.sticky(66, 148, 408, 68, color="blue")
c.emoji("1f310", 86, 162, 40)
c.text(142, 182, "index.html", scale="md", align="left",
       fill=PALETTE["blue"]["text"], font="technical")
c.text(142, 206, "読み込むだけの入れ物", scale="sm", align="left")

c.sticky(66, 250, 408, 68, color="orange")
c.emoji("1f4c4", 86, 264, 40)
c.text(142, 284, "main.js", scale="md", align="left",
       fill=PALETTE["orange"]["text"], font="technical")
c.text(142, 308, "自分で書くゲームのコード", scale="sm", align="left")

# --- LINK: index.html が読み込む2つ -----------------------------------------------
c.connector(270, 220, 270, 246)
c.text(290, 240, "読み込む", scale="sm", align="left")

c.cloud(590, 120, 280, 140, color="teal")
c.text(716, 194, "Phaser 本体", scale="lg", fill=PALETTE["teal"]["text"])
c.text(716, 220, "CDN から読み込む", scale="sm")
c.connector(482, 184, 594, 188, label="読み込む", label_scale="sm")

c.text(450, 382, "以降の節は、この game/ をずっと書き換えて育てていく", scale="sm")

c.save("01-two-files.svg")
