// 同じイベントに on と once を 1 つずつ登録して、連打してみる。
class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    this.onCount = 0;
    this.onceCount = 0;

    this.add.text(24, 18, 'この枠の中を何度もクリックしてください', {
      fontSize: '15px',
      color: '#777777',
    });

    // on … 受け取り続ける。外すまでずっと呼ばれる。
    this.input.on('pointerdown', () => {
      this.onCount += 1;
      this.render();
    });

    // once … 1 回受け取ったら、自動で登録が外れる。
    this.input.once('pointerdown', () => {
      this.onceCount += 1;
      this.render();
    });

    // 登録し終えた時点のハンドラ数を覚えておく（あとで減ったことを見せるため）。
    this.registered = this.input.listenerCount('pointerdown');

    this.onText = this.add.text(60, 78, '', {
      fontSize: '20px',
      color: '#2b6cb0',
    });
    this.onceText = this.add.text(60, 126, '', {
      fontSize: '20px',
      color: '#c0392b',
    });
    this.aliveText = this.add.text(60, 172, '', {
      fontSize: '14px',
      color: '#777777',
    });
    this.render();
  }

  render() {
    this.onText.setText(
      "on('pointerdown', …)   … " + this.onCount + ' 回 呼ばれた',
    );
    this.onceText.setText(
      "once('pointerdown', …) … " + this.onceCount + ' 回 呼ばれた',
    );

    // once のハンドラがまだ残っているかを、Phaser に聞いてみる。
    const remaining = this.input.listenerCount('pointerdown');
    this.aliveText.setText(
      'pointerdown に登録されているハンドラ … ' +
        remaining +
        ' 個' +
        (remaining < this.registered ? '（once の分が自動で外れた）' : ''),
    );
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage',
  width: 684,
  height: 210,
  backgroundColor: '#fdf6e3',
  scene: [MainScene],
});

document.querySelector('#restart').addEventListener('click', () => {
  game.scene.getScene('Main').scene.restart();
});
