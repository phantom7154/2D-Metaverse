import Phaser from "phaser";
import { io } from "socket.io-client";

const username = localStorage.getItem("username") || "Player";


export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.players = {};
    this.localPlayerId = null;
  }

  init(data) {
    this.username = data.username || "Player";
  }

  preload() {
    this.load.image("player", "/player.png");
  }

  create() {
    this.socket = io("http://localhost:3000");
    this.cursors = this.input.keyboard.createCursorKeys();

    this.otherPlayers = this.add.group();

    this.socket.on("connect", () => {
      this.localPlayerId = this.socket.id;
      this.socket.emit("setName", this.username);
    });

    this.socket.on("currentPlayers", (players) => {
      Object.values(players).forEach((player) => {
        this.addPlayer(player);
      });
    });

    this.socket.on("newPlayer", (player) => {
      this.addPlayer(player);
    });

    this.socket.on("playerMoved", (player) => {
      const p = this.players[player.id];
      if (p) {
        p.sprite.setPosition(player.x, player.y);
        p.nameText.setPosition(player.x, player.y - 40);
      }
    });

    this.socket.on("playerDisconnected", (id) => {
      if (this.players[id]) {
        this.players[id].sprite.destroy();
        this.players[id].nameText.destroy();
        delete this.players[id];
      }
    });
  }

  addPlayer(player) {
    if (this.players[player.id]) return;

    const sprite = this.add.sprite(player.x, player.y, "player");
    sprite.setScale(0.4);

    // Add name text above sprite
    const nameText = this.add.text(player.x, player.y - 40, player.name, {
      font: "16px Arial",
      fill: "#ffffff",
      align: "center",
    }).setOrigin(0.5);

    this.players[player.id] = {
      sprite,
      nameText,
    };

    if (player.id === this.localPlayerId) {
      this.localPlayer = sprite;
    }
  }

  update() {
    if (!this.localPlayer) return;

    let moved = false;

    if (this.cursors.left.isDown) {
      this.localPlayer.x -= 2;
      moved = true;
    } else if (this.cursors.right.isDown) {
      this.localPlayer.x += 2;
      moved = true;
    }

    if (this.cursors.up.isDown) {
      this.localPlayer.y -= 2;
      moved = true;
    } else if (this.cursors.down.isDown) {
      this.localPlayer.y += 2;
      moved = true;
    }

    // Move name text along with sprite
    const id = this.socket.id;
    if (this.players[id]) {
      this.players[id].nameText.setPosition(
        this.localPlayer.x,
        this.localPlayer.y - 40
      );
    }

    if (moved) {
      this.socket.emit("move", {
        x: this.localPlayer.x,
        y: this.localPlayer.y,
      });
    }
  }
}
