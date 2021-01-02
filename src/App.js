import { Component } from "react";
import "./App.css";

import RPANChat from "./GameFiles/_Client.js";
import GAME_MODES from "./GameFiles/gameModes.js";
import Game from "./GameFiles/_Game.js";
import { OverviewScreen, GameScreen } from "./screens";

const STREAM_ID = "kp25ax"; // YOUR STREAM ID

class App extends Component {
  constructor() {
    super();

    this.startGameLoop = this.startGameLoop.bind(this);
    this.executeGameLoop = this.executeGameLoop.bind(this);
    this.activeGameLoop = null;
    this.state = {
      gameInProgress: false,
      gameMode: 0,
      gameState: { teams: {} },
      gamesWon: { red: 0, yellow: 0, green: 0, blue: 0 },
      previousWinner: "",
      round: 1,
    };

    this.GAME_MODE = GAME_MODES(this.state.round)[this.state.gameMode];
    this.CHAT = new RPANChat({
      streamID: STREAM_ID,
      onConnect: this.startGameLoop,
    });
    this.ACTIVE_GAME = new Game(this.GAME_MODE);
  }

  componentDidMount() {
    this.CHAT.connect();
  }

  gameOver() {
    const { winner } = this.ACTIVE_GAME.state;
    const { gameMode, gamesWon, round } = this.state;
    let nextGameMode, nextRound;

    // Change Game Mode
    if (gameMode !== GAME_MODES(this.state.round).length - 1) {
      nextGameMode = gameMode + 1;
      nextRound = round;
    } else {
      nextGameMode = 0;
      nextRound = round + 1;
    }

    this.setState({
      gameInProgress: false,
      gameMode: nextGameMode,
      gameState: { teams: {} },
      gamesWon: { ...gamesWon, [winner]: gamesWon[winner] + 1 },
      previousWinner: winner,
      round: nextRound,
    });

    // After 15s
    setTimeout(() => {
      this.startNewGame();
    }, 15000);
  }

  executeGameLoop() {
    // If there's no winner, the game is ongoing
    if (this.ACTIVE_GAME && !this.ACTIVE_GAME.getWinner()) {
      // Execute Game Loop
      this.ACTIVE_GAME.loop(this.CHAT.getComments());
      // Update The User Interface (by tracking gameState)
      this.setState({ gameState: this.ACTIVE_GAME.state });
    } else {
      this.gameOver();
    }
  }

  startGameLoop() {
    // Clear pre-game comments
    this.CHAT.clearComments();

    // Reset/Initialize UI (needs game mode uiProps)
    this.setState({ gameInProgress: true });

    // Start the GameLoop
    this.activeGameLoop = setInterval(() => {
      if (!this.ACTIVE_GAME || this.ACTIVE_GAME.getWinner()) {
        clearInterval(this.activeGameLoop);
      }
      this.executeGameLoop(this.ACTIVE_GAME);
    }, 1000);
  }

  startNewGame() {
    const {gameMode, round} = this.state;
    this.GAME_MODE = GAME_MODES(round)[gameMode];
    console.log(
      "starting new game. round: ",
      round,
      "game mode: ",
      gameMode,
      " game mode: ",
      this.GAME_MODE
    );
    this.ACTIVE_GAME = new Game(this.GAME_MODE);
    this.startGameLoop();
  }

  render() {
    return (
      <div className="App">
        <div className="Page-wrapper">
          {this.state.gameInProgress ? (
            <GameScreen gameState={this.state.gameState} gameInfo={this.GAME_MODE.uiProps}/>
          ) : (
            <OverviewScreen
              previousWinner={this.state.previousWinner}
              totalWins={this.state.gamesWon}
              round={this.state.round}
              gameMode={this.GAME_MODE.uiProps.title}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
