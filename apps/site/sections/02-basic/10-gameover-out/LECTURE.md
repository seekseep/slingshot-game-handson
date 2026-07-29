---
docs: true
title: 弾切れでゲームオーバー
---

# 10 弾切れでゲームオーバー

![弾切れでゲームオーバー](./images/00-thumbnail.svg)

前の [09 発射したら次の鳥をセットする](../09-reload/LECTURE.md) で、鳥の数が決まりました。
この節では、鳥を撃ち切ったら「ゲームオーバー画面」へ進むようにします。3つ目のシーンを足します。

> **今回さわる `game/`:** `main.js` を書き換え（ゲームオーバーのシーンを追加）

## ゲームオーバーのシーン

ゲームオーバーの文字を出し、クリックでスタート画面に戻る `GameOverScene` を作ります。

```js
class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    this.add
      .text(360, 200, 'ゲームオーバー', {
        fontSize: '36px',
        color: '#c0392b',
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

- `super('GameOver')` … このシーンの名前は `'GameOver'`。
- `this.input.once('pointerdown', ...)` … `once` は「一度だけ」反応します。押したら `'Start'` へ戻ります。

## 撃ち切ったら移動する

リロードのタイミングを見直します。次の鳥がまだあるならセット、無ければゲームオーバーへ進みます。

```js
      // 少し待ってから、次の鳥をセットする。もう鳥がなければゲームオーバーへ。
      this.time.delayedCall(1200, () => {
        if (birdsLeft > 0) {
          spawnBird();
        } else {
          this.scene.start('GameOver');
        }
      });
```

- `if (birdsLeft > 0)` … まだ鳥が残っていれば、次の1羽をセットします。
- `else { this.scene.start('GameOver') }` … 残りが 0 なら、ゲームオーバー画面へ切り替えます。

## シーンを3つ登録する

`scene` の配列に `GameOverScene` を足します。

```js
  scene: [StartScene, GameScene, GameOverScene],
```

## 動かす

鳥を5羽撃ち切ると、少し待ってゲームオーバー画面になります。クリックするとスタート画面に戻り、
また遊べます。これで「始まり」と「終わり」がそろいました。次の節では、増えてきたコードを
シーンごとにファイルへ分けて整理します。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::checkpoint{open="main.js"}
