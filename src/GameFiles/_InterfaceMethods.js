/* This file should be deleted */

// const wins = {};

const UpdateGameDisplay = ({ eliminated, teams, winner }) => {
  // Update UI to reflect new game state
  console.log("GAME UPDATE", { teams, eliminated, winner });
};

const UpdateCumulativeScores = (winner) => {
  // update cumulative wins
  // (need to track w/ a global var)
  console.log(`${winner} won the previous game!!!!!!!!!!!!!!!!`);
  console.log("(and everyone else lost)");
};

const DisplayNewGameScreen = ({ eliminationRound, uiProps }) => {
  // gets UI props
  console.warn("STARTING NEW GAME: ", uiProps, eliminationRound);
};

const DisplayGameOverScreen = (gameState) => {
  console.log("GAME OVER", gameState);
  // update screen to show
  // "Winner: Blue"
  // "Results: ...results"
  // "New Game Will begin in 30 seconds"
  // "Instructions: Comment the team name you want to win in all caps with no space. ex: BLUE"
};

export {
  DisplayGameOverScreen,
  DisplayNewGameScreen,
  UpdateCumulativeScores,
  UpdateGameDisplay,
};
