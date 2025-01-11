import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";

export default class GameOver extends Phaser.Scene {
    constructor() {
        super(SceneKeys.GameOver);
    }

    preload() {
        this.load.image('Ghost', './assets/cheemstasm.png');
    }

    create() {
        const { width, height } = this.scale;
        const x = width * 0.5;
        const y = height * 0.5;
    
        const modal = this.add.graphics();
        modal.fillStyle(0x000000, 0.8);
        modal.fillRoundedRect(x - 200, y - 150, 500, 300, 20);
        modal.setScrollFactor(0);
            
        this.add.image(x, y - 120, 'Ghost')
            .setOrigin(0.5) 
            .setDisplaySize(120, 150);
    
            const loseText = this.add.text(x, y - 10, "Has perdido :(", {
                fontSize: "40px",
                fontFamily: "'Press Start 2P', cursive",
                color: "#FF0000",
                padding: { left: 10, right: 10, top: 10, bottom: 10 }
            }).setOrigin(0.5);
            
            this.tweens.add({
                targets: loseText,
                alpha: { from: 1, to: 0.3 }, 
                duration: 1400,
                yoyo: true, 
                repeat: -1,
                ease: 'Linear'
            });
            
    
        this.add.text(x, y + 50, "Presiona ESPACIO para jugar de nuevo.", {
            fontSize: "16px",
            fontFamily: "'Press Start 2P', cursive",
            color: "#FFFFFF",
            padding: { left: 10, right: 10, top: 10, bottom: 10 }
        }).setOrigin(0.5);
    
        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.stop(SceneKeys.GameOver);
            this.scene.start(SceneKeys.Game);
        });
    }
    
}
