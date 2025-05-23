import Phaser from "phaser";
import { GameOverScene } from "./GameOverScene.js";

export class GameScene extends Phaser.Scene {
    background!: Phaser.GameObjects.TileSprite;
    scoreText!: Phaser.GameObjects.Text;
    player!: Phaser.Physics.Arcade.Sprite;
    asteroides!: Phaser.Physics.Arcade.Group;
    rayos!: Phaser.Physics.Arcade.Group;
    rayo!: Phaser.Physics.Arcade.Image;
    laser!: Phaser.Physics.Arcade.Image;
    score = 0;
    lives = 5;
    energy = 5;
    isInvulnerable= false;
    invulnerabilityTime= 2000;
    energyCooldown= false;
    gamePause=false;
    vidaCritica = false;
    vidaSprite!: Phaser.GameObjects.Image;
    energiaSprite!: Phaser.GameObjects.Image;
    vidaSombra!: Phaser.GameObjects.Image;
    energiaSombra!: Phaser.GameObjects.Image;
    buttonPause!: Phaser.GameObjects.Image;
    tutorialText!: Phaser.GameObjects.Text;
    shiftKey!: Phaser.Input.Keyboard.Key;
    spaceKey!: Phaser.Input.Keyboard.Key;
    pKey!: Phaser.Input.Keyboard.Key;
    alerta!: Phaser.GameObjects.Image;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    frameIndex= 1;
    laserEvent!: Phaser.Time.TimerEvent;
    live= 0;

    constructor() {
        super('GameScene');
    }
    
    preload():void {

        this.load.image('alerta','assets/alerta.png');
        this.load.image('background', 'assets/fondo2.gif');
        this.load.image('nave', 'assets/prueba-nave.png');
        this.load.image('asteroide','assets/asteroide.png');
        this.load.image('rayo','assets/prueba-1.png');
        this.load.image('pausa','assets/pausa.png');
        
        for(let i = 1;i <=5;i++){
            this.load.image(`vida-${i}`,`assets/vida/${i}.png`);
            this.load.image(`energia-${i}`,`assets/energia/${i}.png`);
        }

        for(let o = 1;o <=12;o++){
            this.load.image(`laser-${o}`,`assets/rayo/${o}.png`);
        }
    }

    create():void {
        this.shiftKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');
        this.scoreText = this.add.text(15, 15, 'Score: '+this.score, {
            fontSize: '15px',
            fontFamily: 'Sixtyfour',
            color: '#fff'
        }).setDepth(10);

        

        this.vidaSprite = this.add.image(735, 25, 'vida-1').setScale(1).setOrigin(0.5).setDepth(10);
        this.energiaSprite = this.add.image(600, 25, 'energia-1').setScale(1).setOrigin(0.5).setDepth(10);

        this.vidaSombra = this.add.image(750, 25, 'vida-5') 
        .setTint(0xFF0000)
        .setAlpha(0.5)
        .setScale(1.4)
        .setDepth(11);

        this.vidaSombra.setVisible(false);

        this.energiaSombra = this.add.image(605, 25, 'energia-5') 
        .setTint(0x00FF00)
        .setAlpha(0.5)
        .setScale(1.2)
        .setDepth(11);

        this.energiaSombra.setVisible(false);

        this.buttonPause = this.add.image(35, 570, 'pausa').setScale(0.3).setOrigin(0.5).setDepth(10).setInteractive({useHandCursor: true});
        this.buttonPause.on('pointerdown', () => {
            this.pauseGame();
        }, this);

        this.player = this.physics.add.sprite(100, 300, 'nave');
        this.player.setScale(0.5);
        this.player.setCollideWorldBounds(true);

        this.alerta = this.add.image(640,360,'alerta')
            .setScale(0.5)
            .setDepth(12)
            .setAlpha(0)
            .setVisible(false);
        this.rayos = this.physics.add.group();

        this.asteroides = this.physics.add.group();


        this.laser = this.physics.add.image(450,15,'laser-1')
        .setScale(3,2)
        .setAlpha(0.8)
        .setVisible(false);

        this.laser.disableBody(true,true);

        this.time.addEvent({
            delay:2000,
            callback: this.createAsteroid,
            callbackScope: this,
            loop: true
        })

        this.time.addEvent({
            delay: 300, 
            callback: this.parpadeoVida,
            callbackScope: this,
            loop:true
        });

        this.time.addEvent({
            delay:1000,
            callback:this.recargarEnergia,
            callbackScope:this,
            loop:true
        });


        this.time.addEvent({
            delay:10000,
            callback:this.mostrarAlerta,
            callbackScope:this,
            loop:true
        });


        this.laserEvent = this.time.addEvent({
            delay:100,
            callback:this.generarLaser,
            callbackScope:this,
            loop:true,
            paused:true
        });

        this.physics.add.collider(this.player, this.asteroides, this.AsteroidTouch, undefined, this);
        this.physics.add.collider(this.rayos, this.asteroides, this.laserAsteroid, undefined, this);
        this.physics.add.overlap(this.player, this.laser, this.playerLaser, undefined, this);
       
        this.cursors = this.input.keyboard!.createCursorKeys();


    }

    override update():void {
        this.background.tilePositionX += 2;

        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown) vx = -200;
        if (this.cursors.right.isDown) vx = 200;
        if (this.cursors.up.isDown) vy = -300;
        if (this.cursors.down.isDown) vy = 300;

        this.player.setVelocityX(vx);
        this.player.setVelocityY(vy);

        if (this.shiftKey.isDown && this.energy > 0 && !this.gamePause) {
            
            this.player.setScale(0.3);
            this.player.setVelocityX(vx * 2);
            this.player.setVelocityY(vy * 2);

            if(!this.energyCooldown){
                this.energy--;
                this.updateEnergia();
                this.energyCooldown= true;

                this.time.delayedCall(500,() =>{
                    this.energyCooldown=false;
                },undefined,this)
            }
            
        }
        else {
            this.player.setScale(0.5);
            this.player.setVelocityX(vx);
            this.player.setVelocityY(vy);
        }

        if(Phaser.Input.Keyboard.JustDown(this.pKey)){
            this.pauseGame();
        }

        if(Phaser.Input.Keyboard.JustDown(this.spaceKey) && !this.gamePause){ 
            this.rayo = this.rayos.create(this.player.x, this.player.y, 'rayo');
            this.rayo.setScale(0.5);
            this.rayo.setVelocityX(500);
        }

       
        
    }

     AsteroidTouch: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (object1, object2): void => {
        const playerSprite = object1 as Phaser.Physics.Arcade.Sprite;
        const asteroidSprite = object2 as Phaser.Physics.Arcade.Image;
        asteroidSprite.disableBody(true, true);
        this.InvulnerableEfect();
        this.lives--;
        this.updateLives();
        if (this.lives <= 0) {
        this.physics.pause();
        this.gamePause = true;
        this.scene.start('GameOverScene', { score: this.score });
        }
    };

    laserAsteroid: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (object1, object2):void =>{
        const rayoSprite = object1 as Phaser.Physics.Arcade.Sprite;
        const asteroideSprite = object2 as Phaser.Physics.Arcade.Image;
        asteroideSprite.disableBody(true, true);
        rayoSprite.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    

    createAsteroid() {
        if(this.gamePause) return;
        var x = Phaser.Math.Between(800, 1000);
        var y = Phaser.Math.Between(80, 540); 
        
        var asteroide = this.asteroides.create(x, y, 'asteroide');
        
        asteroide.setScale(0.15);
        asteroide.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        asteroide.setVelocity(Phaser.Math.Between(-500, 0), 20);
    }

    pauseGame() {
        if(!this.gamePause){
                this.gamePause = true;
                this.physics.pause();

                this.tweens.pauseAll();
                this.time.timeScale = 0;
                this.tutorialText = this.add.text(300, 300, 'PAUSA', {
                    fontSize: '40px',
                    fontFamily: 'Sixtyfour',
                    color: '#fff'});
            }
            else{
                this.gamePause = false;
                this.physics.resume();
                this.tweens.resumeAll();
                this.time.timeScale = 1;
                this.tutorialText.setVisible(false);
            }
    }

    updateLives() {
        this.live = 6-this.lives;
        if (this.lives < 0) this.scene.start('GameOverScene', { score: this.score });
        if (this.live == 0){
        this.vidaSprite.setTexture('vida-5');

        }
        this.vidaSprite.setTexture(`vida-${this.live}`);
        if(this.live == 5) {
            this.vidaCritica = true;
        }
        else{
             this.vidaCritica = false;
        }
    }

    updateEnergia(){
        let energiaIndex = 5 - this.energy;

        energiaIndex = Phaser.Math.Clamp(energiaIndex, 1, 5); // limita la energía de 1 a 5
        this.energiaSprite.setTexture(`energia-${energiaIndex}`);
        this.energiaSombra.setVisible(this.energy === 0);
        
    }

    recargarEnergia(){
        if(this.energy < 5 && !this.shiftKey.isDown && !this.gamePause){
            this.energy++;
            this.updateEnergia();
        }
    }

    parpadeoVida(){
        if (this.vidaCritica){
            this.vidaSombra.setVisible(!this.vidaSombra.visible);
        }
        else{
            this.vidaSombra.setVisible(false);
        }
    }

    mostrarAlerta(){
        if(this.score < 200) return;
        else{
            
            var y = Phaser.Math.Between(80, 540); 
            this.alerta.setPosition(700,y).setVisible(true);

           this.tweens.add({
                targets: this.alerta,
                alpha: { from: 0, to: 1 },
                yoyo: true,
                duration: 500,
                hold: 1000,
                onComplete: () => {
                    this.alerta.setVisible(false);
                    this.alerta.setAlpha(0);
                    this.laser.enableBody(true, 460, y, true, true);
                    this.laserEvent.paused = false;

                    this.time.delayedCall(3000, () => {
                        this.laser.disableBody(true, true);
                        this.laserEvent.paused = true;
                    }, undefined, this);
                }
            });
        }
    }

    generarLaser(){
            this.laser.setTexture(`laser-${this.frameIndex}`);
            this.frameIndex++;
            if (this.frameIndex == 12) this.frameIndex = 1;
    }

    playerLaser(){
        if (this.isInvulnerable || this.gamePause) return;
       
        this.lives = this.lives-3;
        this.updateLives();

        this.isInvulnerable = true;
        this.InvulnerableEfect();

        this.time.delayedCall(this.invulnerabilityTime, () => {
            this.isInvulnerable = false;
            this.player.setAlpha(1);
        });
        
    }

    InvulnerableEfect(){
        if(this.isInvulnerable){
            this.tweens.add({
                targets: this.player,
                alpha: 0,
                yoyo: true,
                repeat: 5,
                duration: 100
            });
        }
    }
}

