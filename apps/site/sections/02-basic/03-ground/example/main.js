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

      const birdRadius = 18;

      const bird = this.add.circle(140, 80, birdRadius, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);

      this.matter.add.gameObject(bird, {
        shape: {
          type: 'circle',
          radius: birdRadius,
        },
        restitution: 0.2,
      });
    },
  },
});
