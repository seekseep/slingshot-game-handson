---
docs: true
title: 地面で受け止める
---

# 03 地面で受け止める

![地面で受け止める](./images/00-thumbnail.svg)

前の [02 鳥に重力を与える](../02-gravity/LECTURE.md) では、鳥が落ちて画面の外へ消えてしまいました。
この節では画面の下に「地面」を作り、鳥を受け止めます。

> **今回さわる `game/`:** `main.js` を書き換え

## 地面を描く

`create` の最初に、画面の下いっぱいに横長の帯（地面）を描きます。見た目はグレーで塗ります。

```js
      const groundY = 400; // 地面の上面の高さ

      // 地面を描く（画面の下いっぱいに横長の帯）。グレーで塗る。
      const g = this.add.graphics();
      g.fillStyle(0x888888, 1);
      g.fillRect(0, groundY, 800, 480 - groundY);
```

- `groundY = 400` … 地面の上のふちの高さ。これより下が地面です。
- `this.add.graphics()` … 自由に線や四角を描くためのお絵かき道具です。
- `fillStyle(0x888888, 1)` … 塗る色（グレー）と濃さ（1＝不透明）を決めます。
- `fillRect(0, groundY, 800, 480 - groundY)` … 左上 (0, 400) から、幅 800・高さ 80 の四角を塗ります。

## 地面に当たり判定をつける

いま描いたのは「絵」だけなので、このままでは鳥がすり抜けます。同じ位置に**動かない当たり判定**を
置いて、鳥を受け止められるようにします。

```js
      // 描いた地面と同じ位置に、動かない当たり判定を置く。
      this.matter.add.rectangle(400, groundY + (480 - groundY) / 2, 800, 480 - groundY, {
        isStatic: true,
      });
```

- `this.matter.add.rectangle(x, y, w, h, ...)` … 四角い当たり判定を作ります。位置は**中心**で指定します。
- `isStatic: true` … 「動かない」印です。重力の影響を受けず、その場に固定されます。地面や壁に使います。

## 鳥を落として受け止める

鳥は前の節と同じく上から落とします。`restitution`（跳ね返り）を少し足しておきます。

```js
      const radius = 18;

      // 上から落として、地面で受け止められる様子を見る。
      const bird = this.add.circle(140, 80, radius, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);

      this.matter.add.gameObject(bird, {
        shape: {
          type: 'circle',
          radius: radius,
        },
        restitution: 0.2, // 跳ね返りの強さ（0=跳ねない 〜 1=よく跳ねる）
      });
```

- `restitution: 0.2` … ぶつかったときの跳ね返りの強さ。0 で跳ねず、1 に近いほどよく跳ねます。

## 動かす

ブラウザで開くと、鳥が落ちて地面の上で止まります。少しだけ跳ねてから落ち着きます。
次の節から、この鳥を飛ばす仕組みを作っていきます。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::checkpoint{open="main.js"}
