import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
  }

  create() {
    this.add.image(400, 300, 'sky');
  }
}
