import Phaser from 'phaser';
import app from '../index';

import Carrot from '../game/Carrot';

export default class Game extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;
  /** @type {Phaser.Physics.Arcade.Group} */
  carrots;
  timer = 0;
  height = app.config.height;
  level = 5;
  carrotsCollected = 0;

  constructor() {
    super('game');
  }

  preload() {
    this.load.image('background', 'assets/bg_layer1.png');
    this.load.image('platform', 'assets/ground_grass.png');
    this.load.image('bunny-stand', 'assets/bunny1_stand.png');
    this.load.image('carrot', 'assets/carrot.png');
  }

  create() {
    this.add.image(240, 320, 'background').setScrollFactor(1, 0);

    this.player = this.physics.add
      .sprite(240, 320, 'bunny-stand')
      .setScale(0.5);

    // create a static physics group
    this.platforms = this.physics.add.staticGroup();

    // then create 5 this.platform from the group
    for (let i = 0; i < this.level; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = ((this.height + 100) / this.level) * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, 'platform');
      platform.scale = 0.5;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    this.physics.add.collider(this.platforms, this.player);

    this.player.body.checkCollision = {
      up: false,
      left: false,
      right: false,
    };

    this.cameras.main.startFollow(this.player);
    // set camera dead zone
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.carrots = this.physics.add.group({ classType: Carrot });
    this.physics.add.collider(this.platforms, this.carrots);

    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot,
      undefined,
      this,
    );

    const style = { color: '#000', fontSize: 26 };
    this.add
      .text(240, 10, 'Carrots: 0', style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
  }

  update(time, delta) {
    this.timer += delta;
    if (this.timer >= 1000) {
      this.timer -= 1000;
    }

    this.platforms.children.iterate(p => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = p;
      // how many units the camera is traveling in y-direction
      const scrollY = this.cameras.main.scrollY;
      // is platform lower than 700 units under scrollY?
      if (platform.y >= scrollY + 700) {
        // if so, put it between 50 and 100 units above platform
        platform.y =
          scrollY - Phaser.Math.Between(250 / this.level, 500 / this.level);
        platform.body.updateFromGameObject();

        // create a carrot above the platform being reused
        this.addCarrotAbove(platform);
      }
    });
    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      this.player.setVelocityY(-300);
    }

    // left and right input logic
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    this.horizontalWrap(this.player);
  }

  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }

  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, 'carrot');

    // set active and visible
    carrot.setActive(true);
    carrot.setVisible(true);

    this.add.existing(carrot);

    // update the physics body size
    carrot.body.setSize(carrot.width, carrot.height);

    this.physics.world.enable(carrot);

    return carrot;
  }

  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Carrot} carrot
   */
  handleCollectCarrot(player, carrot) {
    // hide from display
    this.carrots.killAndHide(carrot);
    // disable from physics world
    this.physics.world.disableBody(carrot.body);
    this.carrotsCollected++;
  }
}
