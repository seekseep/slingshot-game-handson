// 小さくしたパチンコ。02〜04 章で使った 4 つのイベントが発火するたび、右のランプが光る。
const GAME_WIDTH = 440; // 左側がゲーム。右側はランプの表示欄。
const NAMES = ['pointerdown', 'pointermove', 'pointerup', 'collisionstart'];

class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    this.counts = {
      pointerdown: 0,
      pointermove: 0,
      pointerup: 0,
      collisionstart: 0,
    };
    this.lit = {
      pointerdown: 0,
      pointermove: 0,
      pointerup: 0,
      collisionstart: 0,
    };

    // ゲームの外へ飛び出さないよう、物理の世界を左半分だけにする。
    this.matter.world.setBounds(0, 0, GAME_WIDTH, 340);

    const groundY = 315;
    const groundHeight = 50;
    const groundTop = groundY - groundHeight / 2; // 地面の上面。物はこの高さに乗る

    const ground = this.add.rectangle(
      GAME_WIDTH / 2,
      groundY,
      GAME_WIDTH,
      groundHeight,
      0x888888,
    );
    this.matter.add.gameObject(ground, { isStatic: true });

    for (let i = 0; i < 3; i++) {
      const box = this.add.rectangle(
        365,
        groundTop - 16 - i * 32,
        32,
        32,
        0xdddddd,
      );
      box.setStrokeStyle(3, 0x333333);
      this.matter.add.gameObject(box, { restitution: 0.1 });
    }

    const anchor = { x: 110, y: 210 };
    this.add.circle(anchor.x, anchor.y, 5, 0xbbbbbb);

    const bird = this.add
      .circle(anchor.x, anchor.y, 14, 0xffffff)
      .setStrokeStyle(3, 0x333333);
    this.matter.add.gameObject(bird, {
      shape: { type: 'circle', radius: 14 },
      restitution: 0.2,
    });
    bird.setStatic(true);

    let dragging = false;

    // ①〜③ 発生源は this.input（画面全体）。
    this.input.on('pointerdown', (pointer) => {
      this.fire('pointerdown');
      if (pointer.x > GAME_WIDTH) return;
      bird.setStatic(true);
      bird.setPosition(anchor.x, anchor.y);
      bird.setVelocity(0, 0);
      dragging = true;
    });

    this.input.on('pointermove', (pointer) => {
      // 動かしている間ずっと発火する。だからハンドラの先頭で「今いるかどうか」を確かめる。
      this.fire('pointermove');
      if (!dragging) return;
      const dx = pointer.x - anchor.x;
      const dy = pointer.y - anchor.y;
      const dist = Math.hypot(dx, dy);
      const scale = dist > 80 ? 80 / dist : 1;
      bird.setPosition(anchor.x + dx * scale, anchor.y + dy * scale);
    });

    this.input.on('pointerup', () => {
      this.fire('pointerup');
      if (!dragging) return;
      dragging = false;
      bird.setStatic(false);
      bird.setVelocity((anchor.x - bird.x) * 0.22, (anchor.y - bird.y) * 0.22);
    });

    // ④ 発生源は物理エンジン（this.matter.world）。ぶつかった瞬間に届く。
    this.matter.world.on('collisionstart', () => this.fire('collisionstart'));

    this.buildPanel();
  }

  /** ランプを光らせて、回数を 1 増やす。 */
  fire(name) {
    this.counts[name] += 1;
    this.lit[name] = 12; // 12 フレームだけ点灯させる
  }

  buildPanel() {
    this.add
      .rectangle(GAME_WIDTH + 14, 20, 222, 300, 0xffffff)
      .setOrigin(0)
      .setStrokeStyle(2, 0xcccccc);
    this.add.text(GAME_WIDTH + 28, 34, '発火したイベント', {
      fontSize: '13px',
      color: '#777777',
    });

    this.lamps = {};
    this.labels = {};
    NAMES.forEach((name, i) => {
      const y = 74 + i * 62;
      this.lamps[name] = this.add
        .circle(GAME_WIDTH + 40, y, 9, 0xdddddd)
        .setStrokeStyle(2, 0x999999);
      this.add.text(GAME_WIDTH + 58, y - 9, name, {
        fontSize: '13px',
        color: '#333333',
      });
      this.labels[name] = this.add.text(GAME_WIDTH + 58, y + 8, '', {
        fontSize: '12px',
        color: '#777777',
      });
    });

    this.add.text(GAME_WIDTH + 28, 300, '鳥を引っ張って離してみてください', {
      fontSize: '11px',
      color: '#777777',
    });
  }

  update() {
    for (const name of NAMES) {
      if (this.lit[name] > 0) this.lit[name] -= 1;
      this.lamps[name].setFillStyle(this.lit[name] > 0 ? 0xe08e3c : 0xdddddd);
      this.labels[name].setText(this.counts[name] + ' 回');
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

document.querySelector('#restart').addEventListener('click', () => {
  game.scene.getScene('Main').scene.restart();
});
