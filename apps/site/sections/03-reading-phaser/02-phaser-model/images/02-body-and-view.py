# 02-body-and-view.svg
# スキーマ: SOURCE-PATH-GOAL（Matter の体 → Phaser の位置 → Canvas の絵）
#          + CYCLE（毎フレームこの 2 手をくり返す）
# 体と見た目は別もので、①エンジンが計算した位置を ②Phaser が絵に移す、という流れ。

import sys
sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

W, H = 1000, 440
c = Canvas(W, H)

c.text(500, 46, "体が動き、絵があとからついていく", scale="xl")

# --- SOURCE-PATH-GOAL: 3つの世界 ------------------------------------------------
c.sticky(30, 76, 230, 232, color="teal")
c.text(145, 110, "Matter の世界", scale="lg", fill=PALETTE["teal"]["text"])
c.emoji("2699", 117, 126, 56)
c.text(145, 212, "体（body）", scale="md")
c.text(145, 238, "x, y, 速度", scale="sm", font="technical")
c.text(145, 268, "重力と衝突を", scale="sm")
c.text(145, 290, "計算する", scale="sm")

c.sticky(385, 76, 230, 232, color="orange")
c.text(500, 110, "Phaser の世界", scale="lg", fill=PALETTE["orange"]["text"])
c.emoji("1f426", 472, 126, 56)
c.text(500, 212, "bird", scale="md", font="technical")
c.text(500, 238, "オブジェクトの位置", scale="sm")
c.text(500, 268, "見た目を持つ", scale="sm")

c.sticky(740, 76, 230, 232, color="blue")
c.text(855, 110, "Canvas", scale="lg", fill=PALETTE["blue"]["text"])
c.emoji("1f535", 827, 126, 56)
c.text(855, 212, "丸い絵", scale="md")
c.text(855, 238, "画面に出る", scale="sm")

c.connector(268, 180, 377, 180, label="①", label_scale="lg", label_dy=-14)
c.text(322, 214, "位置を渡す", scale="sm")
c.connector(623, 180, 732, 180, label="②", label_scale="lg", label_dy=-14)
c.text(677, 214, "描き直す", scale="sm")

# --- CYCLE: 毎フレームくり返す ---------------------------------------------------
c.connector(855, 322, 145, 322, primary=False, curve=76)
c.text(500, 398, "毎フレーム、この 2 手をくり返す", scale="sm")

c.save("02-body-and-view.svg")
