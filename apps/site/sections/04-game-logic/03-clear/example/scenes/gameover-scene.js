class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    this.add
      .text(400, 200, 'ゲームオーバー', {
        fontSize: '36px',
        color: '#c0392b',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 280, 'クリックでスタートに戻る', {
        fontSize: '18px',
        color: '#555555',
      })
      .setOrigin(0.5);

    this.input.once('pointerdown', () => this.scene.start('Start'));
  }
}
