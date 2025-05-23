import { Preloader } from './scenes/Preload';
import{ MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import Phaser from 'phaser';

export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x:0 ,y: 0 },
            debug: false
        }
    },
    scene: [Preloader,MenuScene, GameScene, GameOverScene],
};

