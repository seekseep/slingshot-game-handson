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
