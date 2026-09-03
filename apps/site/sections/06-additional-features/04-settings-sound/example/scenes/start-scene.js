class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create() {
    this.add
      .text(360, 140, 'パチンコ物理ゲーム', {
        fontSize: '36px',
        color: '#5d4037',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(360, 250, '▶ スタート', {
        fontSize: '28px',
        color: '#ffffff',
        backgroundColor: '#e08e3c',
        padding: { x: 24, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startText.on('pointerdown', () => this.scene.start('Game'));

    this.makeToggle(360, 350, '効果音', 'slingshot-sfx');
    this.makeToggle(360, 410, 'BGM', 'slingshot-bgm');
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

    const render = () => {
      const on = localStorage.getItem(key) !== 'off';
      text.setText(label + ': ' + (on ? 'ON' : 'OFF'));
      text.setColor(on ? '#27ae60' : '#999999');
    };
    render();

    text.on('pointerdown', () => {
      const on = localStorage.getItem(key) !== 'off';
      localStorage.setItem(key, on ? 'off' : 'on');
      render();
    });
  }
}
