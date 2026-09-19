# 03-hex-rgb.svg
# スキーマ: PART-WHOLE（6桁 = 赤2桁 + 緑2桁 + 青2桁）+ SCALE（00〜ff の明るさ）
# 色の6桁を2桁ずつ区切ると赤・緑・青の明るさで、3つ合わさって1つの色になる。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

# 出来あがる色そのものを見せる図なので、この図だけで使う色を足す
PALETTE["cream"] = {"bg": "#fdf6e3", "border": "#c2a878", "text": "#7c6636"}

W, H = 820, 420
c = Canvas(W, H)

c.text(410, 48, "色の6桁は、赤・緑・青の明るさが2桁ずつ", scale="xl")
c.text(410, 78, "2桁は 00（いちばん暗い）〜 ff（いちばん明るい）の 256 段階", scale="sm")

PARTS = [
    (90,  "red",   "fd", "赤", "ほぼ最大"),
    (320, "green", "f6", "緑", "つよい"),
    (550, "blue",  "e3", "青", "やや弱い"),
]

boxes = []
for x, color, pair, name, strength in PARTS:
    box = c.sticky(x, 108, 180, 150, color=color)
    c.text(box.cx, 164, pair, scale="xxl", fill=PALETTE[color]["text"], font="technical")
    c.text(box.cx, 204, name, scale="lg", fill=PALETTE[color]["text"])
    c.text(box.cx, 232, strength, scale="sm")
    boxes.append(box)

swatch = c.sticky(305, 312, 210, 76, color="cream")
c.text(swatch.cx, 342, "#fdf6e3", scale="md",
       fill=PALETTE["cream"]["text"], font="technical")
c.text(swatch.cx, 368, "うすいクリーム色", scale="sm", fill=PALETTE["cream"]["text"])

for box in boxes:
    c.link(box, swatch)

c.save("03-hex-rgb.svg")
