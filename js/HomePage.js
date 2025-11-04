class HomePage extends Phaser.Scene {
  constructor() {
    super({ key: "HomePage" });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.scene.start("GamePage");
    // Background color

    this.addParticles(width, height);

    // Logo at top
    const logo = this.add.image(width / 2, height * 0.2, "logo");
    logo.setScale(1); // Adjust scale as needed

    // Circular Start button in middle
    const buttonRadius = 300;
    const buttonX = width / 2;
    const buttonY = height / 1.9;

    const startBtn = this.add
      .image(buttonX, buttonY, "playBtn")
      .setOrigin(0.5)
      .setScale(0.45)
      .setInteractive({ useHandCursor: true });

    // Animation around circle
    const outerCircle = this.add.graphics();
    outerCircle.lineStyle(15, 0xffffff, 1);
    outerCircle.strokeCircle(buttonX, buttonY, buttonRadius + 20);

    this.tweens.add({
      targets: outerCircle,
      scaleX: 1.01,
      scaleY: 1.01,
      alpha: 0,
      duration: 1000,
      repeat: -1,
      yoyo: true,
    });

    startBtn.on("pointerdown", () => {
      this.tweens.add({
        targets: startBtn,
        scale: 0.42,
        duration: 100,
        yoyo: true,
        ease: "Power1",
        onComplete: () => {
          this.scene.start("GamePage");
        },
      });
    });

    // Two 3D cards below button

    const card1 = this.add.image(width / 2 - 350, height * 0.8, "cardBack1");
    card1.setScale(0.35); // Decreased size
    card1.setAngle(-100); // Slight tilt for 3D effect

    const card2 = this.add.image(width / 2 + 350, height * 0.8, "cardBack2");
    card2.setScale(0.35); // Decreased size
    card2.setAngle(280); // Slight tilt for 3D effect

    // Watermark at bottom
    const developedByText = this.add.text(
      width / 2,
      height * 0.92,
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
      width / 2,
      height * 0.96,
      "footprintLogo"
    );
    footprintLogo.setScale(0.35);

    // Background animation - larger moving particles like spreading light
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
        alpha: 0.1,
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
          duration: Phaser.Math.Between(3000, 6000),
          ease: "Sine.easeInOut",
          onComplete: moveParticle,
        });
      };
      moveParticle();
    }
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
}

export default HomePage;
