import Phaser from 'phaser';
import Preloader from './scenes/Preloader';
import Game from './scenes/Game';
import GameOver from './game/GameOver';
import GameStart from './game/GameStart';

let phaserGame: Phaser.Game | null = null;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 250 },
      debug: false,
    },
  },
  scene: [Preloader, GameStart, Game, GameOver],
};

export function initializeGame(parentId: string) {
  if (!phaserGame) {
    config.parent = parentId; 
    phaserGame = new Phaser.Game(config);
  }
}

export function destroyGame() {
  if (phaserGame) {
    phaserGame.destroy(true); 
    phaserGame = null;
  }
}
