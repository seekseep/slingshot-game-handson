// イベントは「発生源・名前・ハンドラ」の 3 点セット。
// 届いたものをそのまま 3 列に並べて、誰から何が来たのかを見比べる。
class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    this.rows = [];

    this.add.text(
      20,
      16,
      '左の白い板をクリック／ドラッグ。オレンジのボタンも押せます。',
      {
        fontSize: '14px',
        color: '#777777',
      },
    );

    // 遊ぶ場所。
    this.add
      .rectangle(20, 44, 336, 262, 0xffffff)
      .setOrigin(0)
      .setStrokeStyle(2, 0xcccccc);
    this.bird = this.add
      .circle(188, 180, 16, 0xffffff)
      .setStrokeStyle(3, 0x333333);

    // 発生源 ①：画面全体（this.input）。どこを押しても届く。
    this.input.on('pointerdown', (pointer) => {
      // ハンドラの引数に詳しい情報が届く。ゲーム画面の左上が原点なので、そのまま渡せる。
      this.bird.setPosition(pointer.x, pointer.y);
      this.log(
        'this.input',
        'pointerdown',
        'pointer = (' + this.xy(pointer) + ')',
      );
    });

    this.input.on('pointerup', (pointer) => {
      this.log(
        'this.input',
        'pointerup',
        'pointer = (' + this.xy(pointer) + ')',
      );
    });

    // 発生源 ②：部品そのもの。この四角を押したときだけ届く。
    const button = this.add
      .rectangle(188, 268, 150, 40, 0xe08e3c)
      .setStrokeStyle(3, 0x333333);
    this.add
      .text(188, 268, 'ボタン', { fontSize: '17px', color: '#ffffff' })
      .setOrigin(0.5);

    button.setInteractive({ useHandCursor: true });
    button.on('pointerdown', () =>
      this.log('button', 'pointerdown', 'この部品だけに届く'),
    );
    button.on('pointerover', () =>
      this.log('button', 'pointerover', 'カーソルが乗った'),
    );

    // 受け取ったイベントの表示欄。
    this.add
      .rectangle(372, 44, 332, 262, 0xffffff)
      .setOrigin(0)
      .setStrokeStyle(2, 0xcccccc);
    this.add.text(
      384,
      54,
      '発生源'.padEnd(12) + '名前'.padEnd(12) + 'ハンドラの引数',
      {
        fontSize: '12px',
        color: '#777777',
        fontFamily: 'ui-monospace, Menlo, monospace',
      },
    );
    this.logText = this.add.text(384, 78, '', {
      fontSize: '12px',
      color: '#333333',
      lineSpacing: 6,
      fontFamily: 'ui-monospace, Menlo, monospace',
    });
  }

  xy(pointer) {
    return Math.round(pointer.x) + ', ' + Math.round(pointer.y);
  }

  log(source, name, detail) {
    this.rows.unshift(source.padEnd(12) + name.padEnd(13) + detail);
    if (this.rows.length > 11) this.rows.pop();
    this.logText.setText(this.rows);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 720,
  height: 320,
  backgroundColor: '#fdf6e3',
  scene: [MainScene],
});
