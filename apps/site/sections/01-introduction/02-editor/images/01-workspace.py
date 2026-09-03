# 01-workspace.svg
# スキーマ: CONTAINER（1つの game/ の中にゲーム一式が入る）
# 開くのはこのフォルダ1つだけ。中の2ファイルはまだ無く、次の節で作る（破線で表す）。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

W, H = 760, 390
c = Canvas(W, H)

c.text(380, 46, "ゲームは、この 1 つのフォルダの中に作る", scale="xl")

# --- CONTAINER: 作業フォルダ ------------------------------------------------------
c.sticky(80, 78, 600, 236, color="yellow")
c.emoji("1f4c1", 108, 96, 44)
c.text(166, 124, "game/", scale="lg", align="left",
       fill=PALETTE["yellow"]["text"], font="technical")
c.text(166, 150, "エディタの「フォルダを開く」でここを開く", scale="sm", align="left")

# --- まだ無い2ファイル（破線） -----------------------------------------------------
FILES = [
    (176, "1f310", "index.html", "ゲームを表示する入れ物"),
    (240, "1f4c4", "main.js",    "ゲームのコード"),
]
for y, cp, name, role in FILES:
    c.sticky(110, y, 540, 56, color="gray", dash="dashed")
    c.emoji(cp, 128, y + 12, 32)
    c.text(176, y + 34, name, scale="md", align="left", font="technical")
    c.text(632, y + 34, role, scale="sm", align="right")

c.text(380, 350, "どちらのファイルも、次の節でこの中に作る", scale="sm")

c.save("01-workspace.svg")
