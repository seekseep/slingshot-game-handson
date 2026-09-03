"""03-coordinates レクチャーのサムネイル図を生成する。

00-thumbnail.svg — 同じ 1 点を、数学の座標と Web / Phaser の座標で読み比べる。
                   SPLITTING（2 つの数え方の対比）+ VERTICALITY（y の向き）
"""

import sys
import pathlib

sys.path.insert(0, "/Users/seekseep/.claude/skills/genfig")
from genfig import Canvas, PALETTE, INK_SCALE

HERE = pathlib.Path(__file__).resolve().parent


def grid(c, x, y, w, h):
    """薄いマス目。座標の板であることを示すだけの補助線。"""
    for gx in range(int(x) + 40, int(x + w), 40):
        c.raw(f'<line x1="{gx}" y1="{y}" x2="{gx}" y2="{y + h}" '
              f'stroke="{INK_SCALE["light"]}" stroke-width="1"/>')
    for gy in range(int(y) + 40, int(y + h), 40):
        c.raw(f'<line x1="{x}" y1="{gy}" x2="{x + w}" y2="{gy}" '
              f'stroke="{INK_SCALE["light"]}" stroke-width="1"/>')


def dot(c, cx, cy, color="#0f172a"):
    c.raw(f'<circle cx="{cx}" cy="{cy}" r="7" fill="{color}"/>')


def thumbnail():
    c = Canvas(640, 360)
    c.text(320, 46, "y は、上か下か", scale="xl")

    # --- 左：数学の座標（中央が原点・y は上が正）---
    lx, ly, lw, lh = 40, 82, 240, 200
    c.sticky(lx, ly, lw, lh, color="gray")
    grid(c, lx, ly, lw, lh)
    ox, oy = lx + lw / 2, ly + lh / 2
    c.connector(lx + 16, oy, lx + lw - 16, oy, primary=False)     # x 軸
    c.connector(ox, ly + lh - 16, ox, ly + 16, primary=False)     # y 軸（上向き）
    dot(c, ox + 60, oy - 48)
    c.text(ox + 62, oy - 60, "(60, 48)", scale="sm", fill=INK_SCALE["ink"])
    c.text(ox - 8, oy + 22, "0", scale="sm")
    c.text(ox - 24, ly + 36, "y ↑", scale="sm", fill=INK_SCALE["dark"])
    c.text(lx + lw / 2, ly + lh + 30, "数学 … 中央が原点", scale="md")
    c.text(lx + lw / 2, ly + lh + 54, "y は上が正", scale="sm")

    # --- 右：Web / Phaser の座標（左上が原点・y は下が正）---
    rx, ry, rw, rh = 360, 82, 240, 200
    c.sticky(rx, ry, rw, rh, color="blue")
    grid(c, rx, ry, rw, rh)
    ox2, oy2 = rx + 24, ry + 24
    c.connector(ox2, oy2, rx + rw - 16, oy2, primary=True)        # x 軸
    c.connector(ox2, oy2, ox2, ry + rh - 16, primary=True)        # y 軸（下向き）
    dot(c, ox2 + 120, oy2 + 96, PALETTE["blue"]["text"])
    c.text(ox2 + 122, oy2 + 84, "(120, 96)", scale="sm",
           fill=PALETTE["blue"]["text"])
    c.text(ox2 + 16, oy2 + 22, "0", scale="sm", fill=PALETTE["blue"]["text"])
    c.text(ox2 + 28, ry + rh - 28, "y ↓", scale="sm",
           fill=PALETTE["blue"]["text"])
    c.text(rx + rw / 2, ry + rh + 30, "Web・Phaser … 左上が原点", scale="md",
           fill=PALETTE["blue"]["text"])
    c.text(rx + rw / 2, ry + rh + 54, "y は下が正", scale="sm",
           fill=PALETTE["blue"]["text"])

    print(c.save(HERE / "00-thumbnail.svg"))


if __name__ == "__main__":
    thumbnail()
