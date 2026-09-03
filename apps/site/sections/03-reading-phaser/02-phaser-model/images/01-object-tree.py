# 01-object-tree.svg
# スキーマ: CONTAINER（Phaser.Game の中にシーン、シーンの中にオブジェクト）
#          + PART-WHOLE（映っているのは常に1シーン）
#          + LINK（オブジェクトのうち一部だけが Matter の「体」と結びつく）
# 02 章の最後の状態を、ゲーム / シーン / オブジェクト / エンジンの4層で書き出した図。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

W, H = 1020, 650
c = Canvas(W, H)

c.text(510, 46, "ゲームの中にシーン、シーンの中にオブジェクト", scale="xl")

# --- CONTAINER: Phaser.Game ---------------------------------------------------
c.sticky(36, 74, 564, 520, color="gray")
c.text(60, 110, "Phaser.Game", scale="lg", align="left",
       fill=PALETTE["gray"]["text"], font="technical")
c.text(60, 136, "Canvas 1 枚 ＋ 1 秒に約 60 回まわる時計", scale="sm", align="left")

# --- 3つのシーン ---------------------------------------------------------------
c.sticky(60, 152, 516, 64, color="blue")
c.emoji("1f3c1", 80, 164, 40)
c.text(134, 182, "StartScene", scale="md", align="left",
       fill=PALETTE["blue"]["text"], font="technical")
c.text(134, 206, "タイトル画面", scale="sm", align="left")

c.sticky(60, 228, 516, 268, color="orange")
c.emoji("1f3ae", 80, 238, 36)
c.text(134, 258, "GameScene", scale="md", align="left",
       fill=PALETTE["orange"]["text"], font="technical")
c.text(134, 284, "遊びの本体（いま動いている画面）", scale="sm", align="left")

# --- シーンに置かれたオブジェクト ------------------------------------------------
CHIPS = [
    (298, "1f426", "bird",    "(circle)",    "green", None),
    (346, "1f7eb", "ground",  "(rectangle)", "green", None),
    (394, "1f4e6", "box × 3", "(rectangle)", "green", None),
    (442, "1f535", "reserve", "(graphics)",  "gray",  "体を持たない・ただの絵"),
]
for y, cp, name, kind, color, note in CHIPS:
    c.sticky(84, y, 468, 40, color=color, rx=12)
    c.emoji(cp, 98, y + 4, 32)
    c.text(140, y + 26, name, scale="md", align="left",
           fill=PALETTE[color]["text"], font="technical")
    c.text(232, y + 26, kind, scale="sm", align="left", font="technical")
    if note:
        c.text(540, y + 26, note, scale="sm", align="right")

c.sticky(60, 510, 516, 64, color="purple")
c.emoji("1f51a", 80, 522, 40)
c.text(134, 540, "GameOverScene", scale="md", align="left",
       fill=PALETTE["purple"]["text"], font="technical")
c.text(134, 564, "結果画面", scale="sm", align="left")

# --- LINK: 体を持つ3つだけが Matter の世界につながる -------------------------------
c.raw('<path d="M552 318 H580 M552 414 H580 M580 318 V414 M552 366 H580" '
      'fill="none" stroke="#475569" stroke-width="3.5" stroke-linecap="round"/>')
c.connector(580, 366, 694, 366)
c.text(647, 350, "体と結びつく", scale="sm")

c.sticky(700, 250, 290, 240, color="teal")
c.text(845, 292, "Matter の世界", scale="lg", fill=PALETTE["teal"]["text"])
c.emoji("2699", 813, 312, 64)
c.text(845, 412, "体（body）だけがある", scale="sm")
c.text(845, 438, "重力と衝突を計算する", scale="sm")
c.text(845, 464, "絵のことは知らない", scale="sm")

c.text(510, 626, "映っているのは常に1シーン。体を持つかどうかはオブジェクトごとに決まる",
       scale="sm")

c.save("01-object-tree.svg")
