---
docs: true
title: シーンごとにファイルを分ける
---

# 11 シーンごとにファイルを分ける

![シーンごとにファイルを分ける](./images/00-thumbnail.svg)

前の [10 弾切れでゲームオーバー](../10-gameover-out/LECTURE.md) で、`main.js` に3つのシーンが
入って長くなりました。この節では**動きは変えず**に、シーンごとにファイルを分けて整理します。
こういう「動きを変えずに整理する作業」をリファクタリングと呼びます。

> **今回さわる `game/`:** ファイル構成を変える（`scenes/` を作る）

## ファイル構成を変える

`scenes/` フォルダを作り、シーンを1つずつ別ファイルに移します。

```text
game/
├── index.html
├── main.js
└── scenes/
    ├── start-scene.js
    ├── game-scene.js
    └── gameover-scene.js
```

- `scenes/start-scene.js` … `StartScene` クラスだけを入れます。
- `scenes/game-scene.js` … `GameScene` クラスだけを入れます。
- `scenes/gameover-scene.js` … `GameOverScene` クラスだけを入れます。

中身のコードはそのまま移すだけです。クラスはファイルをまたいで共有されるので、書き換えは要りません。

## main.js は起動だけにする

`main.js` に残すのは、ゲームを起動する設定だけです。

```js
// 挙動は 10 と同じ。コードをシーンごとにファイルへ分けて整理する。

new Phaser.Game({
  type: Phaser.AUTO,
  width: 720,
  height: 480,
  backgroundColor: '#fdf6e3',
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 } },
  },
  scene: [StartScene, GameScene, GameOverScene],
});
```

## ファイルを読み込む順番

`index.html` で、分けたファイルを読み込みます。**シーンを先に、`main.js` を最後に**読み込むのが大切です。
`main.js` が起動するとき、3つのシーンのクラスがすでに用意されている必要があるからです。

```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.90.0/phaser.min.js"></script>
    <script src="scenes/start-scene.js" defer></script>
    <script src="scenes/game-scene.js" defer></script>
    <script src="scenes/gameover-scene.js" defer></script>
    <script src="main.js" defer></script>
```

- 上から順に、Phaser 本体 → 各シーン → `main.js` の順で読み込みます。
- `defer` を付けているので、読み込みの順番どおりに実行されます。

## 動かす

見た目も動きも 10 とまったく同じです。でも、コードがシーンごとに整理されて、これから機能を
足すときに読みやすくなりました。ここまでで「基本」は完成です。次の章から、標的（ブタ）や
スコアなど、ゲームのルールを作っていきます。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::checkpoint{open="main.js"}
