---
docs: true
title: BGM を流す
---

# 03 BGM を流す

![BGM を流す](./images/00-thumbnail.svg)

前の [02 効果音を鳴らす](../02-sound-hit/LECTURE.md) で効果音がつきました。この節では、ゲーム中に
背景で流れる BGM を足します。

BGM は本教材用に用意したループ曲（CC0）`bgm.wav` です。下のボタンからダウンロードして、
解凍してできた `assets/` を `game/` の中に置いてください。

::assets[BGM つきの素材をダウンロード]

> **今回さわる `game/`:** `scenes/game-scene.js` を書き換え、`assets/` に BGM を追加

## BGM を読み込む

BGM の読み込みを足します。

:::code[`preload` の中（効果音の読み込みの後）]{filepath=scenes/game-scene.js offset=13}

```js
this.load.audio('bgm', 'assets/bgm.wav');
```

:::

## BGM をループ再生する

BGM を小さめの音量でループ再生します。ゲーム画面を抜けるときに止めます。

:::code[`create` の中（いちばん最初）]{filepath=scenes/game-scene.js offset=17}

```js
this.bgm = this.sound.add('bgm', { loop: true, volume: 0.4 });
this.bgm.play();
// 画面を抜けるときに止めないと鳴り続ける。
this.events.once('shutdown', () => this.bgm.stop());
```

:::

- `this.sound.add('bgm', { loop: true, volume: 0.4 })` … BGM を用意します。`loop: true` でくり返し、`volume: 0.4` で控えめの音量にします。
- `this.bgm.play()` … 再生を始めます。
- `this.events.once('shutdown', () => this.bgm.stop())` … このシーンが終わる（クリアやゲームオーバーへ移る）とき、
  BGM を止めます。止めないと画面が変わっても鳴り続けてしまいます。

## 動かす

ゲームを始めると BGM が流れ、結果画面へ移ると止まります。にぎやかになりました。
最後の節で、音のオン・オフを切り替える設定を作ります。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::codeview{defaultFile="scenes/game-scene.js"}
