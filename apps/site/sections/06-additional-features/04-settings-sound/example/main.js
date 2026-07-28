new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  backgroundColor: '#fdf6e3',
  physics: {
    default: 'matter',
    matter: { gravity: { y: 1 } },
  },
  scene: [StartScene, GameScene, GameOverScene, ClearScene],
});
