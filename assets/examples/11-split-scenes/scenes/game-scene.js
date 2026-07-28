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
}
