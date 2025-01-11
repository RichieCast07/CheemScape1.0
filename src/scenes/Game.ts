import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "../consts/TextureKeys";
import RocketMouse from "../game/RocketMouse";
import LaserObstacle from "../game/LaserObstacle";
import SoundKeys from "../consts/SoundKeys";

export default class Game extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;
    private mouseHole!: Phaser.GameObjects.Image;
    private window1!: Phaser.GameObjects.Image;
    private window2!: Phaser.GameObjects.Image;
    private bookcase1!: Phaser.GameObjects.Image;
    private bookcase2!: Phaser.GameObjects.Image;
    private bookcases: Phaser.GameObjects.Image[] = [];
    private windows: Phaser.GameObjects.Image[] = [];
    private laserObstacle!: LaserObstacle;
    private coins!: Phaser.Physics.Arcade.Group;
    private scoreLabel!: Phaser.GameObjects.Text;
    private timeLabel!: Phaser.GameObjects.Text;
    private obstaclesEvadedLabel!: Phaser.GameObjects.Text;
    private mouse!: RocketMouse;
    private score = 0;
    private obstaclesEvaded = 0;
    private playTime = 0;

    constructor() {
        super(SceneKeys.Game);
    }

    init() {
        this.score = 0;
        this.obstaclesEvaded = 0;
        this.playTime = 0;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;
        const textSpacing = width / 4;

        this.background = this.add.tileSprite(0, 0, width, height, TextureKeys.Background)
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.mouseHole = this.add.image(Phaser.Math.Between(900, 1500), 501, TextureKeys.MouseHole);
        this.window1 = this.add.image(Phaser.Math.Between(900, 1300), 200, TextureKeys.Window1);
        this.window2 = this.add.image(Phaser.Math.Between(1600, 2000), 200, TextureKeys.Window2);
        this.windows = [this.window1, this.window2];
        this.bookcase1 = this.add.image(Phaser.Math.Between(2200, 2700), 580, TextureKeys.Bookcase1).setOrigin(0.5, 1);
        this.bookcase2 = this.add.image(Phaser.Math.Between(2900, 3400), 580, TextureKeys.Bookcase2).setOrigin(0.5, 1);
        this.bookcases = [this.bookcase1, this.bookcase2];
        this.laserObstacle = new LaserObstacle(this, 900, 100);
        this.add.existing(this.laserObstacle);

        this.coins = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });

        this.spawnCoins();

        this.mouse = new RocketMouse(this, width * 0.3, height - 30);
        this.add.existing(this.mouse);
        const body = this.mouse.body as Phaser.Physics.Arcade.Body;

        body.setCollideWorldBounds(true);
        body.setVelocityX(400);

        this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height - 55);

        this.physics.add.overlap(this.laserObstacle, this.mouse, this.handleOverlapLaser, undefined, this);
        this.physics.add.overlap(this.coins, this.mouse, this.handleCollectCoin, undefined, this);

        this.scoreLabel = this.add.text(textSpacing * 0.2, 10, `Monedas: ${this.score}`, {
            fontSize: "15px",
            fontFamily: "'Press Start 2P', cursive",
            color: "#080808",
            backgroundColor: "#F8E71C",
            padding: { left: 15, right: 15, top: 10, bottom: 10 },
        }).setScrollFactor(0);

        this.timeLabel = this.add.text(textSpacing * 1.4, 10, `Tiempo: 0s`, {
            fontSize: "15px",
            fontFamily: "'Press Start 2P', cursive",
            color: "#080808",
            backgroundColor: "#F8E71C",
            padding: { left: 15, right: 15, top: 10, bottom: 10 },
        }).setScrollFactor(0);

        this.obstaclesEvadedLabel = this.add.text(textSpacing * 2.7, 10, `Obstaculos: ${this.obstaclesEvaded}`, {
            fontSize: "15px",
            fontFamily: "'Press Start 2P', cursive",
            color: "#080808",
            backgroundColor: "#F8E71C",
            padding: { left: 15, right: 15, top: 10, bottom: 10 },
        }).setScrollFactor(0);

        this.cameras.main.startFollow(this.mouse, true, 0.3, 0.3, -300, 0);
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height);
    }

    update(time: number, delta: number) {
        this.background.setTilePosition(this.cameras.main.scrollX);
        this.wrapMouseHole();
        this.wrapWindows();
        this.wrapLaserObstacle();
        this.wrapBookcases();
        this.wrapCoins();

        this.playTime += delta;
        this.timeLabel.text = `Tiempo: ${(this.playTime / 1000).toFixed(1)}s`;
        this.obstaclesEvadedLabel.text = `Obstaculos: ${this.obstaclesEvaded}`;

        this.repositionCoins();
    }

    private handleCollectCoin(player: Phaser.GameObjects.GameObject, coin: Phaser.GameObjects.GameObject) {
        const coinSprite = coin as Phaser.Physics.Arcade.Sprite;
        if (coinSprite.active) {
            this.coins.killAndHide(coinSprite);
            coinSprite.body.enable = false;
            this.sound.play(SoundKeys.CoinSound);
    
            this.score += 1;
            this.scoreLabel.text = `Monedas: ${this.score}`;
    
            const storedCoins = localStorage.getItem('coins'); 
            const totalCoins = storedCoins ? parseInt(storedCoins) + 1 : 1; 
            localStorage.setItem('coins', totalCoins.toString()); 
        }
    }
    

    private wrapMouseHole() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        if (this.mouseHole.x + this.mouseHole.width < scrollX) {
            this.mouseHole.x = Phaser.Math.Between(rightEdge + 100, rightEdge + 1000);
        }
    }

    private wrapWindows() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        let width = this.window1.width * 2;
        if (this.window1.x + width < scrollX) {
            this.window1.x = Phaser.Math.Between(rightEdge + width, rightEdge + width + 800);
            const overlap = this.bookcases.find(bc => Math.abs(this.window1.x - bc.x) <= this.window1.width);
            this.window1.visible = !overlap;
        }

        width = this.window2.width;
        if (this.window2.x + width < scrollX) {
            this.window2.x = Phaser.Math.Between(this.window1.x + width, this.window1.x + width + 800);
            const overlap = this.bookcases.find(bc => Math.abs(this.window2.x - bc.x) <= this.window2.width);
            this.window2.visible = !overlap;
        }
    }

    private wrapBookcases() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        let width = this.bookcase1.width * 2;
        if (this.bookcase1.x + width < scrollX) {
            this.bookcase1.x = Phaser.Math.Between(rightEdge + width, rightEdge + width + 800);
            const overlap = this.windows.find(win => Math.abs(this.bookcase1.x - win.x) <= win.width);
            this.bookcase1.visible = !overlap;
        }

        width = this.bookcase2.width;
        if (this.bookcase2.x + width < scrollX) {
            this.bookcase2.x = Phaser.Math.Between(this.bookcase1.x + width, this.bookcase1.x + width + 800);
            const overlap = this.windows.find(win => Math.abs(this.bookcase2.x - win.x) <= this.bookcase2.width);
            this.bookcase2.visible = !overlap;

            this.spawnCoins();
        }
    }

    private wrapLaserObstacle() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        const body = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody;
        const width = body.width;
        if (this.laserObstacle.x + width < scrollX) {
            this.laserObstacle.x = Phaser.Math.Between(rightEdge + width, rightEdge + width + 1000);
            this.laserObstacle.y = Phaser.Math.Between(0, this.scale.height - 100);
            body.position.x = this.laserObstacle.x + body.offset.x;
            body.position.y = this.laserObstacle.y;
            this.obstaclesEvaded += 1;
        }
    }

    private wrapCoins() {
        this.coins.children.each((child) => {
            const coin = child as Phaser.Physics.Arcade.Sprite;
            if (coin.x + coin.width < this.cameras.main.scrollX) {
                coin.setActive(false).setVisible(false);
            }
        });
    }

    private handleOverlapLaser(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const mouse = obj2 as RocketMouse;
        mouse.kill();
        this.physics.pause();
        this.cameras.main.shake(200, 0.01);
    }
    

    private spawnCoins() {
        const rightEdge = this.cameras.main.scrollX + this.scale.width;
        let x = rightEdge + 100;
    
        while (this.coins.countActive(true) < 6) {
            const coin = this.coins.getFirstDead() || 
                this.coins.create(
                    x,
                    Phaser.Math.Between(100, this.scale.height - 100),
                    TextureKeys.Coin
                ) as Phaser.Physics.Arcade.Sprite;
    
            coin.setActive(true).setVisible(true);
            coin.body.enable = true;
            coin.body.updateFromGameObject();
    
            this.tweens.add({
                targets: coin,
                scaleX: -1,
                duration: 800,
                yoyo: true, 
                repeat: -1
            });
    
            x += 150;
        }
    }

    private repositionCoins() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        this.coins.children.each((child) => {
            const coin = child as Phaser.Physics.Arcade.Sprite;

            if (coin.x + coin.width < scrollX) {
                coin.x = Phaser.Math.Between(rightEdge + 100, rightEdge + 300);
                coin.y = Phaser.Math.Between(100, this.scale.height - 100);
                coin.setActive(true).setVisible(true);
                coin.body.enable = true;
                coin.body.updateFromGameObject();
            }
        });
    }
}
