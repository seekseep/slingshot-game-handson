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
