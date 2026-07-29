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
      const groundY = 400; // 地面の上面の高さ

      // 地面を描く（画面の下いっぱいに横長の帯）。グレーで塗る。
      const g = this.add.graphics();
      g.fillStyle(0x888888, 1);
      g.fillRect(0, groundY, 720, 480 - groundY);

      // 描いた地面と同じ位置に、動かない当たり判定を置く。
      this.matter.add.rectangle(360, groundY + (480 - groundY) / 2, 720, 480 - groundY, {
        isStatic: true,
      });

      const radius = 18;

      // 上から落として、地面で受け止められる様子を見る。
      const bird = this.add.circle(140, 80, radius, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);

      this.matter.add.gameObject(bird, {
        shape: {
          type: 'circle',
          radius: radius,
        },
        restitution: 0.2, // 跳ね返りの強さ（0=跳ねない 〜 1=よく跳ねる）
      });
    },
  },
});
