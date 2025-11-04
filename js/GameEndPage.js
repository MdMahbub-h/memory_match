class GameEndPage extends Phaser.Scene {
  constructor() {
    super({ key: "GameEndPage" });
  }

  init(data) {}

  create() {
    this.addParticles();
    this.footer();
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
