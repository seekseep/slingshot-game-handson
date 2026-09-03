// collisionstart は「物理エンジンが計算している最中」に呼ばれる。
// そのことを、計算中かどうかの旗を立てて目に見えるようにした。
const GAME_W = 410; // 左側がゲーム。右側はログ。

class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    this.mode = 'later'; // 'later'（予約して update で消す）か 'now'（その場で消す）
    this.frames = 0;
    this.inPhysics = false; // いま物理エンジンの計算中か
    this.pending = new Set(); // 消す予約
    this.lines = [];

    this.matter.world.setBounds(0, 0, GAME_W, 340);

    // 物理エンジンの計算が「始まった／終わった」を旗にする。
    this.matter.world.on('beforeupdate', () => {
      this.inPhysics = true;
    });
    this.matter.world.on('afterupdate', () => {
      this.inPhysics = false;
    });

    const groundY = 290;
    const ground = this.add.graphics();
    ground.fillStyle(0x888888, 1);
    ground.fillRect(0, groundY, GAME_W, 340 - groundY);
    this.matter.add.rectangle(GAME_W / 2, groundY + 25, GAME_W, 50, {
      isStatic: true,
    });

    for (let i = 0; i < 3; i++) {
      const pig = this.add.circle(105 + i * 100, groundY - 20, 20, 0xf0b6c8);
      pig.setStrokeStyle(3, 0x333333);
      pig.setData('kind', 'pig');
      this.matter.add.gameObject(pig, {
        shape: { type: 'circle', radius: 20 },
      });
    }

    this.input.on('pointerdown', (pointer) => {
      if (pointer.x > GAME_W) return;
      const bird = this.add.circle(pointer.x, 30, 15, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);
      bird.setData('kind', 'bird');
      this.matter.add.gameObject(bird, {
        shape: { type: 'circle', radius: 15 },
      });
    });

    this.matter.world.on('collisionstart', (event) => {
      for (const pair of event.pairs) {
        const objects = [pair.bodyA.gameObject, pair.bodyB.gameObject];
        const pig = objects.find(
          (o) => o && o.getData && o.getData('kind') === 'pig',
        );
        const bird = objects.find(
          (o) => o && o.getData && o.getData('kind') === 'bird',
        );
        if (!pig || !bird || this.pending.has(pig)) continue;

        this.log('collisionstart で 1 個みつけた');
        if (this.mode === 'now') {
          // 計算中に消してしまう書き方。
          pig.destroy();
          this.log('→ その場で destroy した');
        } else {
          // 状態を書き換えるだけにして、実際に消すのは次のフレームに回す。
          this.pending.add(pig);
          this.log('→ 消す予約だけした');
        }
      }
    });

    this.buildPanel();
  }

  buildPanel() {
    this.add
      .rectangle(GAME_W + 12, 16, 250, 308, 0xffffff)
      .setOrigin(0)
      .setStrokeStyle(2, 0xcccccc);
    this.add.text(GAME_W + 24, 26, 'フレーム  物理計算中  できごと', {
      fontSize: '11px',
      color: '#777777',
      fontFamily: 'ui-monospace, Menlo, monospace',
    });
    this.logText = this.add.text(GAME_W + 24, 48, '', {
      fontSize: '11px',
      color: '#333333',
      lineSpacing: 6,
      fontFamily: 'ui-monospace, Menlo, monospace',
      wordWrap: { width: 226 },
    });
  }

  log(message) {
    const flag = this.inPhysics ? 'はい' : 'いいえ';
    this.lines.unshift(
      String(this.frames).padStart(6) + '  ' + flag.padEnd(6) + message,
    );
    if (this.lines.length > 14) this.lines.pop();
    this.logText.setText(this.lines);
  }

  update() {
    this.frames += 1;

    // 計算が終わったあとの、安全なタイミングでまとめて消す。
    if (this.pending.size > 0) {
      const n = this.pending.size;
      for (const pig of this.pending) pig.destroy();
      this.pending.clear();
      this.log('update で ' + n + ' 個 destroy した');
    }
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage',
  width: 684,
  height: 340,
  backgroundColor: '#fdf6e3',
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 } },
  },
  scene: [MainScene],
});

document.querySelector('#toggle').addEventListener('click', (event) => {
  const scene = game.scene.getScene('Main');
  scene.mode = scene.mode === 'later' ? 'now' : 'later';
  event.target.textContent =
    scene.mode === 'now'
      ? '「予約して update で消す」に戻す'
      : '「その場で消す」に切り替える';
});
