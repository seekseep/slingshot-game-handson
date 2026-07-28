class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create() {
    this.add
      .text(400, 140, 'パチンコ物理ゲーム', {
        fontSize: '36px',
        color: '#5d4037',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(400, 250, '▶ スタート', {
        fontSize: '28px',
        color: '#ffffff',
        backgroundColor: '#e08e3c',
        padding: { x: 24, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startText.on('pointerdown', () => this.scene.start('Game'));

    // 音の ON/OFF を切り替えるボタン。設定は localStorage に保存する。
    this.makeToggle(400, 350, '効果音', 'slingshot-sfx');
    this.makeToggle(400, 410, 'BGM', 'slingshot-bgm');
  }

  makeToggle(x, y, label, key) {
    const text = this.add
      .text(x, y, '', {
        fontSize: '22px',
        color: '#333333',
        backgroundColor: '#f0e6d2',
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // いまの設定を見た目に反映する。保存が 'off' のときだけ OFF。
    const render = () => {
      const on = localStorage.getItem(key) !== 'off';
      text.setText(label + ': ' + (on ? 'ON' : 'OFF'));
      text.setColor(on ? '#27ae60' : '#999999');
    };
    render();

    // クリックで ON/OFF を反転して保存する。
    text.on('pointerdown', () => {
      const on = localStorage.getItem(key) !== 'off';
      localStorage.setItem(key, on ? 'off' : 'on');
      render();
    });
  }
}
