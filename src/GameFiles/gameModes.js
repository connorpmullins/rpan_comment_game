// We'll need a better way to access these variables
let CURRENT_ROUND = 1;
let CURRENT_GAME_MODE = 1;


const GAME_MODES = [
  {
    eliminationRound: false,
    checkForWinner: function({ teams }) {
      // Arbitrary example of how games get longer w/each round
      const WINNING_SCORE = 20 * CURRENT_ROUND;
      // Winning Team or undefined
      return Object.keys(teams).find((team) => teams[team] >= WINNING_SCORE);
    },
    uiProps: {
      gameMode: "FIRST TO THE FINISH LINE",
      description: "The first team to reach the target number of votes wins!",
      target: 20 * CURRENT_ROUND,
    },
  },
  {
    eliminationRound: true,
    checkForElimination: function({ teams }) {
      console.log(
        "checking for Elimination. ",
        teams,
        Object.keys(teams).filter((team) => teams[team] >= 20 * CURRENT_ROUND),
        20 * CURRENT_ROUND
      );
      // Eliminated Teams: ["red", "blue"]
      return Object.keys(teams).filter(
        (team) => teams[team] >= 20 * CURRENT_ROUND
      );
    },
    checkForWinner: function({ eliminated, teams }) {
      // If only one team hasn't been eliminated
      if (eliminated.length === Object.keys(teams).length - 1) {
        // return the team not in eliminated
        return Object.keys(teams).find((team) => !eliminated.includes(team));
      }
      return undefined;
    },
    uiProps: {
      gameMode: "STAY ALIVE!!",
      description: `The Last Team to recieve ${20 * CURRENT_ROUND} votes wins!`,
      target: 20 * CURRENT_ROUND,
    },
  },
  // {
  //   eliminationRound: true,
  //   checkForWinner: function(gameState) {
  //     return undefined;
  //   },
  //   uiProps: {
  //     gameMode: "Don't Fall Behind",
  //     description:
  //       "Elimination - if your team falls behind by more than 15 percent (for certain amount of tine) it gets knocked out (last man standing)",
  //     target: 20 * CURRENT_ROUND,
  //   },
  // },
  // {
  //   eliminationRound: false,
  //   checkForWinner: (gameState) => {
  //     return undefined;
  //   },
  //   uiProps: {
  //     gameMode: "First to the Finish Line",
  //     description: "The first team to reach the target number of votes wins!",
  //     target: 20 * CURRENT_ROUND,
  //   },
  // },
];

export {CURRENT_ROUND, CURRENT_GAME_MODE, GAME_MODES};