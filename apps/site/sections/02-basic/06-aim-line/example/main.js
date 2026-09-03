new Phaser.Game({
  type: Phaser.AUTO,
  width: 720,
  height: 480,
  backgroundColor: '#fdf6e3',
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 } },
  },
  scene: {
    create: function () {
      const groundY = 400;

      const ground = this.add.graphics();
      ground.fillStyle(0x888888, 1);
      ground.fillRect(0, groundY, 720, 480 - groundY);

      // 描いた地面と同じ位置に、動かない当たり判定を置く。
      this.matter.add.rectangle(
        360,
        groundY + (480 - groundY) / 2,
        720,
        480 - groundY,
        {
          isStatic: true,
        },
      );

      const anchor = { x: 140, y: 300 };
      const maxStretch = 90;
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

      this.input.on('pointerdown', function () {
        bird.setStatic(true);
        bird.setPosition(anchor.x, anchor.y);
        bird.setVelocity(0, 0);
        dragging = true;
      });

      this.input.on('pointermove', function (pointer) {
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

      this.input.on('pointerup', function () {
        if (!dragging) return;
        dragging = false;

        aim.clear();

        const vx = (anchor.x - bird.x) * power;
        const vy = (anchor.y - bird.y) * power;

        bird.setStatic(false);
        bird.setVelocity(vx, vy);
      });
    },
  },
});
