import { Component, OnInit, OnDestroy,Inject, PLATFORM_ID  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Phaser from 'phaser';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'juego.component.html',
})
export class juego implements OnInit, OnDestroy {
  private phaserGame!: Phaser.Game;
  private GameConfig!: Phaser.Types.Core.GameConfig;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId) && !this.phaserGame) {
      const Phaser = (await import('phaser')).default;
      const { Preloader } = await import('./game/scenes/Preload');
      const { MenuScene } = await import('./game/scenes/MenuScene');
      const { GameScene } = await import('./game/scenes/GameScene');
      const { GameOverScene } = await import('./game/scenes/GameOverScene');

      this.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        physics: {
          default: 'arcade',
          arcade: { gravity: { x: 0, y: 0 }, debug: false }
        },
        scene: [Preloader, MenuScene, GameScene, GameOverScene],
      };

      this.phaserGame = new Phaser.Game({type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
    },
  },
  scene: [Preloader, MenuScene, GameScene, GameOverScene],});
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.phaserGame) {
      this.phaserGame.destroy(true);
    }
  }
}
