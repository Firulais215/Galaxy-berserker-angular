export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        const centreX = this.scale.width * 0.5;
        const centreY = this.scale.height * 0.5;

        const barWidth = 468;
        const barHeight = 32;
        const barMargin = 4;
        //  We loaded this image in our Boot Scene, so we can display it here

        this.add.text(400,300,'CARGANDO...',{
            fontSize: '25px',
            fontFamily: 'Sixtyfour',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(centreX, centreY, barWidth, barHeight).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(centreX - (barWidth * 0.5) + barMargin, centreY, barMargin, barHeight - barMargin, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = barMargin + ((barWidth - (barMargin * 2)) * progress);

        });
    }

    preload() {
        
    }

    create() {
        this.time.delayedCall(4000,() => {
            this.scene.start('MenuScene');
        });
    }
}
