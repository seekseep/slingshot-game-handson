// 置く作業を create に書いた場合と、update に書いてしまった場合を比べる。
// 画面の見た目は同じなのに、片方だけがだんだん重くなっていく。
const LIMIT = 4000; // ブラウザが固まらないよう、このデモでは 4000 個で打ち止めにする

class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    this.mode = 'create'; // 'create' か 'update'
    this.balls = 0;

    this.add.text(24, 20, '白い丸は、どちらのモードでも 1 個に見えます', {
      fontSize: '15px',
      color: '#777777',
    });

    // 置くのは create で 1 回だけ。これが正しい書き方。
    this.addBall();

    this.info = this.add.text(320, 70, '', {
      fontSize: '17px',
      color: '#333333',
      lineSpacing: 12,
    });
  }

  addBall() {
    const ball = this.add.circle(150, 130, 26, 0xffffff);
    ball.setStrokeStyle(3, 0x333333);
    this.balls += 1;
  }

  update() {
    // 悪い例：毎フレーム置いてしまう。同じ場所なので、重なって 1 個に見える。
    if (this.mode === 'update' && this.balls < LIMIT) this.addBall();

    const fps = this.game.loop.actualFps;
    this.info.setText([
      '書いた場所　　　　… ' +
        (this.mode === 'create'
          ? 'create（1 回だけ）'
          : 'update（毎フレーム）'),
      '置かれた丸の数　　… ' +
        this.balls +
        ' 個' +
        (this.balls >= LIMIT ? '（打ち止め）' : ''),
      '1 秒あたりのコマ数… 約 ' + fps.toFixed(0) + ' 回',
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

document.querySelector('#toggle').addEventListener('click', (event) => {
  const scene = game.scene.getScene('Main');
  scene.mode = scene.mode === 'create' ? 'update' : 'create';
  event.target.textContent =
    scene.mode === 'update'
      ? 'create で置く（正しい）に戻す'
      : 'update で置く（悪い例）に切り替える';
});

document.querySelector('#restart').addEventListener('click', () => {
  // create からやり直すので、モードも表示もはじめの状態に戻る。
  game.scene.getScene('Main').scene.restart();
  document.querySelector('#toggle').textContent =
    'update で置く（悪い例）に切り替える';
});
