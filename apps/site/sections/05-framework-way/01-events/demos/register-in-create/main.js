// イベントの登録を create に書いた場合と、update に書いてしまった場合を比べる。
// update は毎フレーム呼ばれるので、書く場所を間違えるとハンドラが積み上がっていく。
const LIMIT = 600; // ブラウザが固まらないよう、このデモでは 600 個で打ち止めにする

class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    this.mode = 'create'; // 'create' か 'update'
    this.score = 0;
    this.lastScore = 0;
    this.lastGain = 0;

    this.add.text(24, 18, 'この枠の中をクリックするとスコアが増えます', {
      fontSize: '15px',
      color: '#777777',
    });

    this.info = this.add.text(40, 60, '', {
      fontSize: '18px',
      color: '#333333',
      lineSpacing: 12,
    });

    // 登録は create で 1 回だけ。これが正しい書き方。
    this.input.on('pointerdown', this.bump, this);
  }

  bump() {
    this.score += 1;
  }

  /** create に登録するモードと、update に登録するモードを切り替える。 */
  setMode(mode) {
    this.mode = mode;
    this.score = 0;
    this.lastScore = 0;
    this.lastGain = 0;

    // いったん全部外してから、create モードのときだけ 1 個だけ登録し直す。
    this.input.off('pointerdown');
    if (mode === 'create') this.input.on('pointerdown', this.bump, this);
  }

  update() {
    // 悪い例：毎フレーム登録してしまう。1 秒あたり約 60 個ずつ増えていく。
    if (
      this.mode === 'update' &&
      this.input.listenerCount('pointerdown') < LIMIT
    ) {
      this.input.on('pointerdown', this.bump, this);
    }

    // 直前のクリックで何点入ったかを、スコアの増え方から割り出す。
    if (this.score !== this.lastScore) {
      this.lastGain = this.score - this.lastScore;
      this.lastScore = this.score;
    }

    const handlers = this.input.listenerCount('pointerdown');
    this.info.setText([
      '書いた場所　　　　　　… ' +
        (this.mode === 'create'
          ? 'create（1 回だけ）'
          : 'update（毎フレーム）'),
      '登録されたハンドラ　　… ' +
        handlers +
        ' 個' +
        (handlers >= LIMIT ? '（打ち止め）' : ''),
      '直前の 1 クリックで　 … ' + this.lastGain + ' 点ふえた',
      'スコア合計　　　　　　… ' + this.score,
    ]);
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage',
  width: 684,
  height: 250,
  backgroundColor: '#fdf6e3',
  scene: [MainScene],
});

document.querySelector('#toggle').addEventListener('click', (event) => {
  const scene = game.scene.getScene('Main');
  const next = scene.mode === 'create' ? 'update' : 'create';
  scene.setMode(next);
  event.target.textContent =
    next === 'update'
      ? 'create に登録する（正しい）に戻す'
      : 'update に登録する（悪い例）に切り替える';
});
