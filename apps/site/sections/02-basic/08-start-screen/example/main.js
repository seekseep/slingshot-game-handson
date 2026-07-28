class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create() {
    this.add
      .text(400, 180, 'パチンコ物理ゲーム', {
        fontSize: '36px',
        color: '#5d4037',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(400, 300, '▶ スタート', {
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
    const groundY = 400;

    const g = this.add.graphics();
    g.fillStyle(0x888888, 1);
    g.fillRect(0, groundY, 800, 480 - groundY);

    this.matter.add.rectangle(400, groundY + (480 - groundY) / 2, 800, 480 - groundY, {
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

    const anchor = { x: 140, y: 300 };
    const maxStretch = 90;
    const power = 0.22;

    this.add.circle(anchor.x, anchor.y, 6, 0xbbbbbb);

    const aim = this.add.graphics();

    const radius = 18;
    const bird = this.add.circle(anchor.x, anchor.y, radius, 0xffffff);
    bird.setStrokeStyle(3, 0x333333);

    this.matter.add.gameObject(bird, {
      shape: {
        type: 'circle',
        radius: radius,
      },
      restitution: 0.2,
    });

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
  width: 800,
  height: 480,
  backgroundColor: '#fdf6e3',
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 } },
  },
  scene: [StartScene, GameScene],
});
