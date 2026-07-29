class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    // 画像を読み込む。鳥・ブタ・箱はそれぞれ twemoji の絵文字画像。
    this.load.image('bird', 'assets/1f426.png');
    this.load.image('pig', 'assets/1f437.png');
    this.load.image('block', 'assets/1f4e6.png');
    // 効果音も読み込む。launch=発射のとき、hit=ブタに当たったとき。
    this.load.audio('launch', 'assets/launch.wav');
    this.load.audio('hit', 'assets/hit.wav');
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
      // 丸や四角の代わりに箱の画像を置く。画像を boxSize の大きさに合わせる。
      const box = this.add.image(towerX, boxY, 'block').setDisplaySize(boxSize, boxSize);
      this.matter.add.gameObject(box, {
        shape: { type: 'rectangle', width: boxSize, height: boxSize },
        restitution: 0.1,
      });
    }

    // 標的（ブタ）を置く。ブタの画像にする。
    // 鳥が当たったブタを消せるように、目印として isPig を付けておく。
    const pigRadius = 16;
    const pigPositions = [
      { x: 690, y: groundY - pigRadius }, // タワーの右のブタ
      { x: towerX, y: groundY - boxSize * 3 - pigRadius }, // タワーの上のブタ
    ];
    for (const pos of pigPositions) {
      const pig = this.add.image(pos.x, pos.y, 'pig').setDisplaySize(pigRadius * 2, pigRadius * 2);
      this.matter.add.gameObject(pig, {
        shape: { type: 'circle', radius: pigRadius },
        restitution: 0.2,
      });
      pig.isPig = true;
    }

    // 残りのブタの数。0 になったらクリア。
    this.pigsLeft = pigPositions.length;
    this.cleared = false;

    // スコア。ブタを1匹倒すごとに増える。右上に表示する。
    this.score = 0;
    this.scoreText = this.add
      .text(700, 30, 'スコア: 0', { fontSize: '20px', color: '#333333' })
      .setOrigin(1, 0.5);

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
      bird = this.add.image(anchor.x, anchor.y, 'bird').setDisplaySize(radius * 2, radius * 2);
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
      this.sound.play('launch'); // 発射の音。

      bird = null;
      birdsLeft -= 1;
      drawReserve();

      this.time.delayedCall(1200, () => {
        if (birdsLeft > 0) {
          spawnBird();
        } else {
          // 結果画面にスコアを渡す。
          this.scene.start('GameOver', { score: this.score });
        }
      });
    });
  }

  update() {
    // 消す予約のブタを、毎フレームまとめて消す。消したぶん残りを減らす。
    for (const pig of this.pendingRemoval) {
      pig.destroy();
      this.pigsLeft -= 1;
      this.score += 1000;
      this.scoreText.setText('スコア: ' + this.score);
      this.sound.play('hit'); // ブタに当たった音。
    }
    this.pendingRemoval.clear();

    // ブタを全部倒したらクリア画面へ（1回だけ）。
    if (!this.cleared && this.pigsLeft <= 0) {
      this.cleared = true;
      // 結果画面にスコアを渡す。
      this.scene.start('Clear', { score: this.score });
    }
  }
}
