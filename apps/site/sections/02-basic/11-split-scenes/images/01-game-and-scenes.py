# 01-game-and-scenes.svg
# スキーマ: CONTAINER（Phaser.Game の中に複数のシーンが入る）+ CYCLE（scene.start で巡る）
#          + PART-WHOLE（1シーン = 1ファイル）
# 1つの Phaser.Game が StartScene / GameScene / GameOverScene を抱えていて、
# 動いているのは常に1つだけ。main.js の scene 配列で3つとも登録する、という図。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

W, H = 960, 520
c = Canvas(W, H)

# --- CONTAINER: Phaser.Game の枠 ---------------------------------------------
c.sticky(40, 30, 880, 320, color="gray")
c.text(480, 74, "Phaser.Game（ゲームは1つ）", scale="heading")

# --- 中に入る3つのシーン -------------------------------------------------------
CARDS = [
    (70,  "blue",   "1f3c1", "StartScene",    "scenes/start-scene.js"),
    (365, "orange", "1f3ae", "GameScene",     "scenes/game-scene.js"),
    (660, "purple", "1f51a", "GameOverScene", "scenes/gameover-scene.js"),
]
for x, color, cp, name, path in CARDS:
    cx = x + 115
    c.sticky(x, 100, 230, 170, color=color)
    c.emoji(cp, cx - 28, 122, 56)
    c.text(cx, 222, name, scale="heading", fill=PALETTE[color]["text"])
    c.text(cx, 250, path, scale="sm", font="technical")

# --- CYCLE: シーンの切り替え ---------------------------------------------------
c.connector(306, 160, 359, 160, label="開始", label_scale="sm")
c.connector(601, 160, 654, 160, label="弾切れ", label_scale="sm")
c.connector(760, 278, 200, 278, label="もう一度", label_scale="sm",
            primary=False, curve=40, label_dy=-30)
c.text(480, 334, "画面に映っているのは、このうち常に1つだけ", scale="sm")

# --- main.js から3つとも登録する ------------------------------------------------
c.connector(480, 414, 480, 358)
c.text(500, 392, "3つとも登録する", scale="sm", anchor="start")

c.sticky(230, 420, 500, 72, color="yellow")
c.text(480, 448, "main.js", scale="label", fill=PALETTE["yellow"]["text"])
c.text(480, 474, "scene: [StartScene, GameScene, GameOverScene]",
       scale="sm", font="technical")

c.save("01-game-and-scenes.svg")
