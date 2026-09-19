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

:::code[トップレベル（`new Phaser.Game(...)` より前）]{filepath=main.js offset=1}

```js
class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create() {
    this.add
      .text(360, 180, 'パチンコ物理ゲーム', {
        fontSize: '36px',
        color: '#5d4037',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(360, 300, '▶ スタート', {
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

:::

- `class StartScene extends Phaser.Scene` … 1つのシーンを「クラス」として定義します。
- `super('Start')` … このシーンに `'Start'` という名前をつけます。切り替えるときにこの名前を使います。
- `this.add.text(x, y, '文字', { ... })` … 文字を置きます。`setOrigin(0.5)` で文字の中心を指定位置に合わせます。
- `setInteractive({ useHandCursor: true })` … 押せるようにし、カーソルを指の形にします。
- `startText.on('pointerdown', () => this.scene.start('Game'))` … ボタンが押されたら `'Game'` シーンへ切り替えます。

## ゲーム本編のシーン

これまで `create` に書いていたゲーム本編を、`GameScene` クラスの `create` の中へそのまま移します。

:::code[トップレベル（`StartScene` の後）]{filepath=main.js offset=29}

```js
class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    const groundX = 360;
    const groundY = 440;
    const groundWidth = 720;
    const groundHeight = 80;
    const groundTop = groundY - groundHeight / 2; // 地面の上面。物はこの高さに乗る

    const ground = this.add.rectangle(
      groundX,
      groundY,
      groundWidth,
      groundHeight,
      0x888888,
    );

    this.matter.add.gameObject(ground, { isStatic: true });

    const boxSize = 40;
    const towerX = 560;
    for (let i = 0; i < 3; i++) {
      const boxY = groundTop - boxSize / 2 - i * boxSize;
      const box = this.add.rectangle(towerX, boxY, boxSize, boxSize, 0xdddddd);
      box.setStrokeStyle(3, 0x333333);
      this.matter.add.gameObject(box, { restitution: 0.1 });
    }

    const anchor = { x: 140, y: 300 };
    const power = 0.22; // 引っ張った長さを速さに変える倍率

    this.add.circle(anchor.x, anchor.y, 6, 0xbbbbbb);

    const aim = this.add.graphics();

    const birdRadius = 18;
    const bird = this.add.circle(anchor.x, anchor.y, birdRadius, 0xffffff);
    bird.setStrokeStyle(3, 0x333333);

    this.matter.add.gameObject(bird, {
      shape: {
        type: 'circle',
        radius: birdRadius,
      },
      restitution: 0.2,
    });

    // 待機中は動かないように静的にしておく。
    bird.setStatic(true);

    let dragging = false;

    this.input.on('pointerdown', () => {
      bird.setStatic(true);
      bird.setPosition(anchor.x, anchor.y);
      bird.setVelocity(0, 0);
      dragging = true;
    });

    this.input.on('pointermove', (pointer) => {
      if (!dragging) return;

      bird.setPosition(pointer.x, pointer.y);

      const forwardX = anchor.x + (anchor.x - bird.x) * 1.5;
      const forwardY = anchor.y + (anchor.y - bird.y) * 1.5;
      aim.clear();
      aim.lineStyle(2, 0x333333, 0.5);
      aim.lineBetween(bird.x, bird.y, forwardX, forwardY);
    });

    this.input.on('pointerup', () => {
      if (!dragging) return;
      dragging = false;

      aim.clear();

      const vx = (anchor.x - bird.x) * power;
      const vy = (anchor.y - bird.y) * power;

      bird.setStatic(false);
      bird.setVelocity(vx, vy);
    });
  }
}
```

:::

- `super('Game')` … このシーンの名前は `'Game'`。`StartScene` から `this.scene.start('Game')` で呼ばれます。
- 入力処理の書き方が少し変わります。`function () { ... }` の代わりに `() => { ... }`（アロー関数）を使うと、
  中の `this` がシーンを指したままになるので扱いやすくなります。

## シーンを登録して起動する

最後に、`new Phaser.Game` の `scene` に2つのシーンを**順番に**渡します。最初のものが最初に表示されます。

:::code[トップレベル（`new Phaser.Game({ ... })` の呼び出しをまるごと書き換え）]{filepath=main.js offset=118}

```js
new Phaser.Game({
  type: Phaser.AUTO,
  width: 720,
  height: 480,
  backgroundColor: '#fdf6e3',
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 } },
  },
  scene: [StartScene, GameScene],
});
```

:::

## 動かす

最初にタイトルとスタートボタンが出ます。ボタンを押すとゲームが始まります。
次の節で、鳥を撃つたびに次の鳥がセットされる「リロード」を作ります。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::codeview{defaultFile="main.js"}
