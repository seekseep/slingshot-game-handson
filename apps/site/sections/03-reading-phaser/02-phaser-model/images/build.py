"""02-phaser-model レクチャーのサムネイル図を生成する。

00-thumbnail.svg — ゲーム ▸ シーン ▸ オブジェクト の入れ子と、外にいるエンジン。
                   CONTAINER（入れ子）+ LINK（エンジンとの往復）
"""

import sys
import pathlib

sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

HERE = pathlib.Path(__file__).resolve().parent


def thumbnail():
    c = Canvas(640, 360)
    c.text(320, 48, "ゲームは、入れ子でできている", scale="xl")

    # 外側：Phaser.Game
    c.sticky(32, 82, 396, 236, color="gray")
    c.text(52, 112, "Phaser.Game", scale="lg", align="left",
           fill=PALETTE["gray"]["text"])

    # 内側：Scene
    c.sticky(56, 128, 348, 166, color="blue")
    c.text(76, 156, "Scene", scale="md", align="left",
           fill=PALETTE["blue"]["text"])

    # シーンに置かれたオブジェクト
    objects = [(126, "1f426", "鳥"), (230, "1f4e6", "箱"), (334, "1f437", "ブタ")]
    for cx, cp, label in objects:
        c.emoji(cp, cx - 26, 178, 52)
        c.text(cx, 258, label, scale="sm")

    # 外にいる物理エンジン
    c.emoji("2699", 496, 168, 72)
    c.text(532, 272, "物理エンジン", scale="md")

    # 位置の計算はエンジン、描くのはシーン側
    c.biconnector(412, 206, 486, 206, primary=True)

    c.text(320, 340, "ゲーム ▸ シーン ▸ オブジェクト、計算するエンジンは別の世界",
           scale="sm")

    print(c.save(HERE / "00-thumbnail.svg"))


if __name__ == "__main__":
    thumbnail()
