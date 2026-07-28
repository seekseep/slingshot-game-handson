---
docs: true
title: 効果音を鳴らす
---

# 02 効果音を鳴らす

![効果音を鳴らす](./images/00-thumbnail.svg)

前の [01 鳥・ブタ・箱を画像にする](../01-image/LECTURE.md) で見た目が仕上がりました。この節では、
発射したときと、ブタに当たったときに効果音を鳴らします。

> **今回さわる `game/`:** `scenes/game-scene.js` を書き換え、`assets/` に効果音を追加

## 音を読み込む

`preload` に効果音の読み込みを足します。

```js
    // 効果音も読み込む。launch=発射のとき、hit=ブタに当たったとき。
    this.load.audio('launch', 'assets/launch.wav');
    this.load.audio('hit', 'assets/hit.wav');
```

- `this.load.audio('launch', 'assets/launch.wav')` … `'launch'` という名前で音を読み込みます。

## 発射したときに鳴らす

`pointerup`（離して発射する所）で発射音を鳴らします。

```js
      bird.setStatic(false);
      bird.setVelocity(vx, vy);
      this.sound.play('launch'); // 発射の音。
```

- `this.sound.play('launch')` … 読み込んだ `'launch'` の音を1回鳴らします。

## 当たったときに鳴らす

`update` でブタを消す所で、当たった音を鳴らします。

```js
      this.scoreText.setText('スコア: ' + this.score);
      this.sound.play('hit'); // ブタに当たった音。
```

## 素材のライセンス

効果音は [Kenney](https://kenney.nl) の CC0（パブリックドメイン相当）素材です。`assets/` の
`CREDITS.txt` / `LICENSE.txt` に明記しています。CC0 なので表示義務はありませんが、感謝を込めて
クレジットに残しています。

## 動かす

鳥を発射すると音が鳴り、ブタに当たると別の音が鳴ります。手ごたえがぐっと増します。
次の節で、BGM（背景で流れる曲）を足します。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::checkpoint{open="scenes/game-scene.js"}
