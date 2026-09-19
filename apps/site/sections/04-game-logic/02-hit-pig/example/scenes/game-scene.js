class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    const groundX = 0;
    const groundY = 400;
    const groundWidth = 720;
    const groundHeight = 80;

    const ground = this.add.graphics();
    ground.fillStyle(0x888888, 1);
    ground.fillRect(groundX, groundY, groundWidth, groundHeight);

    // 絵は左上ぞろえ、体は中心ぞろえなので、半分ずらして同じ場所に重ねる。
    this.matter.add.rectangle(
      groundX + groundWidth / 2,
      groundY + groundHeight / 2,
      groundWidth,
      groundHeight,
      {
        isStatic: true,
      },
    );

    const boxSize = 40;
    const towerX = 560;
    for (let i = 0; i < 3; i++) {
      const boxY = groundY - boxSize / 2 - i * boxSize;
      const box = this.add.rectangle(towerX, boxY, boxSize, boxSize, 0xdddddd);
      box.setStrokeStyle(3, 0x333333);
      this.matter.add.gameObject(box, { restitution: 0.1 });
    }

    const pigRadius = 16;
    const pigPositions = [
      { x: 460, y: groundY - pigRadius }, // 手前のブタ
      { x: towerX, y: groundY - boxSize * 3 - pigRadius }, // タワーの上のブタ
      { x: 660, y: groundY - pigRadius }, // 奥のブタ
    ];
    for (const pos of pigPositions) {
      const pig = this.add.circle(pos.x, pos.y, pigRadius, 0xaaaaaa);
      pig.setStrokeStyle(3, 0x333333);
      this.matter.add.gameObject(pig, {
        shape: { type: 'circle', radius: pigRadius },
        restitution: 0.2,
      });
      pig.isPig = true; // 衝突したときに見分けるための目印。
    }

    // 衝突中に消すと不安定なので、ためて update でまとめて消す。
    this.pendingRemoval = new Set();

    this.matter.world.on('collisionstart', (event) => {
      for (const pair of event.pairs) {
        const gameObjectA = pair.bodyA.gameObject;
        const gameObjectB = pair.bodyB.gameObject;
        if (!gameObjectA || !gameObjectB) continue;
        if (gameObjectA.isBird && gameObjectB.isPig)
          this.pendingRemoval.add(gameObjectB);
        if (gameObjectB.isBird && gameObjectA.isPig)
          this.pendingRemoval.add(gameObjectA);
      }
    });

    const anchor = { x: 140, y: 300 };
    const power = 0.22; // 引っ張った長さを速さに変える倍率
    const birdRadius = 18;

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

    // いま操作できる鳥。発射中やリロード待ちのときは null。
    let bird = null;
    let dragging = false;

    const spawnBird = () => {
      if (birdsLeft <= 0) return;
      bird = this.add.circle(anchor.x, anchor.y, birdRadius, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);
      this.matter.add.gameObject(bird, {
        shape: { type: 'circle', radius: birdRadius },
        restitution: 0.2,
      });
      // 待機中は動かないように静的にしておく。
      bird.setStatic(true);
      bird.isBird = true; // 同じく、鳥かどうかの目印。
    };

    drawReserve();
    spawnBird();

    this.input.on('pointerdown', () => {
      if (!bird || dragging) return;
      dragging = true;
    });

    this.input.on('pointermove', (pointer) => {
      if (!dragging || !bird) return;

      bird.setPosition(pointer.x, pointer.y);

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
    for (const pig of this.pendingRemoval) {
      pig.destroy();
    }
    this.pendingRemoval.clear();
  }
}
