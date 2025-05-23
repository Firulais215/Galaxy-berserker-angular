import { MenuScene } from "./MenuScene";

export class GameOverScene extends Phaser.Scene {
    background!: Phaser.GameObjects.TileSprite;
    restartButton!: Phaser.GameObjects.Image;
    restartText!: Phaser.GameObjects.Text;
    scoreText!: Phaser.GameObjects.Text;
    score!: number;

    constructor() {
        super('GameOverScene');
    }

    
    preload() {
        this.load.image('background', './assets/fondo2.gif');
        this.load.image('boton','./assets/boton09.png');
    }

    create(data: { score: number }) {
        this.score = data.score;
        var ancho = this.sys.game.canvas.width;
        var alto = this.sys.game.canvas.height;
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');
        this.add.text( ancho/2, alto/2,"Game Over\n\nScore: "+ data.score, {
            fontSize: '50px',
            fontFamily: 'Sixtyfour',
            color: '#fff'}
        ).setOrigin(0.5);

        this.restartButton = this.add.image(ancho/2, alto/1.2, 'boton').setScale(1.5).setOrigin(0.5).setInteractive({useHandCursor: true});
        this.restartButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        this.restartText = this.add.text(ancho/2, alto/1.2,'RESTART',{
            fontSize: '25px',
            fontFamily: 'Sixtyfour',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5).setDepth(10);
    }

    override update() {
        this.background.tilePositionX += 2;
    }
}