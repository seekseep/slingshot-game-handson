new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  backgroundColor: '#fdf6e3',
  scene: {
    create: function () {
      // パチンコに構える鳥。まずは丸を1つ置くだけ。
      this.add.circle(140, 340, 18, '#333333');
    },
  },
});
