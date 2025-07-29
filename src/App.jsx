import { useState, useEffect } from "react";
import Game from "./game/Game";

function App() {
  const [username, setUsername] = useState("");
  const [gameReady, setGameReady] = useState(false);

  const startGame = () => {
    if (username.trim() !== "") {
      setGameReady(true);
    }
  };

  return (
    <div>
      <h1>2D Metaverse</h1>
      {!gameReady ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={startGame}>Join Game</button>
        </div>
      ) : (
        <Game username={username} />
      )}
    </div>
  );
}

export default App;
