import {useEffect, useState} from "react";
import logo from './logo.svg';
import './App.css';

import RPANChat from "./GameFiles/_Client.js";
import { CURRENT_GAME_MODE, CURRENT_ROUND, GAME_MODES } from "./GameFiles/gameModes.js";
import Game from "./GameFiles/_Game.js";
import {
  DisplayGameOverScreen,
  DisplayNewGameScreen,
  UpdateCumulativeScores,
  UpdateGameDisplay,
} from "./GameFiles/_InterfaceMethods";


const STREAM_ID = "kgubmm"; // YOUR STREAM ID
const CHAT = new RPANChat({
  streamID: STREAM_ID,
  userAgent: "Test app for privateUse",
});

function BeginNewGame() {
  // After 100s (decrease to 30)
  setTimeout(() => {
    // Change Game Mode
    if (CURRENT_GAME_MODE !== GAME_MODES.length - 1) {
      CURRENT_GAME_MODE += 1;
    } else {
      // If we've gone through all modes, increment round, reset mode
      CURRENT_GAME_MODE = 0;
      // eslint-disable-next-line no-unused-vars
      CURRENT_ROUND += 1;
    }

    // Start a New Game
    console.log(StartGameLoop);

    StartGameLoop();
  }, 30000);
}

function EndGameUpdate(CurrentGame) {
  DisplayGameOverScreen({ ...CurrentGame.state });
  UpdateCumulativeScores(CurrentGame.state.winner);
}

function GameLoop(CurrentGame) {
  // If there's no winner, the game is ongoing
  if (CurrentGame && !CurrentGame.getWinner()) {
    // Execute Game Loop
    CurrentGame.loop(CHAT.getComments());

    // Update The User Interface after
    UpdateGameDisplay(CurrentGame.state);
  } else {
    // Game is over!
    EndGameUpdate(CurrentGame);
    CurrentGame.resetGame();
    BeginNewGame();
  }
}

function StartGameLoop() {
  // Initialize new Active Game
  let ACTIVE_GAME = new Game(GAME_MODES[CURRENT_GAME_MODE]);

  // Clear pre-game comments
  CHAT.clearComments();

  // Reset/Initialize UI (needs game mode uiProps)
  DisplayNewGameScreen(GAME_MODES[CURRENT_GAME_MODE]);

  // Start the GameLoop
  const CurrentGameLoop = setInterval(function() {
    if (!ACTIVE_GAME || ACTIVE_GAME.getWinner()) {
      clearInterval(CurrentGameLoop);
    }
    GameLoop(ACTIVE_GAME);
  }, 1000);
}

// function Initialize() {
//   CHAT.connect();
//   StartGameLoop();
// }

function App() {
  const [gameMode, setGameMode] = useState(0);
  useEffect(() => {
    CHAT.connect();
    // TODO
    // Only start game loop once chat connects
    // If CHAT.connect fails, retry X times
    StartGameLoop();
  }, [])
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
