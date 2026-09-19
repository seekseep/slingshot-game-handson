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

    const anchor = { x: 140, y: 300 };
    const power = 0.22; // 引っ張った長さを速さに変える倍率

    this.add.circle(anchor.x, anchor.y, 6, 0xbbbbbb);

    const aim = this.add.graphics();

    const birdRadius = 18;
    const bird = this.add.circle(anchor.x, anchor.y, birdRadius, 0xffffff);
    bird.setStrokeStyle(3, 0x333333);

    this.matter.add.gameObject(bird, {
      shape: {
        type: 'circle',
        radius: birdRadius,
      },
      restitution: 0.2,
    });

    // 待機中は動かないように静的にしておく。
    bird.setStatic(true);

    let dragging = false;

    this.input.on('pointerdown', () => {
      bird.setStatic(true);
      bird.setPosition(anchor.x, anchor.y);
      bird.setVelocity(0, 0);
      dragging = true;
    });

    this.input.on('pointermove', (pointer) => {
      if (!dragging) return;

      bird.setPosition(pointer.x, pointer.y);

      const forwardX = anchor.x + (anchor.x - bird.x) * 1.5;
      const forwardY = anchor.y + (anchor.y - bird.y) * 1.5;
      aim.clear();
      aim.lineStyle(2, 0x333333, 0.5);
      aim.lineBetween(bird.x, bird.y, forwardX, forwardY);
    });

    this.input.on('pointerup', () => {
      if (!dragging) return;
      dragging = false;

      aim.clear();

      const vx = (anchor.x - bird.x) * power;
      const vy = (anchor.y - bird.y) * power;

      bird.setStatic(false);
      bird.setVelocity(vx, vy);
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
