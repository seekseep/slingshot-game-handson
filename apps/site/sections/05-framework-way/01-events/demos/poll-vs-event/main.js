// 同じ操作を 2 通りで数える。
//   イベント   … pointerdown が起きた「回数」
//   ポーリング … update で isDown が true だった「フレーム数」
class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    this.downCount = 0; // イベントで数えた「押した回数」
    this.frameCount = 0; // ポーリングで数えた「押されていたフレーム数」

    this.add.text(
      24,
      20,
      'この枠の中をクリック／押したままドラッグしてください',
      {
        fontSize: '15px',
        color: '#777777',
      },
    );

    // 起きたら、教えてもらう。押した「瞬間」に 1 回だけ通る。
    this.input.on('pointerdown', () => {
      this.downCount += 1;
    });

    this.add.text(40, 66, "イベント　on('pointerdown')", {
      fontSize: '17px',
      color: '#2b6cb0',
    });
    this.add.text(40, 151, 'ポーリング　update の isDown', {
      fontSize: '17px',
      color: '#c0392b',
    });

    this.eventText = this.add.text(430, 66, '', {
      fontSize: '17px',
      color: '#2b6cb0',
    });
    this.pollText = this.add.text(430, 151, '', {
      fontSize: '17px',
      color: '#c0392b',
    });

    // 伸び方の違いを、棒の長さでも見せる。
    this.eventBar = this.add
      .rectangle(40, 110, 0, 20, 0x2b6cb0)
      .setOrigin(0, 0.5);
    this.pollBar = this.add
      .rectangle(40, 195, 0, 20, 0xc0392b)
      .setOrigin(0, 0.5);
  }

  update() {
    // 毎フレーム、聞きに行く。押している「間」ずっと通る（1 秒に約 60 回）。
    if (this.input.activePointer.isDown) this.frameCount += 1;

    this.eventText.setText(this.downCount + ' 回');
    this.pollText.setText(this.frameCount + ' フレーム');

    this.eventBar.width = Math.min(this.downCount * 10, 604);
    this.pollBar.width = Math.min(this.frameCount * 10, 604);
  }

  reset() {
    this.downCount = 0;
    this.frameCount = 0;
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage',
  width: 684,
  height: 240,
  backgroundColor: '#fdf6e3',
  scene: [MainScene],
});

document.querySelector('#reset').addEventListener('click', () => {
  game.scene.getScene('Main').reset();
});
