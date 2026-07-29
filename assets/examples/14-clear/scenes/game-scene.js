class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    const groundY = 400;

    const g = this.add.graphics();
    g.fillStyle(0x888888, 1);
    g.fillRect(0, groundY, 720, 480 - groundY);

    this.matter.add.rectangle(360, groundY + (480 - groundY) / 2, 720, 480 - groundY, {
      isStatic: true,
    });

    const boxSize = 40;
    const towerX = 620;
    for (let i = 0; i < 3; i++) {
      const boxY = groundY - boxSize / 2 - i * boxSize;
      const box = this.add.rectangle(towerX, boxY, boxSize, boxSize, 0xdddddd);
      box.setStrokeStyle(3, 0x333333);
      this.matter.add.gameObject(box, { restitution: 0.1 });
    }

    // 標的（ブタ）を置く。灰色の丸に濃い輪郭線をつけて、鳥と区別する。
    // 鳥が当たったブタを消せるように、目印として isPig を付けておく。
    const pigRadius = 16;
    const pigPositions = [
      { x: 690, y: groundY - pigRadius }, // タワーの右のブタ
      { x: towerX, y: groundY - boxSize * 3 - pigRadius }, // タワーの上のブタ
    ];
    for (const pos of pigPositions) {
      const pig = this.add.circle(pos.x, pos.y, pigRadius, 0xaaaaaa);
      pig.setStrokeStyle(3, 0x333333);
      this.matter.add.gameObject(pig, {
        shape: { type: 'circle', radius: pigRadius },
        restitution: 0.2,
      });
      pig.isPig = true;
    }

    // 残りのブタの数。0 になったらクリア。
    this.pigsLeft = pigPositions.length;
    this.cleared = false;

    // 消す予約をためておく入れ物（衝突中に消すと不安定なので update でまとめて消す）。
    this.pendingRemoval = new Set();

    // 鳥とブタがぶつかったら、そのブタを消す予約をする。
    this.matter.world.on('collisionstart', (event) => {
      for (const pair of event.pairs) {
        const a = pair.bodyA.gameObject;
        const b = pair.bodyB.gameObject;
        if (!a || !b) continue;
        if (a.isBird && b.isPig) this.pendingRemoval.add(b);
        if (b.isBird && a.isPig) this.pendingRemoval.add(a);
      }
    });

    const anchor = { x: 140, y: 300 };
    const maxStretch = 90;
    const power = 0.22;
    const radius = 18;

    this.add.circle(anchor.x, anchor.y, 6, 0xbbbbbb);

    const aim = this.add.graphics();

    let birdsLeft = 5;
    const reserve = this.add.graphics();
    const drawReserve = () => {
      reserve.clear();
      for (let i = 0; i < birdsLeft; i++) {
        const x = 30 + i * 26;
        reserve.fillStyle(0xffffff, 1);
        reserve.fillCircle(x, 40, 9);
        reserve.lineStyle(2, 0x333333, 1);
        reserve.strokeCircle(x, 40, 9);
      }
    };

    let bird = null;
    let dragging = false;

    const spawnBird = () => {
      if (birdsLeft <= 0) return;
      bird = this.add.circle(anchor.x, anchor.y, radius, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);
      this.matter.add.gameObject(bird, {
        shape: { type: 'circle', radius: radius },
        restitution: 0.2,
      });
      bird.setStatic(true);
      bird.isBird = true; // 衝突相手が鳥かどうかを見分ける目印。
    };

    drawReserve();
    spawnBird();

    this.input.on('pointerdown', () => {
      if (!bird || dragging) return;
      dragging = true;
    });

    this.input.on('pointermove', (pointer) => {
      if (!dragging || !bird) return;

      const dx = pointer.x - anchor.x;
      const dy = pointer.y - anchor.y;
      const dist = Math.hypot(dx, dy);

      if (dist > maxStretch) {
        const scale = maxStretch / dist;
        bird.setPosition(anchor.x + dx * scale, anchor.y + dy * scale);
      } else {
        bird.setPosition(pointer.x, pointer.y);
      }

      const forwardX = anchor.x + (anchor.x - bird.x) * 1.5;
      const forwardY = anchor.y + (anchor.y - bird.y) * 1.5;
      aim.clear();
      aim.lineStyle(2, 0x333333, 0.5);
      aim.lineBetween(bird.x, bird.y, forwardX, forwardY);
    });

    this.input.on('pointerup', () => {
      if (!dragging || !bird) return;
      dragging = false;
      aim.clear();

      const vx = (anchor.x - bird.x) * power;
      const vy = (anchor.y - bird.y) * power;
      bird.setStatic(false);
      bird.setVelocity(vx, vy);

      bird = null;
      birdsLeft -= 1;
      drawReserve();

      this.time.delayedCall(1200, () => {
        if (birdsLeft > 0) {
          spawnBird();
        } else {
          this.scene.start('GameOver');
        }
      });
    });
  }

  update() {
    // 消す予約のブタを、毎フレームまとめて消す。消したぶん残りを減らす。
    for (const pig of this.pendingRemoval) {
      pig.destroy();
      this.pigsLeft -= 1;
    }
    this.pendingRemoval.clear();

    // ブタを全部倒したらクリア画面へ（1回だけ）。
    if (!this.cleared && this.pigsLeft <= 0) {
      this.cleared = true;
      this.scene.start('Clear');
    }
  }
}
