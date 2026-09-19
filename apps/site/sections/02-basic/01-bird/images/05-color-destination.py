# 05-color-destination.svg
# スキーマ: SOURCE-PATH-GOAL（色が誰に渡るか）を2本並べた SPLITTING
# 書き方が2種類あるのは、色を受け取る相手が違うから。
# 図形の色は Phaser が赤・緑・青に分解して計算する（FillStyleCanvas のビット演算）ので数値。
# 文字の色はブラウザの文字描画（context.fillStyle）にそのまま渡るので CSS と同じ文字列。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

W, H = 880, 372
c = Canvas(W, H)

c.text(440, 46, "色を受け取る相手がちがうので、書き方もちがう", scale="xl")

ROWS = [
    # y,  左の色,   左の絵文字, 左の見出し,    左のコード,  右の絵文字, 右の見出し,            右の理由
    (86,  "blue",   "1f535", "図形の色",       "0xffffff",  "2699",  "Phaser が計算して描く",
     "6桁を赤・緑・青に分けるので数値"),
    (232, "orange", "1f3a8", "背景と文字の色", "'#333333'", "1f310", "ブラウザにそのまま渡す",
     "CSS と同じ書き方しか通じないので文字列"),
]

for y, color, cp, heading, code, dest_cp, dest_heading, reason in ROWS:
    src = c.sticky(60, y, 310, 112, color=color)
    c.emoji(cp, 88, y + 22, 40)
    c.text(142, y + 48, heading, scale="md", align="left", fill=PALETTE[color]["text"])
    c.text(88, y + 92, code, scale="lg", align="left",
           fill=PALETTE[color]["text"], font="technical")

    dest = c.sticky(470, y, 350, 112, color="gray")
    c.emoji(dest_cp, 498, y + 22, 40)
    c.text(552, y + 48, dest_heading, scale="md", align="left", fill=PALETTE["gray"]["text"])
    c.text(498, y + 88, reason, scale="sm", align="left")

    c.link(src, dest)

c.save("05-color-destination.svg")
