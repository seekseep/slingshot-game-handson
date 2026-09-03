"""04-lifecycle レクチャーのサムネイル図を生成する。

00-thumbnail.svg — create は 1 回、update は毎フレーム、そして去るときの片付け。
                   SOURCE-PATH-GOAL（始まり→繰り返し→終わり）+ CYCLE（update の周回）
"""

import sys
import pathlib

sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE

HERE = pathlib.Path(__file__).resolve().parent


def thumbnail():
    c = Canvas(640, 360)
    c.text(320, 46, "create は 1 回、update は毎フレーム", scale="xl")

    y = 196
    steps = [
        (108, "green",  "1f3ac", "create", "1 回だけ"),      # 🎬
        (320, "blue",   "1f501", "update", "約 60 回/秒"),   # 🔁
        (532, "gray",   "1f6aa", "終了",   "片付け"),         # 🚪
    ]
    for cx, color, cp, name, note in steps:
        c.sticky(cx - 82, y - 68, 164, 136, color=color)
        c.emoji(cp, cx - 26, y - 52, 52)
        c.text(cx, y + 14, name, scale="lg", fill=PALETTE[color]["text"])
        c.text(cx, y + 44, note, scale="sm", fill=PALETTE[color]["text"])

    c.connector(196, y, 234, y, primary=True)
    c.connector(408, y, 446, y, primary=True)

    # update だけがぐるぐる回る
    c.connector(372, y - 74, 268, y - 74, curve=-46, primary=True)
    c.text(320, y - 118, "毎フレーム", scale="sm")

    c.text(320, 338, "呼ぶのは、いつもフレームワークの側", scale="sm")

    print(c.save(HERE / "00-thumbnail.svg"))


if __name__ == "__main__":
    thumbnail()
