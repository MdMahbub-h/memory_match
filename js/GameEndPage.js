class GameEndPage extends Phaser.Scene {
  constructor() {
    super({ key: "GameEndPage" });
  }

  init(data) {
    this.win = data.win || false;
    this.mismatches = data.mismatches || 0;
  }

  create() {
    const width = 2160;
    const height = 3840;
    this.addParticles(width, height);

    // Logo at top with fade-in animation
    const logo = this.add.image(width / 2, height * 0.1, "logo");
    logo.setScale(0.6);
    logo.alpha = 0;
    this.tweens.add({
      targets: logo,
      alpha: 1,
      duration: 1000,
      ease: "Power2",
    });

    // Eye-catching popup with scale-in animation
    // const popupGraphics = this.add.graphics();
    // popupGraphics.fillStyle(0xffffff, 1);
    // popupGraphics.fillRoundedRect(
    //   width / 2 - 800,
    //   height * 0.3,
    //   1600,
    //   1200,
    //   100
    // );
    // popupGraphics.alpha = 0;
    // popupGraphics.scaleX = 0.5;
    // popupGraphics.scaleY = 0.5;
    // this.tweens.add({
    //   targets: popupGraphics,
    //   alpha: 1,
    //   scaleX: 1,
    //   scaleY: 1,
    //   duration: 800,
    //   ease: "Back.easeOut",
    //   delay: 500,
    // });

    // Win/Lose text with bounce animation
    const resultText = this.add.text(
      width / 2,
      height * 0.45,
      this.win ? "You Win!" : "You Lose!",
      {
        fontFamily: "font2",
        fontSize: "280px",
        fontStyle: "bold",
        color: "#ffffff",
      }
    );
    resultText.setOrigin(0.5);
    resultText.alpha = 0;
    resultText.scaleX = 0.5;
    resultText.scaleY = 0.5;
    this.tweens.add({
      targets: resultText,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: "Bounce.easeOut",
      delay: 1000,
    });

    // Matching Pairs
    // const matchingPairsText = this.add.text(
    //   width / 2,
    //   height * 0.55,
    //   `Matching Pairs: ${8 - this.mismatches}`,
    //   {
    //     fontFamily: "font2",
    //     fontSize: "80px",
    //     color: "#072447",
    //   }
    // );
    // matchingPairsText.setOrigin(0.5);
    // matchingPairsText.alpha = 0;
    // this.tweens.add({
    //   targets: matchingPairsText,
    //   alpha: 1,
    //   duration: 500,
    //   delay: 1200,
    // });

    // Attempts Left
    const attemptsLeft = Math.max(0, 5 - this.mismatches);
    const attemptsText = this.add.text(
      width / 2,
      height * 0.65,
      `Attempts Left: ${attemptsLeft}`,
      {
        fontFamily: "font2",
        fontSize: "80px",
        color: "#072447",
      }
    );
    attemptsText.setOrigin(0.5);
    attemptsText.alpha = 0;
    this.tweens.add({
      targets: attemptsText,
      alpha: 1,
      duration: 500,
      delay: 1400,
    });

    // Buttons with hover effects
    const restartButton = this.add.text(width / 2, height * 0.73, "Restart", {
      fontFamily: "font2",
      fontSize: "140px",
      color: "#ffffffff",
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.alpha = 0;
    this.tweens.add({
      targets: restartButton,
      alpha: 1,
      duration: 500,
      delay: 1600,
    });
    restartButton.on("pointerover", () => {
      restartButton.setScale(1.1);
    });
    restartButton.on("pointerout", () => {
      restartButton.setScale(1);
    });
    restartButton.on("pointerdown", () => {
      this.scene.start("GamePage");
    });

    const menuButton = this.add.text(width / 2, height * 0.8, "Menu", {
      fontFamily: "font2",
      fontSize: "140px",
      color: "#ffffff",
    });
    menuButton.setOrigin(0.5);
    menuButton.setInteractive();
    menuButton.alpha = 0;
    this.tweens.add({
      targets: menuButton,
      alpha: 1,
      duration: 500,
      delay: 1600,
    });
    menuButton.on("pointerover", () => {
      menuButton.setScale(1.1);
    });
    menuButton.on("pointerout", () => {
      menuButton.setScale(1);
    });
    menuButton.on("pointerdown", () => {
      this.scene.start("HomePage");
    });

    // Play congrats sound on win
    if (this.win) {
      this.sound.play("congrats");
      // Add particle burst for win
      this.addWinParticles(width / 2, height * 0.45);
      setTimeout(() => {
        this.addWinParticles(width / 2, height * 0.45);
      }, 500);
    }

    this.footer(width, height);
  }
  addParticles(width, height) {
    this.cameras.main.setBackgroundColor("#072447");
    for (let i = 0; i < 100; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(0xffffff, 0.5);
      const size = Phaser.Math.Between(8, 15);
      const shapeType = Phaser.Math.Between(0, 5); // 0: circle, 1: square, 2: triangle, 3: diamond, 4: star, 5: hexagon
      if (shapeType === 0) {
        particle.fillCircle(0, 0, size);
      } else if (shapeType === 1) {
        particle.fillRect(-size, -size, size * 2, size * 2);
      } else if (shapeType === 2) {
        particle.beginPath();
        particle.moveTo(0, -size);
        particle.lineTo(-size, size);
        particle.lineTo(size, size);
        particle.closePath();
        particle.fillPath();
      } else if (shapeType === 3) {
        // Diamond
        particle.beginPath();
        particle.moveTo(0, -size);
        particle.lineTo(size, 0);
        particle.lineTo(0, size);
        particle.lineTo(-size, 0);
        particle.closePath();
        particle.fillPath();
      } else if (shapeType === 4) {
        // Star
        particle.beginPath();
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.5;
        for (let j = 0; j < spikes * 2; j++) {
          const angle = (j * Math.PI) / spikes;
          const radius = j % 2 === 0 ? outerRadius : innerRadius;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (j === 0) particle.moveTo(x, y);
          else particle.lineTo(x, y);
        }
        particle.closePath();
        particle.fillPath();
      } else if (shapeType === 5) {
        // Hexagon
        particle.beginPath();
        for (let j = 0; j < 6; j++) {
          const angle = (j * Math.PI) / 3;
          const x = Math.cos(angle) * size;
          const y = Math.sin(angle) * size;
          if (j === 0) particle.moveTo(x, y);
          else particle.lineTo(x, y);
        }
        particle.closePath();
        particle.fillPath();
      }
      particle.setPosition(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height)
      );

      // Spreading light effect: fade in/out and scale
      this.tweens.add({
        targets: particle,
        alpha: 0.5,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: Phaser.Math.Between(1000, 3000),
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });

      const moveParticle = () => {
        const targetX = Phaser.Math.Between(0, width);
        const targetY = Phaser.Math.Between(0, height);
        this.tweens.add({
          targets: particle,
          x: targetX,
          y: targetY,
          duration: Phaser.Math.Between(19000, 20000),
          ease: "Sine.easeInOut",
          onComplete: moveParticle,
        });
      };
      moveParticle();
    }
  }

  addWinParticles(x, y) {
    for (let i = 0; i < 100; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(0xffd700, 1); // Gold color for win
      particle.fillCircle(0, 0, Phaser.Math.Between(45, 56));
      particle.setPosition(x, y);

      // Burst effect
      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-700, 700),
        y: y + Phaser.Math.Between(-700, 700),
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 5000,
        ease: "Power2",
        delay: Phaser.Math.Between(0, 500),
        onComplete: () => {
          particle.destroy();
        },
      });
    }
  }

  footer(width, height) {
    // Watermark at bottom
    const developedByText = this.add.text(
      width / 2 - 250,
      height * 0.96,
      "Developed By",
      {
        fontFamily: "font2",
        fontSize: "70px",
        fontStyle: "bold",
        color: "#ffffff",
      }
    );
    developedByText.setOrigin(0.5);

    const footprintLogo = this.add.image(
      width / 2 + 250,
      height * 0.96,
      "footprintLogo"
    );
    footprintLogo.setScale(0.35);
  }
}

export default GameEndPage;
