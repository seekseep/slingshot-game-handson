---
docs: true
title: スタート画面を作る
---

# 08 スタート画面を作る

![スタート画面を作る](./images/00-thumbnail.svg)

前の [07 箱を積んで崩す](../07-blocks/LECTURE.md) まで、ゲームは1画面だけでした。この節では
「スタート画面」を作り、ボタンを押すとゲームが始まるようにします。そのために、画面ごとに
**シーン（Scene）** という単位でコードを分けます。

> **今回さわる `game/`:** `main.js` を書き換え（シーンを2つに分ける）

## シーンという考え方

Phaser では、タイトル画面・ゲーム本編・結果画面などを **シーン** という単位で分けて作れます。
この節では2つのシーンを用意します。

- `StartScene` … タイトルとスタートボタンを出す画面。
- `GameScene` … これまで作ってきたゲーム本編（パチンコ・箱）。

## スタート画面のシーン

タイトルとボタンを出す `StartScene` を書きます。ボタンを押すと `GameScene` へ切り替えます。

```js
class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create() {
    this.add
      .text(400, 180, 'パチンコ物理ゲーム', {
        fontSize: '36px',
        color: '#5d4037',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(400, 300, '▶ スタート', {
        fontSize: '28px',
        color: '#ffffff',
        backgroundColor: '#e08e3c',
        padding: { x: 24, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startText.on('pointerdown', () => this.scene.start('Game'));
  }
}
```

- `class StartScene extends Phaser.Scene` … 1つのシーンを「クラス」として定義します。
- `super('Start')` … このシーンに `'Start'` という名前をつけます。切り替えるときにこの名前を使います。
- `this.add.text(x, y, '文字', { ... })` … 文字を置きます。`setOrigin(0.5)` で文字の中心を指定位置に合わせます。
- `setInteractive({ useHandCursor: true })` … 押せるようにし、カーソルを指の形にします。
- `startText.on('pointerdown', () => this.scene.start('Game'))` … ボタンが押されたら `'Game'` シーンへ切り替えます。

## ゲーム本編のシーン

これまで `create` に書いていたゲーム本編を、`GameScene` クラスの `create` の中へそのまま移します。

```js
class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    // ここに、これまで書いてきた地面・箱・パチンコの処理を入れる
    // ...
  }
}
```

- `super('Game')` … このシーンの名前は `'Game'`。`StartScene` から `this.scene.start('Game')` で呼ばれます。
- 入力処理の書き方が少し変わります。`function () { ... }` の代わりに `() => { ... }`（アロー関数）を使うと、
  中の `this` がシーンを指したままになるので扱いやすくなります。

## シーンを登録して起動する

最後に、`new Phaser.Game` の `scene` に2つのシーンを**順番に**渡します。最初のものが最初に表示されます。

```js
new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  backgroundColor: '#fdf6e3',
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 } },
  },
  scene: [StartScene, GameScene],
});
```

## 動かす

最初にタイトルとスタートボタンが出ます。ボタンを押すとゲームが始まります。
次の節で、鳥を撃つたびに次の鳥がセットされる「リロード」を作ります。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::checkpoint{open="main.js"}
