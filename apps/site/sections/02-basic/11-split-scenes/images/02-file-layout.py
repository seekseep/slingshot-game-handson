# 02-file-layout.svg
# スキーマ: CONTAINER（game/ の中に scenes/、その中に3ファイル）
#          + SPLITTING（1つだった main.js から、1シーン = 1ファイルに割る）
# scenes/ を作って、シーンのクラスを1つずつ別ファイルに移したあとの形。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

W, H = 880, 540
c = Canvas(W, H)

c.text(440, 46, "1 シーン = 1 ファイルに分ける", scale="xl")

# --- CONTAINER: game/ ------------------------------------------------------------
c.sticky(40, 78, 800, 408, color="yellow")
c.emoji("1f4c1", 66, 94, 40)
c.text(120, 122, "game/", scale="lg", align="left",
       fill=PALETTE["yellow"]["text"], font="technical")

ROOT_FILES = [
    (148, "1f310", "index.html", "読み込む順を書く"),
    (212, "1f4c4", "main.js",    "起動の設定だけを残す"),
]
for y, cp, name, role in ROOT_FILES:
    c.sticky(66, y, 748, 52, color="gray")
    c.emoji(cp, 84, y + 10, 32)
    c.text(132, y + 34, name, scale="md", align="left", font="technical")
    c.text(796, y + 34, role, scale="sm", align="right")

# --- CONTAINER: scenes/ ----------------------------------------------------------
c.sticky(66, 276, 748, 188, color="teal")
c.emoji("1f4c1", 84, 286, 32)
c.text(132, 310, "scenes/", scale="md", align="left",
       fill=PALETTE["teal"]["text"], font="technical")

SCENES = [
    (88,  "blue",   "1f3c1", "StartScene",    "start-scene.js"),
    (334, "orange", "1f3ae", "GameScene",     "game-scene.js"),
    (580, "purple", "1f51a", "GameOverScene", "gameover-scene.js"),
]
for x, color, cp, cls, filename in SCENES:
    cx = x + 116
    c.sticky(x, 328, 232, 112, color=color)
    c.emoji(cp, cx - 22, 338, 44)
    c.text(cx, 404, cls, scale="md", fill=PALETTE[color]["text"])
    c.text(cx, 426, filename, scale="sm", font="technical")

c.text(440, 514, "中身はそのまま移すだけ。クラスはファイルをまたいで共有される", scale="sm")

c.save("02-file-layout.svg")
