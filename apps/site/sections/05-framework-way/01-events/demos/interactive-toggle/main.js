// 同じ 'pointerdown' でも、どこに登録するかで意味が変わる。
// さらに setInteractive() を外すと、部品側だけが無言で反応しなくなる。
class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  create() {
    this.screenCount = 0;
    this.buttonCount = 0;

    this.screenText = this.add.text(330, 76, '', {
      fontSize: '18px',
      color: '#2b6cb0',
    });
    this.buttonText = this.add.text(330, 116, '', {
      fontSize: '18px',
      color: '#c0392b',
    });
    this.stateText = this.add.text(330, 166, '', {
      fontSize: '15px',
      color: '#777777',
    });

    // 画面のどこを押しても反応する。
    this.input.on('pointerdown', () => {
      this.screenCount += 1;
      this.render();
    });

    this.button = this.add
      .rectangle(150, 120, 190, 62, 0xe08e3c)
      .setStrokeStyle(3, 0x333333);
    this.add
      .text(150, 120, 'ボタン', { fontSize: '20px', color: '#ffffff' })
      .setOrigin(0.5);

    // その部品を押したときだけ反応する。
    this.button.on('pointerdown', () => {
      this.buttonCount += 1;
      this.render();
    });

    // 「この部品は押される対象です」と宣言する。これが無いと上の on(...) は呼ばれない。
    this.applyInteractive(true);
  }

  /** setInteractive() を付けたり外したりする。 */
  applyInteractive(on) {
    this.isDeclared = on;
    if (on) this.button.setInteractive({ useHandCursor: true });
    else this.button.disableInteractive();
    this.render();
  }

  render() {
    this.screenText.setText(
      '画面全体 this.input … ' + this.screenCount + ' 回',
    );
    this.buttonText.setText(
      'ボタン　 button 　　… ' + this.buttonCount + ' 回',
    );
    this.stateText.setText(
      this.isDeclared
        ? 'いま: setInteractive() あり'
        : 'いま: setInteractive() なし',
    );
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'stage',
  width: 684,
  height: 230,
  backgroundColor: '#fdf6e3',
  scene: [MainScene],
});

document.querySelector('#toggle').addEventListener('click', (event) => {
  const scene = game.scene.getScene('Main');
  const next = !scene.isDeclared;
  scene.applyInteractive(next);
  event.target.textContent = next
    ? 'setInteractive() を外す'
    : 'setInteractive() を付ける';
});
