new Phaser.Game({
  type: Phaser.AUTO,
  width: 720,
  height: 480,
  backgroundColor: '#fdf6e3',
  scene: {
    create: function () {
      const bird = this.add.circle(140, 340, 18, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);
    },
  },
});
