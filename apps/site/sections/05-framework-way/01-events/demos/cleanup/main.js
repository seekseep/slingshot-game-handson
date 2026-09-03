// シーンを何度もやり直して、「登録したものを誰が外すのか」を見る。
// シーンが作り直されても残る数字なので、シーンの外に置いている。
let starts = 0; // create が呼ばれた回数
let phaserFires = 0; // Phaser 側のハンドラが呼ばれた回数
let domFires = 0; // 自分で addEventListener したハンドラが呼ばれた回数
let domHandlers = 0; // 自分でつけた DOM ハンドラの数（DOM には個数を聞けないので自分で数える）

const stage = document.querySelector('#stage');

class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    starts += 1;
    this.lastPhaser = phaserFires;
    this.lastDom = domFires;
    this.gainPhaser = 0;
    this.gainDom = 0;

    this.add.text(24, 18, 'この枠の中をクリックしてください', {
      fontSize: '15px',
      color: '#777777',
    });

    // Phaser 側：シーンを離れるとき、Phaser が自動で外してくれる。
    this.input.on('pointerdown', () => {
      phaserFires += 1;
    });

    // ブラウザ側：外すのは自分の仕事。ここでは、わざと外さずに積み上げていく。
    stage.addEventListener('click', () => {
      domFires += 1;
    });
    domHandlers += 1;

    this.info = this.add.text(40, 58, '', {
      fontSize: '17px',
      color: '#333333',
      lineSpacing: 11,
    });
  }

  update() {
    // 直前の 1 クリックで、それぞれ何回呼ばれたかを割り出す。
    if (phaserFires !== this.lastPhaser || domFires !== this.lastDom) {
      this.gainPhaser = phaserFires - this.lastPhaser;
      this.gainDom = domFires - this.lastDom;
      this.lastPhaser = phaserFires;
      this.lastDom = domFires;
    }

    this.info.setText([
      'シーンを作り直した回数　　　　　… ' + starts + ' 回',
      'Phaser の pointerdown ハンドラ … ' +
        this.input.listenerCount('pointerdown') +
        ' 個（古い分は片付いた）',
      '自分でつけた click ハンドラ　　 … ' +
        domHandlers +
        ' 個（外していないので残っている）',
      '',
      '直前の 1 クリックで … Phaser +' +
        this.gainPhaser +
        ' ／ DOM +' +
        this.gainDom,
    ]);
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage',
  width: 684,
  height: 240,
  backgroundColor: '#fdf6e3',
  scene: [MainScene],
});

document.querySelector('#restart').addEventListener('click', () => {
  game.scene.getScene('Main').scene.restart();
});

document
  .querySelector('#reload')
  .addEventListener('click', () => location.reload());
