import { GameObjects, Scene } from 'phaser';

export class MenuScene extends Phaser.Scene{
    background!: GameObjects.TileSprite;
    TitleText!: GameObjects.Text;
    controlImage!: GameObjects.Image;
    infoText!: GameObjects.Text;
    inicioText!: GameObjects.Text;
    backText!: GameObjects.Text;
    tutorialText!: GameObjects.Text;
    startButton!: GameObjects.Image;
    infoButton!: GameObjects.Image;
    menuButton!: GameObjects.Image;

    constructor(){
        super('MenuScene');
    }

    preload(){
        this.load.image('background', 'assets/fondo2.gif');
        this.load.image('boton','assets/boton09.png');
        this.load.image('botonInicio','assets/botonInicio.png');
        this.load.image('controles','assets/controles-1.png')
    }

    create(){
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');
        this.background.setScale(2);
        this.background.setScrollFactor(0);

        initUI(this);
    }

    override update(){
        this.background.tilePositionX += 2;
    }
}


function initUI(scene : MenuScene){
    
    var ancho = scene.sys.game.canvas.width;
    var alto = scene.sys.game.canvas.height;

    scene.TitleText = scene.add.text(ancho/2, alto/2.5,'GALAXY BERSERKER',{
        fontSize: '60px',
        fontFamily: 'Nabla',
        color: '#fff',
        align: 'center'
    }).setOrigin(0.5);

    scene.controlImage = scene.add.image(ancho/2,alto/1.6,'controles').setScale(0.5).setVisible(false);

    scene.infoText = scene.add.text(ancho/1.3, alto/1.5,'INFO',{
        fontSize: '25px',
        fontFamily: 'Sixtyfour',
        color: '#fff',
        align: 'center'
    }).setOrigin(0.5).setDepth(10);

    scene.inicioText = scene.add.text(ancho/4, alto/1.5,'START',{
        fontSize: '25px',
        fontFamily: 'Sixtyfour',
        color: '#fff',
        align: 'center'
    }).setOrigin(0.5).setDepth(10);

    scene.backText = scene.add.text(ancho/5, alto/6.2,'MENU',{
        fontSize: '25px',
        fontFamily: 'Sixtyfour',
        color: '#fff',
        align: 'center'
    }).setOrigin(0.5).setDepth(10);

    scene.backText.setVisible(false);

    scene.tutorialText = scene.add.text(ancho/1.5, alto/6.2, 'Destruye los\n\nasteroides y consigue\n\nla mayor puntuación', {
        fontSize: '20px',
        fontFamily: 'Sixtyfour',
        color: '#fff',
        align: 'center'
    }).setOrigin(0.5);

    scene.tutorialText.setVisible(false);
   scene.startButton = scene.add.image(ancho/4, alto/1.5, 'boton').setScale(1.5).setOrigin(0.5).setInteractive({useHandCursor: true});
    scene.startButton.on('pointerdown', function () {
        scene.scene.start('GameScene');
    });
    
   scene.infoButton = scene.add.image(ancho/1.3, alto/1.5, 'boton').setScale(1.5).setOrigin(0.5).setInteractive({useHandCursor: true});
    scene.infoButton.on('pointerdown', function () {
        scene.TitleText.setVisible(false);
        scene.infoText.setVisible(false);
        scene.backText.setVisible(true);
        scene.inicioText.setVisible(false);
        scene.tutorialText.setVisible(true);
        scene.infoButton.setVisible(false);
        scene.menuButton.setVisible(true);
        scene.startButton.setVisible(false);
        scene.controlImage.setVisible(true);
    });

    scene.menuButton = scene.add.image(ancho/5, alto/6.2, 'boton').setScale(1.5).setOrigin(0.5).setInteractive({useHandCursor: true});
    scene.menuButton.on('pointerdown', function () {
        scene.TitleText.setVisible(true);
        scene.backText.setVisible(false);
        scene.tutorialText.setVisible(false);
        scene.inicioText.setVisible(true);
        scene.startButton.setVisible(true);
        scene.infoText.setVisible(true);
        scene.infoButton.setVisible(true);
        scene.menuButton.setVisible(false);
        scene.controlImage.setVisible(false);
    });

    scene.menuButton.setVisible(false); 
}