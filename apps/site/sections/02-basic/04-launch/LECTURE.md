---
docs: true
title: クリックで飛ばす
---

# 04 クリックで飛ばす

![クリックで飛ばす](./images/00-thumbnail.svg)

前の [03 地面で受け止める](../03-ground/LECTURE.md) で、鳥が地面の上に乗るようになりました。
この節では、クリックすると鳥に勢いをつけて飛ばします。まずは「決まった速さ・決まった向き」で
飛ばし、次の節でパチンコらしく「引っ張った分だけ飛ぶ」ように発展させます。

> **今回さわる `game/`:** `main.js` を書き換え

## 鳥をパチンコの位置に置く

落ちてくる代わりに、鳥を最初から地面の上（パチンコの位置）に置いておきます。

```js
      const radius = 18;

      // 鳥は地面の上（パチンコの位置）に置いておく。
      const bird = this.add.circle(140, groundY - radius, radius, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);

      this.matter.add.gameObject(bird, {
        shape: {
          type: 'circle',
          radius: radius,
        },
        restitution: 0.2,
      });
```

- `groundY - radius` … 鳥の中心を地面のちょうど上にのせるための高さです。半径のぶんだけ持ち上げています。

## クリックで勢いをつける

画面をクリックしたときに、鳥へ速度を与えて飛ばします。

```js
      // クリックしたら、右上に向かって初速を与えて飛ばす。
      this.input.on('pointerdown', function () {
        bird.setVelocity(12, -12);
      });
```

- `this.input.on('pointerdown', ...)` … 画面が押された（クリック／タップされた）ときに中の処理を実行します。
- `bird.setVelocity(12, -12)` … 鳥の速度を「横 +12（右へ）・縦 −12（上へ）」に設定します。
  Y はプラスが下向きなので、マイナスで上向きになります。結果として右上へ飛び出します。

## 動かす

ブラウザで開いてクリックすると、鳥が右上へ飛び、放物線を描いて地面に落ちます。
ただし今は毎回同じ飛び方です。次の節で、引っ張った向きと強さで飛び方が変わる「パチンコ」にします。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::checkpoint{open="main.js"}
