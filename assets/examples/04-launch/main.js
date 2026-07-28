new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  backgroundColor: '#fdf6e3',
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 } },
  },
  scene: {
    create: function () {
      const groundY = 400;

      const g = this.add.graphics();
      g.fillStyle('#8d6e63', 1);
      g.fillRect(0, groundY, 800, 480 - groundY);

      this.matter.add.rectangle(400, groundY + (480 - groundY) / 2, 800, 480 - groundY, {
        isStatic: true,
      });

      const radius = 18;

      // 鳥は地面の上（パチンコの位置）に置いておく。
      const bird = this.add.circle(140, groundY - radius, radius, '#333333');

      this.matter.add.gameObject(bird, {
        shape: {
          type: 'circle',
          radius: radius,
        },
        restitution: 0.2,
      });

      // クリックしたら、右上に向かって初速を与えて飛ばす。
      this.input.on('pointerdown', function () {
        bird.setVelocity(12, -12);
      });
    },
  },
});
