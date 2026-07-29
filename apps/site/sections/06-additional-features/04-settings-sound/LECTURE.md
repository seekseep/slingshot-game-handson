---
docs: true
title: 設定で音を切り替える
---

# 04 設定で音を切り替える

![設定で音を切り替える](./images/00-thumbnail.svg)

前の [03 BGM を流す](../03-bgm/LECTURE.md) で音がそろいました。最後に、スタート画面で効果音と
BGM のオン・オフを切り替えられるようにします。設定はブラウザに保存して、次に開いたときも
覚えているようにします。これでゲームの完成です。

> **今回さわる `game/`:** `scenes/start-scene.js`・`scenes/game-scene.js` を書き換え

## スタート画面にトグルを足す

`StartScene` に、音の設定を切り替えるボタン（トグル）を作る仕組みを足します。設定は
`localStorage`（ブラウザに残る保存場所）にしまいます。

```js
    // 音の ON/OFF を切り替えるボタン。設定は localStorage に保存する。
    this.makeToggle(360, 350, '効果音', 'slingshot-sfx');
    this.makeToggle(360, 410, 'BGM', 'slingshot-bgm');
  }

  makeToggle(x, y, label, key) {
    const text = this.add
      .text(x, y, '', {
        fontSize: '22px',
        color: '#333333',
        backgroundColor: '#f0e6d2',
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // いまの設定を見た目に反映する。保存が 'off' のときだけ OFF。
    const render = () => {
      const on = localStorage.getItem(key) !== 'off';
      text.setText(label + ': ' + (on ? 'ON' : 'OFF'));
      text.setColor(on ? '#27ae60' : '#999999');
    };
    render();

    // クリックで ON/OFF を反転して保存する。
    text.on('pointerdown', () => {
      const on = localStorage.getItem(key) !== 'off';
      localStorage.setItem(key, on ? 'off' : 'on');
      render();
    });
  }
```

- `makeToggle(x, y, label, key)` … 指定位置にトグルを1つ作る関数です。効果音用と BGM 用の2つを作ります。
- `localStorage.getItem(key)` … 保存された設定を読みます。`'off'` のときだけオフ、それ以外はオンとみなします。
- `localStorage.setItem(key, ...)` … クリックで設定を反転して保存します。次に開いたときも覚えています。
- `render()` … いまの設定を見た目（ON/OFF の文字と色）に反映します。

## ゲーム画面で設定を見る

`GameScene` の `create` の最初で設定を読み、オンのときだけ音を鳴らすようにします。

```js
    // 設定（効果音・BGM の ON/OFF）を localStorage から読む。'off' のときだけ切る。
    this.sfxOn = localStorage.getItem('slingshot-sfx') !== 'off';
    this.bgmOn = localStorage.getItem('slingshot-bgm') !== 'off';

    // BGM は設定が ON のときだけ再生する。
    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.4 });
    if (this.bgmOn) this.bgm.play();
    this.events.once('shutdown', () => this.bgm.stop());
```

効果音を鳴らす所も、設定を見てから鳴らすように直します。

```js
      if (this.sfxOn) this.sound.play('launch'); // 発射の音（設定が ON のときだけ）。
```

```js
      if (this.sfxOn) this.sound.play('hit'); // ブタに当たった音（設定が ON のときだけ）。
```

## 動かす

スタート画面で効果音・BGM のオン・オフを切り替えられ、その設定でゲームが始まります。
ブラウザを閉じても設定は覚えています。

これでパチンコ物理ゲームは完成です。おつかれさまでした！ ゲームの中身を先に作り、
見た目や音を後から足す、という進め方も体験できました。

::preview[このステップの完成イメージ（実際に触って動かせます）]

::checkpoint{open="scenes/start-scene.js"}
