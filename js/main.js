import PreloadScene from "./PreloadScene.js";
import HomePage from "./HomePage.js";
import GamePage from "./GamePage.js";
import GameEndPage from "./GameEndPage.js";

const config = {
  parent: "game",
  type: Phaser.AUTO,
  width: 2160,
  height: 3840,

  border: 2,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },

  input: {
    activePointers: 3,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [PreloadScene, HomePage, GamePage, GameEndPage],
};

const game = new Phaser.Game(config);
