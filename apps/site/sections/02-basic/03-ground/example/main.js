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
