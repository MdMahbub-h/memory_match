class GamePage extends Phaser.Scene {
  constructor() {
    super({ key: "GamePage" });

    this.variables();
  }
  variables() {}
  create() {
    let self = this;
    const width = 2160;
    const height = 3840;
    this.addParticles(width, height);

    // Logo at top
    const logo = this.add.image(width / 2, height * 0.1, "logo");
    logo.setScale(0.6); // Adjust scale as needed

    let solvedTiles = [];
    let rectW = width * 0.85;
    let rectH = height * 0.66;
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRoundedRect(
      width / 2 - rectW / 2,
      height * 0.55 - rectH / 2,
      rectW,
      rectH,
      100
    );

    let local_cur_time = 0;
    let stage_data = { col: 4, row: 4, max: 0 };
    let cur_time = 0;
    const max_type = 7;
    let col = stage_data.col;
    let row = stage_data.row;
    let tile_scale = 0.25;
    let spaceX = width * 0.2;
    let spaceY = 600;
    let start_x = width * 0.2;
    let start_y = height * 0.32;
    let index = 0;
    let animate_flip_on_start = false; // Reveal tile on start
    let flip_count = 0;
    let max_timer = 360;
    if (cur_time == 0) {
      local_cur_time = max_timer;
    }
    let timer_delay = 300; //miliseconds
    let sub_timer = 1;
    let selected = [];
    let tiles = [];
    let arr = [];
    let state = "wait";
    let popup = this.add.group();
    for (let i = 0; i < (row * col) / 2; i++) {
      let rand = Math.floor(Math.random() * max_type);
      arr.push(rand);
    }
    arr = arr.concat(arr);
    arr = shuffle_array(arr);
    for (let y = 0; y < row; y++) {
      for (let x = 0; x < col; x++) {
        let tile = this.add.sprite(
          start_x + x * spaceX,
          start_y + y * spaceY,
          `option${arr[index]}`
        );
        tile.setInteractive();
        tile.name = "tile";
        tile.pos = {
          x: x,
          y: y,
        };
        tile.id = index;
        tile.setScale(tile_scale);
        let cardname = `cardBack${Phaser.Math.Between(1, 2)}`;
        tile.back = this.add.sprite(
          start_x + x * spaceX,
          start_y + y * spaceY,
          cardname
        );
        tile.back.setScale(tile_scale);
        tiles.push(tile);
        index++;
      }
    }
    if (animate_flip_on_start) {
      let total = tiles.length;
      index = 0;
      let interval = this.time.addEvent({
        delay: 200,
        repeat: total - 1,
        callback: () => {
          // play_sound("flip", self);
          let tile = get_tile(index);
          flip_tile(tile, "open");
          this.time.delayedCall(1000, () => {
            flip_tile(tile, "close");
            if (index >= total) {
              //state = 'ready';
              selected = [];
            }
          });
          index++;
        },
      });
    } else {
      state = "play";
    }
    // let progress = this.add.tileSprite(26, 1040, 668, 30, "progress");
    // progress.setOrigin(0, 0.5);
    // progress.scaleX = local_cur_time / max_timer;
    // Timer
    let timer_interval = this.time.addEvent({
      delay: timer_delay,
      loop: true,
      callback: () => {
        if (state == "play") {
          if (local_cur_time > 0) {
            local_cur_time -= sub_timer;
            cur_time = local_cur_time;
            if (local_cur_time < 0) {
              local_cur_time = 0;
            }
            // progress.scaleX = local_cur_time / max_timer;
          } else {
            gameover();
          }
        }
      },
    });
    this.input.on(
      "gameobjectdown",
      (pointer, obj) => {
        if (obj.name == "tile") {
          if (state == "play") {
            if (!obj.open) {
              // play_sound("flip", self);
              flip_tile(obj, "open");
            }
          }
        }
        if (obj.button) {
          // play_sound("click", self);
          self.tweens.add({
            targets: obj,
            scaleX: 0.95,
            scaleY: 0.95,
            yoyo: true,
            duration: 100,
            ease: "Linear",
            onComplete: function () {
              if (state === "play") {
                if (obj.name === "pause") {
                  paused();
                }
              } else {
                if (obj.name === "resume") {
                  state = "play";
                  popup.clear(true, true);
                }
              }
              if (obj.name === "sound") {
                switch_audio(obj);
              } else if (obj.name === "restart") {
                cur_level = 1;
                cur_time = 0;
                self.scene.restart();
              } else if (obj.name === "menu") {
                cur_level = 1;
                local_score = 0;
                cur_time = 0;
                self.scene.start("menu");
              }
            },
          });
        }
      },
      this
    );
    function flip_tile(obj, type) {
      let target1, target2;
      if (type == "open") {
        target1 = obj.back;
        target2 = obj;
        obj.open = true;
      } else {
        target1 = obj;
        target2 = obj.back;
      }
      target2.scaleX = 0;
      self.tweens.add({
        targets: target1,
        scaleX: 0,
        duration: 100,
        onComplete: () => {
          self.tweens.add({
            targets: target2,
            scaleX: tile_scale,
            duration: 100,
            onComplete: () => {
              obj.scaleX = tile_scale;
              if (type == "open") {
                if (state == "play") {
                  selected.push({ id: obj.id, frame: obj.texture.key });
                  if (selected.length == 2) {
                    check_match();
                  }
                }
              } else {
                obj.open = false;
                if (state == "wait") {
                  flip_count++;
                  if (flip_count == tiles.length) {
                    state = "play";
                  }
                }
              }
            },
          });
        },
      });
    }
    function check_match() {
      if (selected[0].frame == selected[1].frame) {
        remove_tile(selected[0]);
        remove_tile(selected[1]);
        //
        // play_sound("match", self);
        //
        selected = [];
        if (tiles.length == 0) {
          // Completed
          completed();
        }
      } else {
        flip_tile(get_tile(selected[0].id), "close");
        selected.shift();
      }
    }
    function get_tile(id) {
      let total = tiles.length;
      for (let i = 0; i < total; i++) {
        if (tiles[i].id == id) {
          return tiles[i];
        }
      }
    }
    function remove_tile(tile) {
      solvedTiles.push(tile);
      if (solvedTiles.length == 16) {
        self.scene.start("GameEndPage");
      }
      // let tile_obj = get_tile(tile.id);
      // for (let i = 0; i < tiles.length; i++) {
      //   if (tile.id == tiles[i].id) {
      //     animate_match(tile_obj);
      //     tile_obj.destroy(true, true);
      //     tiles.splice(i, 1);
      //     break;
      //   }
      // }
    }
    function shuffle_array(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }
    function animate_match(obj) {
      let _tile = self.add.sprite(obj.x, obj.y, "timeBack");
      _tile.setFrame(obj.frame.name);
      _tile.setScale(tile_scale);
      self.tweens.add({
        targets: _tile,
        rotation: Phaser.Math.DegToRad(500),
        scaleX: 0,
        scaleY: 0,
        duration: 400,
        onComplete: () => {
          _tile.destroy(true, true);
        },
      });
    }
    function paused() {
      state = "paused";
      let dark = self.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);
      dark.setInteractive();
      dark.alpha = 0;
      self.tweens.add({
        targets: dark,
        alpha: 0.5,
        duration: 200,
      });
      let win = self.add.sprite(360, 570, "popup");
      let paused = self.add.sprite(360, 285, "paused");
      let b_resume = draw_button(360, 530, "resume", self);
      let b_restart = draw_button(240, 740, "restart", self);
      let b_menu = draw_button(360, 740, "menu", self);
      // let b_sound = draw_button(480, 740, "sound_on", self);
      // check_audio(b_sound);
      popup.addMultiple([
        dark,
        win,
        paused,
        b_resume,
        b_restart,
        b_menu,
        b_sound,
      ]);
    }
    function gameover() {
      state = "gameover";
      let dark = self.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);
      dark.setInteractive();
      dark.alpha = 0;
      self.tweens.add({
        targets: dark,
        alpha: 0.5,
        duration: 200,
      });
      let win = self.add.sprite(360, 570, "popup");
      let gameover = self.add.sprite(360, 285, "gameover");
      let score_bar = self.add.sprite(360, 475, "score_bar");
      let best_bar = self.add.sprite(347, 625, "best_bar");

      let b_restart = draw_button(240, 760, "restart", self);
      let b_menu = draw_button(360, 760, "menu", self);
      // let b_sound = draw_button(480, 760, "sound_on", self);
      // check_audio(b_sound);
    }
    function completed() {
      // play_sound("completed", self);
      state = "completed";
      self.time.delayedCall(400, () => {
        cur_level++;
        self.scene.restart();
      });
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

  update() {}
}

export default GamePage;
