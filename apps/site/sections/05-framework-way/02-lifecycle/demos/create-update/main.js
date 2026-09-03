// create が何回呼ばれたかは、シーンの外（この変数）で数える。
// create の中で 0 にしてしまうと、当然いつも 1 になってしまうため。
let createCount = 0;

class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    createCount += 1;

    this.frames = 0;
    this.elapsed = 0;

    this.label = this.add.text(24, 24, '', {
      fontSize: '20px',
      color: '#333333',
      lineSpacing: 10,
    });

    // update で動かすための丸。create で「置く」のは 1 回だけ。
    this.ball = this.add.circle(60, 180, 16, 0xffffff);
    this.ball.setStrokeStyle(3, 0x333333);
    this.speed = 3;
  }

  update(time, delta) {
    this.frames += 1;
    this.elapsed += delta;

    // 毎フレーム、少しだけ動かす。
    this.ball.x += this.speed;
    if (this.ball.x > 660 || this.ball.x < 60) this.speed *= -1;

    const seconds = this.elapsed / 1000;
    const perSecond = seconds > 0 ? this.frames / seconds : 0;

    this.label.setText([
      'create が呼ばれた回数 : ' + createCount + ' 回',
      'update が呼ばれた回数 : ' + this.frames + ' 回',
      '経過時間              : ' + seconds.toFixed(1) + ' 秒',
      '1 秒あたりの update   : 約 ' + perSecond.toFixed(0) + ' 回',
    ]);
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

document.querySelector('#restart').addEventListener('click', () => {
  game.scene.getScene('Main').scene.restart();
});
