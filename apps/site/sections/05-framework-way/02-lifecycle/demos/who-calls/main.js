// ライブラリは自分が呼ぶ。フレームワークは向こうが呼ぶ。
// 同じ画面で、2 つの数字の増え方を見比べる。
let libraryCalls = 0;
let lastResult = '—';

class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    this.frameworkCalls = 0;

    this.add.text(40, 26, 'ライブラリ（呼ぶ人 = 自分）', {
      fontSize: '16px',
      color: '#2b6cb0',
    });
    this.add.text(400, 26, 'フレームワーク（呼ぶ人 = 相手）', {
      fontSize: '16px',
      color: '#c0392b',
    });

    this.add.text(40, 58, 'Math.hypot(3, 4)', {
      fontSize: '13px',
      color: '#777777',
      fontFamily: 'ui-monospace, Menlo, monospace',
    });
    this.add.text(400, 58, 'update()', {
      fontSize: '13px',
      color: '#777777',
      fontFamily: 'ui-monospace, Menlo, monospace',
    });

    this.libraryText = this.add.text(40, 100, '', {
      fontSize: '19px',
      color: '#333333',
      lineSpacing: 10,
    });
    this.frameworkText = this.add.text(400, 100, '', {
      fontSize: '19px',
      color: '#333333',
      lineSpacing: 10,
    });
  }

  update() {
    // この行を実行させる `this.update()` は、どこにも書いていない。呼ぶのは Phaser。
    this.frameworkCalls += 1;

    this.libraryText.setText([
      '呼ばれた回数',
      '　' + libraryCalls + ' 回',
      '返ってきた値',
      '　' + lastResult,
    ]);
    this.frameworkText.setText([
      '呼ばれた回数',
      '　' + this.frameworkCalls + ' 回',
      'こちらからは',
      '　一度も呼んでいない',
    ]);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage',
  width: 684,
  height: 240,
  backgroundColor: '#fdf6e3',
  scene: [MainScene],
});

document.querySelector('#call').addEventListener('click', () => {
  // ライブラリは、自分の好きなタイミングで自分から呼ぶ。押さなければ何も起きない。
  lastResult = Math.hypot(3, 4).toString();
  libraryCalls += 1;
});
