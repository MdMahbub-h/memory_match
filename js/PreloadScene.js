class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
    this.width = 2160;
    this.height = 3840;
  }

  preload() {
    // Load images
    this.load.image("logo", "assets/images/logo.png");
    this.load.image("cardBack1", "assets/images/cardBack1.png");
    this.load.image("cardBack2", "assets/images/cardBack2.png");
    this.load.image("footprintLogo", "assets/images/footprintLogo.png");
    this.load.image("playBtn", "assets/images/playBtn.png");
    this.load.image("option0", "assets/images/option0.png");
    this.load.image("option1", "assets/images/option1.png");
    this.load.image("option2", "assets/images/option2.png");
    this.load.image("option3", "assets/images/option3.png");
    this.load.image("option4", "assets/images/option4.png");
    this.load.image("option5", "assets/images/option5.png");
    this.load.image("option6", "assets/images/option6.png");

    // Load sounds
    this.load.audio("bgaudio", "assets/sounds/bgaudio.mp3");
    this.load.audio("congrats", "assets/sounds/congrats.mp3");

    // Loading bar or progress
    // const progressBar = this.add.graphics();
    // const progressBox = this.add.graphics();
    // progressBox.fillStyle(0x222222, 0.8);
    // progressBox.fillRect(
    //   this.width / 2 - this.width * 0.4,
    //   this.height / 1.9,
    //   this.width * 0.8,
    //   100
    // );

    // const width = this.width;
    // const height = this.height;
    // const loadingText = this.make.text({
    //   x: width / 2,
    //   y: height / 2 - 50,
    //   text: "Loading...",
    //   style: {
    //     font: "50px monospace",
    //     fill: "#ffffff",
    //   },
    // });
    // loadingText.setOrigin(0.5, 0.5);

    // const percentText = this.make.text({
    //   x: width / 2,
    //   y: height / 2 + 20,
    //   text: "0%",
    //   style: {
    //     font: "50px monospace",
    //     fill: "#ffffff",
    //   },
    // });
    // percentText.setOrigin(0.5, 0.5);

    // this.load.on("progress", (value) => {
    //   percentText.setText(parseInt(value * 100) + "%");
    //   progressBar.clear();
    //   progressBar.fillStyle(0xffffff, 1);
    //   progressBar.fillRect(
    //     this.width / 2 - this.width * 0.4 + 20,
    //     this.height / 1.9 + 10,
    //     this.width * 0.8 * value - 40,
    //     80
    //   );
    // });

    // this.load.on("complete", () => {
    //   progressBar.destroy();
    //   progressBox.destroy();
    //   loadingText.destroy();
    //   percentText.destroy();
    // });
  }

  create() {
    this.scene.start("HomePage");
  }
}

export default PreloadScene;
