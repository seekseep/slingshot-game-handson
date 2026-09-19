// 左はブラウザ、右は Phaser。登録の仕方が同じ形をしていることを見る。

// --- ブラウザ側 -----------------------------------------------------------
let domCount = 0;

// 発生源.addEventListener('名前', ハンドラ)
document.querySelector('#dom-button').addEventListener('click', (event) => {
  domCount += 1;
  document.querySelector('#dom-count').textContent = domCount;
});

// --- Phaser 側 ------------------------------------------------------------
class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    this.count = 0;

    const target = this.add.rectangle(150, 76, 150, 52, 0xe08e3c);
    target.setStrokeStyle(3, 0x333333);
    this.add
      .text(150, 76, '押す', { fontSize: '16px', color: '#ffffff' })
      .setOrigin(0.5);

    // 発生源.on('名前', ハンドラ)
    this.input.on('pointerdown', (pointer) => {
      this.count += 1;
      document.querySelector('#phaser-count').textContent = this.count;
    });
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage',
  width: 300,
  height: 152,
  backgroundColor: '#fdf6e3',
  scene: [MainScene],
});
