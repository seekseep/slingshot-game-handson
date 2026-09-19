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

:::code[`new Phaser.Game({ ... })` に渡す設定オブジェクトの中（`scene` の前）]{filepath=main.js offset=6}

```js
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 } },
  },
```

:::

- `default: 'matter'` … このゲームで使う物理エンジンを Matter に指定します。
- `gravity: { y: 1 }` … 下向き（Y のプラス方向）にかかる重力の強さです。値を大きくすると速く落ちます。

`gravity` について、ひとつ正直に書いておきます。**`y: 1` は Matter の初期値そのもの**なので、
この行を消しても鳥は同じように落ちます。ここで実際に落下を起こしているのは、
`default: 'matter'` と、このあと書く `this.matter.add.gameObject(...)` の2つです。
それでも書いてあるのは、**あとで強さを変えられる場所はここだ**と分かるようにするためです。
試しに `y: 2` にすると、落ち方がはっきり速くなります。

なお `1` は 9.8m/s² のような物理の単位ではなく、単なる倍率です。60fps で動かすと
実際の加速度はおよそ 1000px/秒² になります。「この世界では 1m = 100px」と思って眺めると、
地球の重力とだいたい同じ落ち方に見える、という具合に調整されています。

## 鳥を物理ボディにする

`create` の中を書き換えます。丸を作るところは同じですが、落ちる様子が見えるように**少し上（y=80）**から
始め、作った丸を **Matter の物理ボディに変換**します。

:::code[設定オブジェクトの `scene` の中にある `create`（まるごと書き換え）]{filepath=main.js offset=11}

```js
    create: function () {
      const birdRadius = 18;

      const bird = this.add.circle(140, 80, birdRadius, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);

      this.matter.add.gameObject(bird, {
        shape: {
          type: 'circle',
          radius: birdRadius,
        },
      });
    },
```

:::

- `this.matter.add.gameObject(bird, { ... })` … 「**見た目の丸 `bird` に、物理の体をくっつける**」命令です。
- `shape` … 当たり判定の形。半径 `birdRadius` の円（`circle`）にしています。
- `radius: birdRadius` の左右は役割が違います。左の `radius` は **Matter が決めている名前**なので変えられません。
  右の `birdRadius` は**自分でつけた変数名**なので、好きな名前にできます。

## `circle` と `gameObject` — 絵と体は別もの

`create` の中には、名前の似た 2 行が並んでいます。`this.add.circle(...)` と
`this.matter.add.gameObject(...)` です。どちらも「追加する（add）」ですが、
**追加している先の世界が違います**。ここが Phaser でいちばん取り違えやすいところなので、
落ちる鳥が目の前にあるうちに整理しておきます。

- `this.add.circle(...)` … **Phaser の世界**に「見た目」を置く命令です。画面に丸を描くのが仕事で、
  重さも速度も持ちません。[01 鳥を表示する](../01-bird/LECTURE.md) の鳥が落ちなかったのは、
  これしか書いていなかったからです。
- `this.matter.add.gameObject(bird, ...)` … **Matter の世界**に「体（body）」を作り、
  それを `bird` に結びつける命令です。Matter は絵のことを何も知りません。知っているのは
  「半径 18 の丸が (140, 80) にあって、いま速度がこれくらい」という**数字だけ**です。

結びついたあとは、毎フレーム **① Matter が体の新しい位置を計算する → ② Phaser がその位置に
`bird` を描き直す**、という 2 手が繰り返されます。鳥が落ちて見えるのは、その往復の結果です。

### 半径を 2 回書いているのはなぜか

`this.add.circle(..., birdRadius, ...)` の `birdRadius` は**絵の半径**、
`shape: { radius: birdRadius }` の `birdRadius` は**体の半径**です。別の世界の設定なので、
それぞれに渡す必要があります。同じ変数を渡しているから絵と当たり判定がぴったり重なっているだけで、
片方だけ `birdRadius * 2` にすれば、見た目より大きな当たり判定を持つ鳥も作れてしまいます。
「絵は当たっていないのにぶつかる」ときは、たいていこの 2 つが食い違っています。

### 変数が `bird` ひとつのままなのはなぜか

`this.matter.add.gameObject(bird, ...)` は、新しいオブジェクトを作って返すのではなく、
**`bird` 自身に物理の機能を足して**くれます。だから `const body = ...` のように受け取る変数を
用意していません。そのかわり、この行より後ろの `bird` には、それまで無かった命令が増えています。

```js
bird.setStrokeStyle(3, 0x333333); // 絵の命令（gameObject の前から使える）
bird.setVelocity(12, -12); // 体の命令（04 で使う。勢いをつける）
bird.setStatic(true); // 体の命令（05 で使う。いまは計算しないで、と伝える）
```

同じ `bird` から絵の命令と体の命令の両方が呼べるのは、1 つのオブジェクトが 2 つの世界に
またがっているからです。

この「絵と体」の関係は、02 章を書き終えたあとの
[ゲーム・シーン・オブジェクト・エンジン](../../03-reading-phaser/02-phaser-model/LECTURE.md)
で図と一緒にもう一度整理します。いまは **`circle` は絵、`gameObject` は体をくっつける命令**、
と押さえておけば先へ進めます。

## 動かす

ブラウザで開くと、鳥が上から下へ落ちていきます。まだ床がないので画面の外まで落ちて消えます。
次の節で受け止める「地面」を用意します。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::codeview{defaultFile="main.js"}
