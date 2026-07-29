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
      const radius = 18;

      // 少し上から始めると、重力で落ちていく様子が見える。
      // 白い丸に濃い輪郭線をつけて見やすくする。
      const bird = this.add.circle(140, 80, radius, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);

      this.matter.add.gameObject(bird, {
        shape: {
          type: 'circle',
          radius: radius,
        },
      });
    },
  },
});
