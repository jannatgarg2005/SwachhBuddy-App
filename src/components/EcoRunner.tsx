import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

import backgroundAsset from "../asset/bg.jpg";
import bananaAsset from "../asset/toppng.com-shopping-bag-png-512x512.png";
import paperAsset from "../asset/toppng.com-crumpled-piece-of-paper-311x289.png";
import appleAsset from "../asset/box.png";
import plasticBagAsset from "../asset/toppng.com-tin-can-tin-can-cartoon-236x353.png";
import bottleAsset from "../asset/toppng.com-do-what-i-waaant-transparent-warp-pipe-pngs-for-all-flappy-bird-pipe-425x613.png";
import canAsset from "../asset/toppng.com-grocery-bag-png-600x729.png";

const EcoRunner: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    class MainScene extends Phaser.Scene {
      player!: Phaser.Physics.Arcade.Sprite;
      cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      spaceKey!: Phaser.Input.Keyboard.Key;
      groundTiles!: Phaser.GameObjects.TileSprite;
      wasteGroup!: Phaser.GameObjects.Group;
      score = 0;
      scoreText!: Phaser.GameObjects.Text;
      gameOver = false;
      nextWasteTime = 0;
      restartButton!: Phaser.GameObjects.Text;
      gameOverText!: Phaser.GameObjects.Text;
      jumpButton!: Phaser.GameObjects.Text;

      recyclableItems = ["banana", "apple", "paper"];
      nonRecyclableItems = ["bottle", "plasticBag", "can"];

      preload() {
        this.load.image("background", backgroundAsset);
        this.load.image("ground", "https://labs.phaser.io/assets/sprites/platform.png");
        this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
        this.load.image("banana", bananaAsset);
        this.load.image("paper", paperAsset);
        this.load.image("apple", appleAsset);
        this.load.image("plasticBag", plasticBagAsset);
        this.load.image("bottle", bottleAsset);
        this.load.image("can", canAsset);
      }

      create() {
        this.score = 0;
        this.gameOver = false;

        const W = this.scale.width;
        const H = this.scale.height;

        this.add.image(W / 2, H / 2, "background").setDisplaySize(W, H);

        // Ground
        this.groundTiles = this.add.tileSprite(W / 2, H - 40, W, 80, "ground");
        this.physics.add.existing(this.groundTiles, true);

        // Player
        this.player = this.physics.add.sprite(W * 0.18, H - 120, "player").setScale(2.0);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.groundTiles);

        // Waste group
        this.wasteGroup = this.add.group();

        // Score bar
        this.add.rectangle(W / 2, 22, W, 44, 0x1b4332).setOrigin(0.5);
        this.scoreText = this.add.text(16, 8, "Score: 0", {
          fontSize: "22px",
          color: "#ffffff",
        }).setDepth(10);

        // Controls hint
        this.add.text(W / 2, 8, "TAP / SPACE / ↑ to jump", {
          fontSize: "13px",
          color: "#95d5b2",
        }).setOrigin(0.5, 0).setDepth(10);

        // Keyboard
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // ✅ TOUCH: tap anywhere to jump
        this.input.on("pointerdown", () => {
          this.doJump();
        });

        // On-screen jump button for mobile
        this.jumpButton = this.add.text(W - 20, H - 20, "⬆ JUMP", {
          fontSize: "18px",
          color: "#ffffff",
          backgroundColor: "#2d6a4f",
          padding: { x: 14, y: 8 },
        }).setOrigin(1, 1).setDepth(20).setInteractive();

        this.jumpButton.on("pointerdown", () => this.doJump());

        // Restart button
        this.restartButton = this.add.text(W / 2, H * 0.58, "▶ Restart", {
          fontSize: "28px",
          color: "#ffffff",
          backgroundColor: "#2d6a4f",
          padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive().setVisible(false).setDepth(20);

        this.restartButton.on("pointerdown", () => this.scene.restart());
      }

      doJump() {
        if (this.gameOver) return;
        if (this.player.body.touching.down) {
          this.player.setVelocityY(-520);
        }
      }

      update(time: number) {
        if (this.gameOver) return;

        const W = this.scale.width;

        this.groundTiles.tilePositionX += 4;

        this.wasteGroup.getChildren().forEach((wasteObj: any) => {
          wasteObj.x -= 4;
          if (wasteObj.x < -50) {
            if (wasteObj.type === "recyclable") {
              this.score += 5;
              this.scoreText.setText("Score: " + this.score);
            }
            wasteObj.destroy();
          }
        });

        // Keyboard jump
        if ((this.cursors.up.isDown || this.spaceKey.isDown) && this.player.body.touching.down) {
          this.player.setVelocityY(-520);
        }

        if (time > this.nextWasteTime) {
          this.createWaste();
          this.nextWasteTime = time + Phaser.Math.Between(1200, 1800);
        }

        this.physics.world.overlap(this.player, this.wasteGroup, (playerObj, waste: any) => {
          if (waste.type === "non-recyclable") {
            this.endGame();
          } else {
            this.score += 10;
            this.scoreText.setText("Score: " + this.score);
            waste.destroy();
          }
        });
      }

      endGame() {
        this.gameOver = true;
        this.physics.pause();
        this.player.setTint(0xff0000);

        const W = this.scale.width;
        const H = this.scale.height;

        this.add.rectangle(W / 2, H / 2, W * 0.7, H * 0.35, 0x000000, 0.7)
          .setOrigin(0.5).setDepth(19);

        this.add.text(W / 2, H * 0.38, "GAME OVER", {
          fontSize: "36px",
          color: "#ff4444",
          fontStyle: "bold",
        }).setOrigin(0.5).setDepth(20);

        this.add.text(W / 2, H * 0.50, "Score: " + this.score, {
          fontSize: "26px",
          color: "#ffffff",
        }).setOrigin(0.5).setDepth(20);

        this.restartButton.setVisible(true);
      }

      createWaste() {
        const W = this.scale.width;
        const H = this.scale.height;
        const wasteType = Phaser.Math.RND.pick(["recyclable", "non-recyclable"]);
        const x = W + 50;
        const y = H - 100;
        let key: string;

        if (wasteType === "recyclable") {
          key = Phaser.Math.RND.pick(this.recyclableItems);
        } else {
          key = Phaser.Math.RND.pick(this.nonRecyclableItems);
        }

        const waste = this.add.image(x, y, key).setScale(0.1).setDepth(15);
        this.physics.add.existing(waste);
        (waste.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        (waste as any).type = wasteType;
        this.wasteGroup.add(waste);
      }
    }

    if (gameContainerRef.current && !gameRef.current) {
      // Get actual container dimensions for responsive sizing
      const container = gameContainerRef.current;
      const W = container.clientWidth || window.innerWidth;
      const H = Math.min(container.clientHeight || 500, window.innerHeight - 120);

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: W,
        height: H,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 600 } as Phaser.Types.Physics.Arcade.ArcadeWorldConfig["gravity"],
            debug: false,
          },
        },
        scene: MainScene,
        parent: gameContainerRef.current,
        backgroundColor: "#cceeff",
        // ✅ Scale to fit any screen size
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: W,
          height: H,
        },
      });
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full bg-sky-100 min-h-screen">
      {/* Title */}
      <div className="w-full bg-green-800 text-white text-center py-2 px-4">
        <h2 className="text-lg md:text-2xl font-bold">♻️ Eco Runner</h2>
        <p className="text-xs text-green-200 mt-0.5">
          Collect recyclables • Avoid non-recyclable waste • <strong>Tap screen or press ↑ / Space to jump</strong>
        </p>
      </div>

      {/* Game Container — fills available space */}
      <div
        ref={gameContainerRef}
        className="w-full flex-1"
        style={{
          height: "calc(100vh - 120px)",
          maxHeight: "600px",
          position: "relative",
          overflow: "hidden",
        }}
      />

      {/* Controls legend */}
      <div className="w-full bg-green-900 text-white text-center py-2 px-4 text-xs md:text-sm">
        <span className="mr-4">📱 <strong>Mobile:</strong> Tap screen to jump</span>
        <span>⌨️ <strong>Desktop:</strong> Arrow Up or Space to jump</span>
      </div>
    </div>
  );
};

export default EcoRunner;
