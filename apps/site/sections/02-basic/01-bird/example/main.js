new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  backgroundColor: '#fdf6e3',
  scene: {
    create: function () {
      // パチンコに構える鳥。白い丸に濃い輪郭線をつけて見やすくする。
      const bird = this.add.circle(140, 340, 18, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);
    },
  },
});
