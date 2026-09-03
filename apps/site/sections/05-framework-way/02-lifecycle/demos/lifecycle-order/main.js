// シーンが始まってから終わるまで、Phaser がどのメソッドをどの順で呼ぶかを記録する。
// 私たちのコードには、これらを呼び出す行は 1 つも無い。
const logEl = document.querySelector('#log');
const startedAt = performance.now();

function log(sceneKey, message) {
  const ms = String(Math.round(performance.now() - startedAt)).padStart(6);
  logEl.textContent += ms + 'ms  ' + sceneKey.padEnd(6) + message + '\n';
  logEl.scrollTop = logEl.scrollHeight;
}

// 中身が少しだけ違う 2 つのシーン。行き来させて shutdown を見る。
class LifecycleScene extends Phaser.Scene {
  constructor(key, color) {
    super(key);
    this.color = color;
  }

  init(data) {
    // いちばん最初。渡されたデータを受け取る。
    this.frames = 0;
    log(this.scene.key, 'init(data)      data.from = ' + (data.from ?? 'なし'));
  }

  preload() {
    // 読み込み。ここが終わるまで create には進まない。
    log(this.scene.key, 'preload()       読み込みを始める');
    this.load.image('dot', 'dot.svg');
    this.load.once('complete', () => log(this.scene.key, '  （読み込み完了）'));
  }

  create() {
    // 読み込みが終わってから呼ばれる。だから画像がある前提で書ける。
    log(this.scene.key, 'create()        オブジェクトを置く');

    this.add
      .rectangle(170, 100, 300, 130, this.color)
      .setStrokeStyle(3, 0x333333);
    this.add
      .text(170, 90, this.scene.key, { fontSize: '28px', color: '#ffffff' })
      .setOrigin(0.5);
    this.add.image(170, 130, 'dot').setDisplaySize(24, 24);

    this.counter = this.add
      .text(170, 200, '', { fontSize: '15px', color: '#333333' })
      .setOrigin(0.5);

    // 去るときに呼ばれるものも、登録しておけば向こうから呼ばれる。
    this.events.once('shutdown', () =>
      log(this.scene.key, 'shutdown        後片付け'),
    );
  }

  update() {
    this.frames += 1;
    this.counter.setText('update ' + this.frames + ' 回');

    // 毎フレーム記録すると流れてしまうので、1 秒ぶんずつまとめて出す。
    if (this.frames % 60 === 0)
      log(this.scene.key, 'update()        ここまで ' + this.frames + ' 回');
  }
}

class Alpha extends LifecycleScene {
  constructor() {
    super('Alpha', 0x2b6cb0);
  }
}

class Beta extends LifecycleScene {
  constructor() {
    super('Beta', 0xc0392b);
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage',
  width: 340,
  height: 256,
  backgroundColor: '#fdf6e3',
  scene: [Alpha, Beta],
});

document.querySelector('#switch').addEventListener('click', () => {
  const current = game.scene.isActive('Alpha') ? 'Alpha' : 'Beta';
  const next = current === 'Alpha' ? 'Beta' : 'Alpha';
  log('', "--- scene.start('" + next + "') を呼んだ ---");
  game.scene.getScene(current).scene.start(next, { from: current });
});

document.querySelector('#clear').addEventListener('click', () => {
  logEl.textContent = '';
});
