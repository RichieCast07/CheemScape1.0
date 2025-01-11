import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";

export default class GameStart extends Phaser.Scene {
    constructor() {
        super(SceneKeys.GameStart);
    }

    create() {
        const { width, height } = this.scale;
        const x = width * 0.5;
        const y = height * 0.4;

        const titleText = this.add.text(x, y, "CheemScape", {
            fontSize: "60px",
            fontFamily: "'Press Start 2P', cursive",
            color: "#FFFFFF",
            backgroundColor: "#000000",
            padding: { left: 10, right: 10, top: 10, bottom: 10 }
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: titleText,
            alpha: { from: 1, to: 0.2 },
            duration: 1700, 
            yoyo: true, 
            repeat: -1, 
            ease: 'Sine.easeInOut'
        });
        

        const gradient = titleText.context.createLinearGradient(0, 0, 0, titleText.height);
        gradient.addColorStop(0, "#FFD700");
        gradient.addColorStop(1, "#dcdcdc");

        titleText.setFill(gradient);
        const startText = this.add.text(x, y + 100, "Presiona ESPACIO para comenzar", {
            fontSize: "16px",
            fontFamily: "'Press Start 2P', cursive",
            color: "#00FF00",
            backgroundColor: "#000000",
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: startText,
            alpha: { from: 1, to: 0 },
            duration: 1700, 
            yoyo: true, 
            repeat: -1, 
            ease: 'Linear' 
        });
        


        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.stop(SceneKeys.GameStart);
            this.scene.start(SceneKeys.Game);
        });
    }
}
