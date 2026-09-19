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

      const anchor = { x: 140, y: 300 };
      const power = 0.22; // 引っ張った長さを速さに変える倍率

      this.add.circle(anchor.x, anchor.y, 6, 0xbbbbbb);

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

        bird.setPosition(pointer.x, pointer.y);
      });

      this.input.on('pointerup', function () {
        if (!dragging) return;
        dragging = false;

        const vx = (anchor.x - bird.x) * power;
        const vy = (anchor.y - bird.y) * power;

        bird.setStatic(false);
        bird.setVelocity(vx, vy);
      });
    },
  },
});
