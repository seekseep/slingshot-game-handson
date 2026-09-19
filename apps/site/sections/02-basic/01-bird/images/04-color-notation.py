# 04-color-notation.svg
# スキーマ: SPLITTING（同じ6桁が、渡す先によって2つの書き方に分かれる）
# 図形には 0x 付きの数値、背景と文字には '#' 付きの文字列を渡す。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

W, H = 880, 390
c = Canvas(W, H)

c.text(440, 46, "同じ6桁でも、渡す先で書き方が変わる", scale="xl")

hub = c.sticky(340, 76, 200, 76, color="gray")
c.text(hub.cx, 112, "ffffff", scale="xl",
       fill=PALETTE["gray"]["text"], font="technical")
c.text(hub.cx, 138, "色の6桁", scale="sm")

shape_box = c.sticky(64, 196, 360, 160, color="blue")
c.emoji("1f535", 92, 218, 48)
c.text(154, 249, "図形の色", scale="lg", align="left", fill=PALETTE["blue"]["text"])
c.text(92, 308, "0xffffff", scale="xl", align="left",
       fill=PALETTE["blue"]["text"], font="technical")
c.text(92, 336, "先頭に 0x。クォートで囲まない＝数値", scale="sm", align="left")

css_box = c.sticky(456, 196, 360, 160, color="orange")
c.emoji("1f3a8", 484, 218, 48)
c.text(546, 249, "背景と文字の色", scale="lg", align="left",
       fill=PALETTE["orange"]["text"])
c.text(484, 308, "'#ffffff'", scale="xl", align="left",
       fill=PALETTE["orange"]["text"], font="technical")
c.text(484, 336, "先頭に #。クォートで囲む＝文字列", scale="sm", align="left")

c.link(hub, shape_box)
c.link(hub, css_box)

c.save("04-color-notation.svg")
