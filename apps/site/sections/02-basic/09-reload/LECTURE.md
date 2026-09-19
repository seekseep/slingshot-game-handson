---
docs: true
title: 発射したら次の鳥をセットする
---

# 09 発射したら次の鳥をセットする

![発射したら次の鳥をセットする](./images/00-thumbnail.svg)

前の [08 スタート画面を作る](../08-start-screen/LECTURE.md) までは、同じ鳥を何度でも引っ張れました。
本物のパチンコゲームは弾（鳥）の数が決まっています。この節では、鳥を撃つと少し待って次の鳥が
セットされる「リロード」を作り、残りの数も表示します。`GameScene` を書き換えます。

> **今回さわる `game/`:** `main.js` の `GameScene` を書き換え

## 残りの鳥を表示する

残りの鳥の数を覚えておき、左上に小さな丸で並べて見せます。

:::code[`GameScene` の `create` の中（いちばん最初）]{filepath=main.js offset=68}

```js
let birdsLeft = 5;
const reserve = this.add.graphics();
const drawReserve = () => {
  reserve.clear();
  for (let i = 0; i < birdsLeft; i++) {
    const x = 30 + i * 26;
    reserve.fillStyle(0xffffff, 1);
    reserve.fillCircle(x, 40, 9);
    reserve.lineStyle(2, 0x333333, 1);
    reserve.strokeCircle(x, 40, 9);
  }
};
```

:::

- `birdsLeft = 5` … 残りの鳥の数。撃つたびに減らします。
- `drawReserve` … 残りの数だけ、白い小さな丸を横に並べて描く関数です。数が変わるたびに呼び直します。

## 鳥を1羽ずつセットする

鳥を毎回作り直す形にします。`spawnBird` で1羽セットし、発射したら少し待ってまたセットします。

:::code[`GameScene` の `create` の中（`anchor` を決めたコードの後。前の節で鳥を1羽だけ作っていた部分を置き換える）]{filepath=main.js offset=81}

```js
// いま操作できる鳥。発射中やリロード待ちのときは null。
let bird = null;
let dragging = false;

const spawnBird = () => {
  if (birdsLeft <= 0) return;
  bird = this.add.circle(anchor.x, anchor.y, birdRadius, 0xffffff);
  bird.setStrokeStyle(3, 0x333333);
  this.matter.add.gameObject(bird, {
    shape: { type: 'circle', radius: birdRadius },
    restitution: 0.2,
  });
  // 待機中は動かないように静的にしておく。
  bird.setStatic(true);
};

drawReserve();
spawnBird();
```

:::

- `bird = null` … いま操作できる鳥。発射した後やリロード待ちのときは「無い（null）」状態にします。
- `spawnBird` … パチンコの位置に鳥を1羽用意して静的にします。残りが 0 なら何もしません。
- 最初に一度 `drawReserve()` と `spawnBird()` を呼んで、残数表示と最初の1羽を出します。

## 引っ張りを、鳥があるときだけにする

鳥は発射してから次がセットされるまでの 1.2 秒、いなくなります。その間にさわられても何も
起きないように、`pointerdown` と `pointermove` を直します。

`pointerdown` は「引っ張り始めの合図」だけにします。鳥は `spawnBird` がそのつどパチンコの
位置に作るので、押すたびに位置を戻す必要がなくなりました。

:::code[`GameScene` の `create` の中の `pointerdown`（まるごと書き換え）]{filepath=main.js offset=100}

```js
this.input.on('pointerdown', () => {
  if (!bird || dragging) return;
  dragging = true;
});
```

:::

- `if (!bird || dragging) return` … 鳥がまだ無いとき、すでに引っ張り中のときは何もしません。
- 前の節にあった `bird.setStatic(true)` / `bird.setPosition(...)` / `bird.setVelocity(0, 0)` の
  3行は消します。`spawnBird` が静的な鳥を `anchor` に置いた状態で作るので、押すたびに戻す
  仕事がなくなりました。

`pointermove` は、先頭の1行に `!bird` を足すだけです。

:::code[`GameScene` の `create` の中の `pointermove` の先頭（`if (!dragging) return;` を書き換え）]{filepath=main.js offset=106}

```js
if (!dragging || !bird) return;
```

:::

## 発射したらリロードする

発射したら鳥を手放して残りを1つ減らし、次の1羽をセットするまで待ちます。

:::code[`GameScene` の `create` の中の `pointerup`（まるごと書き換え）]{filepath=main.js offset=117}

```js
this.input.on('pointerup', () => {
  if (!dragging || !bird) return;
  dragging = false;
  aim.clear();

  const vx = (anchor.x - bird.x) * power;
  const vy = (anchor.y - bird.y) * power;
  bird.setStatic(false);
  bird.setVelocity(vx, vy);

  bird = null;
  birdsLeft -= 1;
  drawReserve();

  this.time.delayedCall(1200, () => spawnBird());
});
```

:::

- `if (!dragging || !bird) return` … 引っ張り中でないとき、または鳥がまだ無いときは何もしません。
- 発射後に `bird = null` として、飛んでいった鳥をもう操作できないようにします。
- `birdsLeft -= 1; drawReserve();` … 残りを1つ減らして表示を更新します。
- `this.time.delayedCall(1200, () => spawnBird())` … 1200ミリ秒（1.2秒）待ってから次の鳥をセットします。

## 動かす

鳥を撃つと少し待って次の鳥がパチンコにセットされ、左上の残り数が1つ減ります。
5羽を撃ち切ると鳥が出なくなります。次の節で、撃ち切ったときにゲームオーバー画面へ進むようにします。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::codeview{defaultFile="main.js"}
