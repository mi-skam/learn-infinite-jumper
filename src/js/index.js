import '../css/style.css';

import Phaser from 'phaser';

function preload() {
  this.load.image('sky', 'assets/sky.png');
}

function create() {
  this.add.image(400, 300, 'sky');
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: {
    preload,
    create,
  },
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);
