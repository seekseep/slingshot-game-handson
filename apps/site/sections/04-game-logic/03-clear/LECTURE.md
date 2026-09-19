---
docs: true
title: 全ブタを倒したらクリア
---

# 03 全ブタを倒したらクリア

![全ブタを倒したらクリア](./images/00-thumbnail.svg)

前の [02 当たったブタを消す](../02-hit-pig/LECTURE.md) で、ブタを消せるようになりました。
この節では、ブタを全部倒したら「クリア画面」へ進むようにします。勝ちの条件です。

> **今回さわる `game/`:** `scenes/game-scene.js` を書き換え、`scenes/clear-scene.js` を追加

## 残りのブタを数える

残りの数を覚えておきます。0 になったらクリアです。

:::code[`create` の中（ブタを置く `for` の後）]{filepath=scenes/game-scene.js offset=52}

```js
this.pigsLeft = pigPositions.length;
this.cleared = false;
```

:::

- `this.pigsLeft` … 残りのブタの数。最初は置いた数（`pigPositions.length`）です。
- `this.cleared` … もうクリアしたかどうかの印。クリア画面へ二重に進まないために使います。

## 倒すたびに減らし、0 でクリアへ

ブタを消すたびに残りを1つ減らします。0 になったらクリア画面へ進みます。

:::code[`GameScene` の `update`（まるごと書き換え）]{filepath=scenes/game-scene.js offset=152}

```js
  update() {
    for (const pig of this.pendingRemoval) {
      pig.destroy();
      this.pigsLeft -= 1;
    }
    this.pendingRemoval.clear();

    // 何度も遷移しないよう、クリアは1回だけ。
    if (!this.cleared && this.pigsLeft <= 0) {
      this.cleared = true;
      this.scene.start('Clear');
    }
  }
```

:::

- `this.pigsLeft -= 1` … ブタを1匹消すたびに残りを減らします。
- `if (!this.cleared && this.pigsLeft <= 0)` … まだクリアしておらず、残りが 0 になったら実行します。
- `this.cleared = true` … 印を立てて、次のフレームでもう一度クリアに進まないようにします。
- `this.scene.start('Clear')` … クリア画面へ切り替えます。

## クリア画面のシーン

`scenes/clear-scene.js` を新しく作ります。

:::code[ファイル全体（新規作成）]{filepath=scenes/clear-scene.js offset=1}

```js
class ClearScene extends Phaser.Scene {
  constructor() {
    super('Clear');
  }

  create() {
    this.add
      .text(360, 200, 'クリア！', {
        fontSize: '40px',
        color: '#2e7d32',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(360, 280, 'クリックでスタートに戻る', {
        fontSize: '18px',
        color: '#555555',
      })
      .setOrigin(0.5);

    this.input.once('pointerdown', () => this.scene.start('Start'));
  }
}
```

:::

登録も忘れずに。`index.html` に `scenes/clear-scene.js` の読み込みを足し、`main.js` の
`scene` 配列に `ClearScene` を加えます。

:::code[`new Phaser.Game({ ... })` の `scene` 配列]{filepath=main.js offset=10}

```js
  scene: [StartScene, GameScene, GameOverScene, ClearScene],
```

:::

## 動かす

ブタを3匹とも倒すと「クリア！」の画面になります。鳥を撃ち切って倒しきれなければ、
これまでどおりゲームオーバーです。これで勝ち負けがそろいました。次の節で、スコアを足します。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::codeview{defaultFile="scenes/game-scene.js"}
