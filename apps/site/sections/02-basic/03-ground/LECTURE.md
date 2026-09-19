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

画面の下いっぱいに横長の帯（地面）を描きます。見た目はグレーで塗ります。

:::code[`create` の中（いちばん最初）]{filepath=main.js offset=12}

```js
const groundX = 0;
const groundY = 400;
const groundWidth = 720;
const groundHeight = 80;

const ground = this.add.graphics();
ground.fillStyle(0x888888, 1);
ground.fillRect(groundX, groundY, groundWidth, groundHeight);
```

:::

地面の帯は、この 4 つの数字だけで決まります。**左上の角**が `(groundX, groundY)`、そこから
`groundWidth` × `groundHeight` の大きさ、という読み方です。

![地面の帯は、左上 (0, 400) から幅 720・高さ 80。下端が画面の下端 480 にちょうど届く](./images/01-ground-rect.svg)

_図: `groundY` の 400 は「上から 400」。そこから下 80 ぶんが地面になる。_

- `groundX` / `groundY` … 帯の**左上の角**。`groundY` より下が地面になります。
- `groundWidth` / `groundHeight` … 帯の幅と高さ。画面の幅いっぱいの 720、画面の下端 480 まで届く 80 です。
- `this.add.graphics()` … 自由に線や四角を描くためのお絵かき道具です。
- `fillStyle(0x888888, 1)` … 塗る色（グレー）と濃さ（1＝不透明）を決めます。
- `fillRect(左上のx, 左上のy, 幅, 高さ)` … 四角を塗ります。位置は**左上の角**で指定します。

## 地面に当たり判定をつける

いま描いたのは「絵」だけなので、このままでは鳥がすり抜けます。同じ位置に**動かない当たり判定**を
置いて、鳥を受け止められるようにします。幅と高さは絵とまったく同じ値を渡し、**位置の指定のしかただけ**
が変わります。

:::code[`create` の中（いま書いた地面を描くコードの続き）]{filepath=main.js offset=21}

```js
// 絵は左上ぞろえ、体は中心ぞろえなので、半分ずらして同じ場所に重ねる。
this.matter.add.rectangle(
  groundX + groundWidth / 2,
  groundY + groundHeight / 2,
  groundWidth,
  groundHeight,
  {
    isStatic: true,
  },
);
```

:::

- `this.matter.add.rectangle(x, y, w, h, ...)` … 四角い当たり判定を作ります。位置は**中心**で指定します。
- `groundX + groundWidth / 2` … 左上から幅の半分だけ右へ。中心の x は `0 + 360` で 360。
- `groundY + groundHeight / 2` … 左上から高さの半分だけ下へ。中心の y は `400 + 40` で 440。
- `isStatic: true` … 「動かない」印です。重力の影響を受けず、その場に固定されます。地面や壁に使います。

同じ帯を指しているのに、絵は `(0, 400)`、体は `(360, 440)` と数字が違います。**どこを基準に
置くかが違うだけ**で、足している「半分」はその差を埋めるためのものです。

## 鳥を落として受け止める

鳥は前の節と同じく上から落とします。`restitution`（跳ね返り）を少し足しておきます。

:::code[`create` の中（当たり判定を置いたコードの続き）]{filepath=main.js offset=32}

```js
const birdRadius = 18;

const bird = this.add.circle(140, 80, birdRadius, 0xffffff);
bird.setStrokeStyle(3, 0x333333);

this.matter.add.gameObject(bird, {
  shape: {
    type: 'circle',
    radius: birdRadius,
  },
  restitution: 0.2,
});
```

:::

- `restitution: 0.2` … ぶつかったときの跳ね返りの強さ。0 で跳ねず、1 に近いほどよく跳ねます。

## `rectangle` と `gameObject` — 体だけ置くか、絵と結びつけるか

この節では、Matter への追加のしかたが 2 通り出てきました。地面は `this.matter.add.rectangle(...)`、
鳥は `this.matter.add.gameObject(bird, ...)` です。同じ物理世界に置いているのに書き方が違うのは、
**結びつける相手がいるかどうか**が違うからです。

前の節で見たとおり、絵（Phaser のオブジェクト）と体（Matter の body）は別ものでした。
別ものなので、組み合わせは 3 通りあります。

- **絵だけ** … `this.add.graphics()` で塗った地面の帯や、前の節の鳥。見えますが、すり抜けます。
- **体だけ** … `this.matter.add.rectangle(...)` で置いた地面の当たり判定。ぶつかりますが、見えません。
- **絵＋体** … `this.add.circle(...)` の絵に `this.matter.add.gameObject(...)` で体を結びつけた鳥。
  見えて、ぶつかって、動きます。

いまの地面は、上の 2 つを**別々に**並べて「見えて、ぶつかる」状態を作っています。絵は `graphics`、
体は `matter.add.rectangle`。この 2 つはお互いを知りません。同じ場所に重なって見えるのは、
私たちが同じ 4 つの変数から両方の数字を計算したからです。渡す数字の形が違う（絵は左上、体は中心）
理由は [Phaser の座標](../../03-reading-phaser/01-coordinates/LECTURE.md) であらためて扱います。

### なぜ地面は結びつけないのか

`gameObject` の仕事は「**Matter が計算した体の位置を、毎フレーム絵に移す**」ことでした。
地面には `isStatic: true` が付いていて、位置は一生変わりません。移す仕事がないのだから、
結びつける必要もない、というのが 1 つめの理由です。

もう 1 つは、地面の絵を `graphics` で描いていることです。`fillRect(groundX, groundY, ...)` は
「左上 (0, 400) から塗る」と**座標を絵の中に直接書き込む**命令で、`graphics` 自身は原点
(0, 0) に置かれたままです。ここに体を結びつけると `graphics` ごと体の中心 (360, 440) へ
動かされ、塗った帯もいっしょに右下へずれてしまいます。

### 動かしたくなったら結びつける

逆に「動く床」や「崩れる壁」を作りたくなったら、鳥と同じ形にします。
[07 箱を積んで崩す](../07-blocks/LECTURE.md) の箱がまさにそれで、`this.add.rectangle(...)` で
絵を置いてから `this.matter.add.gameObject(...)` で体を結びつけています。箱は鳥に当たって
動くので、Matter が計算した位置に絵がついてこないと困るからです。

**動かすなら絵と体を結びつける。動かないなら体だけ置けばいい。** これが使い分けの基準です。

### `this.add.rectangle` と `this.matter.add.rectangle` は別もの

名前が同じなので、ここはいちばん取り違えやすいところです。

- `this.add.rectangle(x, y, w, h, 色)` … **Phaser** の絵。四角が見えますが、当たり判定はありません。
- `this.matter.add.rectangle(x, y, w, h, 設定)` … **Matter** の体。ぶつかりますが、何も見えません。

`this.` のあとに `matter` が挟まっているかどうかで、追加先の世界が変わります。
「四角を出したのに落ちてこない」「ぶつかるのに何も見えない」で困ったときは、まずここを見てください。

## 動かす

ブラウザで開くと、鳥が落ちて地面の上で止まります。少しだけ跳ねてから落ち着きます。
次の節から、この鳥を飛ばす仕組みを作っていきます。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::codeview{defaultFile="main.js"}
