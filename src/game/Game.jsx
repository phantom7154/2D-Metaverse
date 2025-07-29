import { useEffect } from "react";
import Phaser from "phaser";
import MainScene from "./MainScene";

export default function Game({ username }) {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 1500,
      height: 600,
      parent: "phaser-container",
      scene: [MainScene], // use class directly
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 }, debug: false },
      },
    };

    const game = new Phaser.Game(config);

    // Delay scene start to pass data
    game.scene.start("MainScene", { username });

    return () => game.destroy(true);
  }, [username]);

  return <div id="phaser-container"></div>;
}
