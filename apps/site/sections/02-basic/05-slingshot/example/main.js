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
      g.fillStyle(0x888888, 1);
      g.fillRect(0, groundY, 800, 480 - groundY);

      this.matter.add.rectangle(400, groundY + (480 - groundY) / 2, 800, 480 - groundY, {
        isStatic: true,
      });

      // パチンコの位置（ここに鳥が構え、離すとここを基点に飛ぶ）。
      const anchor = { x: 140, y: 300 };
      const maxStretch = 90; // 引っ張れる最大の長さ
      const power = 0.22; // 引っ張った長さを速さに変える倍率

      // パチンコの位置を薄い丸で示しておく。
      this.add.circle(anchor.x, anchor.y, 6, 0xbbbbbb);

      const radius = 18;
      const bird = this.add.circle(anchor.x, anchor.y, radius, 0xffffff);
      bird.setStrokeStyle(3, 0x333333);

      this.matter.add.gameObject(bird, {
        shape: {
          type: 'circle',
          radius: radius,
        },
        restitution: 0.2,
      });

      // 待機中は動かないように静的にしておく。
      bird.setStatic(true);

      let dragging = false;

      // 押した瞬間：鳥をパチンコの位置に戻して、引っ張り開始。
      this.input.on('pointerdown', function () {
        bird.setStatic(true);
        bird.setPosition(anchor.x, anchor.y);
        bird.setVelocity(0, 0);
        dragging = true;
      });

      // 動かしている間：パチンコの位置から一定の長さまでで鳥を引っ張る。
      this.input.on('pointermove', function (pointer) {
        if (!dragging) return;

        const dx = pointer.x - anchor.x;
        const dy = pointer.y - anchor.y;
        const dist = Math.hypot(dx, dy);

        if (dist > maxStretch) {
          const scale = maxStretch / dist;
          bird.setPosition(anchor.x + dx * scale, anchor.y + dy * scale);
        } else {
          bird.setPosition(pointer.x, pointer.y);
        }
      });

      // 離した瞬間：引っ張った向きと反対に、長さに応じた速さで飛ばす。
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
