"""05-events レクチャーのサムネイル図を生成する。

00-thumbnail.svg — 出来事を受け取る（イベント）と、状態を聞きに行く（ポーリング）の対比。
                   SPLITTING（2 つのやり方）+ SOURCE-PATH-GOAL（届く／聞きに行く）
"""

import sys
import pathlib

sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

HERE = pathlib.Path(__file__).resolve().parent


def thumbnail():
    c = Canvas(640, 360)
    c.text(320, 46, "聞きに行く？ 教えてもらう？", scale="xl")

    # --- 上段：イベント（押した瞬間に 1 回だけ届く）---
    y1 = 150
    c.emoji("1f446", 62, y1 - 42, 60)                      # 👆
    c.text(92, y1 + 46, "押した瞬間", scale="sm")
    c.connector(146, y1, 330, y1, label="pointerdown", primary=True)
    c.sticky(344, y1 - 44, 252, 88, color="green")
    c.text(470, y1 - 8, "ハンドラが動く", scale="lg",
           fill=PALETTE["green"]["text"])
    c.text(470, y1 + 22, "1 回", scale="sm", fill=PALETTE["green"]["text"])

    # --- 下段：ポーリング（毎フレーム状態を見に行く）---
    y2 = 272
    c.emoji("1f501", 62, y2 - 42, 60)                      # 🔁
    c.text(92, y2 + 46, "毎フレーム", scale="sm")
    c.connector(146, y2, 330, y2, label="isDown ？", primary=False)
    c.sticky(344, y2 - 44, 252, 88, color="gray")
    c.text(470, y2 - 8, "自分で見に行く", scale="lg",
           fill=PALETTE["gray"]["text"])
    c.text(470, y2 + 22, "約 60 回/秒", scale="sm", fill=PALETTE["gray"]["text"])

    print(c.save(HERE / "00-thumbnail.svg"))


if __name__ == "__main__":
    thumbnail()
