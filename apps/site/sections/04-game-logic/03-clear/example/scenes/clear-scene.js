class ClearScene extends Phaser.Scene {
  constructor() {
    super('Clear');
  }

  create() {
    this.add
      .text(400, 200, 'クリア！', {
        fontSize: '40px',
        color: '#2e7d32',
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
