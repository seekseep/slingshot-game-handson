class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create() {
    this.add
      .text(360, 180, 'パチンコ物理ゲーム', {
        fontSize: '36px',
        color: '#5d4037',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(360, 300, '▶ スタート', {
        fontSize: '28px',
        color: '#ffffff',
        backgroundColor: '#e08e3c',
        padding: { x: 24, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startText.on('pointerdown', () => this.scene.start('Game'));
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    const groundX = 360;
    const groundY = 440;
    const groundWidth = 720;
    const groundHeight = 80;
    const groundTop = groundY - groundHeight / 2; // 地面の上面。物はこの高さに乗る

    const ground = this.add.rectangle(
      groundX,
      groundY,
      groundWidth,
      groundHeight,
      0x888888,
    );

    this.matter.add.gameObject(ground, { isStatic: true });

    const boxSize = 40;
    const towerX = 560;
    for (let i = 0; i < 3; i++) {
      const boxY = groundTop - boxSize / 2 - i * boxSize;
      const box = this.add.rectangle(towerX, boxY, boxSize, boxSize, 0xdddddd);
      box.setStrokeStyle(3, 0x333333);
      this.matter.add.gameObject(box, { restitution: 0.1 });
    }

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

      this.time.delayedCall(1200, () => spawnBird());
    });
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 720,
  height: 480,
  backgroundColor: '#fdf6e3',
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 } },
  },
  scene: [StartScene, GameScene],
});
