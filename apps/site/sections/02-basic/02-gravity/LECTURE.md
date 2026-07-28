---
docs: true
title: 鳥に重力を与える
---

# 02 鳥に重力を与える

![鳥に重力を与える](./images/00-thumbnail.svg)

前の [01 鳥を表示する](../01-bird/LECTURE.md) では、鳥を「置いた」だけでした。この節では
物理エンジン（Matter.js）を有効にして、鳥が重力で落ちていくようにします。`index.html` は
そのまま（`main.js` を読み込むだけ）で、変えるのは `main.js` です。

> **今回さわる `game/`:** `main.js` を書き換え

## 物理エンジンを有効にする

`new Phaser.Game({ ... })` の設定に `physics` を足します。Phaser にはいくつか物理エンジンが
ありますが、今回は箱の崩れ方や積み重なりを自然に扱える **Matter.js** を使います。

```js
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 } },
  },
```

- `default: 'matter'` … このゲームで使う物理エンジンを Matter に指定します。
- `gravity: { y: 1 }` … 下向き（Y のプラス方向）に重力をかけます。値を大きくすると速く落ちます。

## 鳥を物理ボディにする

`create` の中を書き換えます。丸を作るところは同じですが、落ちる様子が見えるように**少し上（y=80）**から
始め、作った丸を **Matter の物理ボディに変換**します。

```js
    create: function () {
      const radius = 18;

      // 少し上から始めると、重力で落ちていく様子が見える。
      const bird = this.add.circle(140, 80, radius, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);

      this.matter.add.gameObject(bird, {
        shape: {
          type: 'circle',
          radius: radius,
        },
      });
    },
```

- `this.matter.add.gameObject(bird, { ... })` … 「**見た目の丸 `bird` に、物理の体をくっつける**」命令です。
- `shape` … 当たり判定の形。半径 `radius` の円（`circle`）にしています。
- 見た目（`circle`）と物理（`shape`）で同じ `radius` を渡すので、絵と当たり判定がぴったり重なります。
  以降は Matter が毎フレーム位置を計算し、Phaser がその位置に丸を描いてくれます。

## 動かす

ブラウザで開くと、鳥が上から下へ落ちていきます。まだ床がないので画面の外まで落ちて消えます。
次の節で受け止める「地面」を用意します。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::checkpoint{open="main.js"}
