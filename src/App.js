import {Component} from "react";
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

function EndGameUpdate(CurrentGame) {
  DisplayGameOverScreen({ ...CurrentGame.state });
  UpdateCumulativeScores(CurrentGame.state.winner);
}


const STREAM_ID = "ki7epx"; // YOUR STREAM ID

class App extends Component {
  constructor() {
    super();

    this.startGameLoop = this.startGameLoop.bind(this);
    this.executeGameLoop = this.executeGameLoop.bind(this);
    this.activeGameLoop = null;
    this.state = {
      gameMode: 0,
    };

    
    this.CHAT = new RPANChat({
      streamID: STREAM_ID,
      onConnect: this.startGameLoop
    });
    this.CURRENT_GAME_MODE = 1;
    this.CURRENT_ROUND = 1;

    this.ACTIVE_GAME = new Game(GAME_MODES[CURRENT_GAME_MODE]);
  }

  componentDidMount() {
    this.CHAT.connect();
  }

  executeGameLoop() {
   // If there's no winner, the game is ongoing
    if (this.ACTIVE_GAME && !this.ACTIVE_GAME.getWinner()) {
      // Execute Game Loop
      this.ACTIVE_GAME.loop(this.CHAT.getComments());
  
      // Update The User Interface after
      UpdateGameDisplay(this.ACTIVE_GAME.state);
    } else {
      // Game is over!
      EndGameUpdate(this.ACTIVE_GAME);
      this.ACTIVE_GAME.resetGame();
      this.startNewGame();
    }
  } 

  startGameLoop() {
    console.log('startingGameLoop');
    // Clear pre-game comments
    this.CHAT.clearComments();

    // Reset/Initialize UI (needs game mode uiProps)
    DisplayNewGameScreen(GAME_MODES[CURRENT_GAME_MODE]);

    // Start the GameLoop
    this.activeGameLoop = setInterval(() => {
      if (!this.ACTIVE_GAME || this.ACTIVE_GAME.getWinner()) {
        clearInterval(this.activeGameLoop);
      }
      this.executeGameLoop(this.ACTIVE_GAME);
    }, 1000);
  }

  startNewGame() {
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
  
      this.startGameLoop();
    }, 30000);
  }

  render() {
    return (
      <div className="App">
      <div className="Page-wrapper">
        <p className="App-header">
          <p>
            GAME UPDATES
          </p>
        </p>
        <p className="App-body">
          <p>
            {this.ACTIVE_GAME.state.winner}
          </p>
          <p>
            {Object.keys(this.ACTIVE_GAME.state.teams).map(team => (
              <p><p>{team}</p><p>{this.ACTIVE_GAME.state.teams[team]}</p></p>
            ))}
          </p>
          <p>
            {this.ACTIVE_GAME.state.eliminated}
          </p>
          <p>
            {this.ACTIVE_GAME.state.eliminated}
          </p>
        </p>
      </div>
      </div>
    );
  }
}

export default App;
