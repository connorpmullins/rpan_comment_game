const GAME_MODES = round => ([
  {
    eliminationRound: false,
    checkForWinner: function({ teams }) {
      // Arbitrary example of how games get longer w/each round
      const WINNING_SCORE = 10 * round;
      // Winning Team or undefined
      return Object.keys(teams).find((team) => teams[team] >= WINNING_SCORE);
    },
    uiProps: {
      title: "FIRST TO THE FINISH LINE",
      description: `The first team to reach ${10 * round} votes wins!`,
    },
  },
  {
    eliminationRound: true,
    // Eliminated Teams: ["red", "blue"]
    checkForElimination: function({ teams }) {
      return Object.keys(teams).filter(
        (team) => teams[team] >= 10 * round
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
      title: "STAY ALIVE!!",
      description: `The Last Team to recieve ${10 * round} votes wins!`,
    },
  },
  // {
  //   eliminationRound: true,
  //   checkForWinner: function(gameState) {
  //     return undefined;
  //   },
  //   uiProps: {
  //     title: "Don't Fall Behind",
  //     description:
  //       "Elimination - if your team falls behind by more than 15 percent (for certain amount of tine) it gets knocked out (last man standing)",
  //   },
  // },
  // {
  //   eliminationRound: false,
  //   checkForWinner: (gameState) => {
  //     return undefined;
  //   },
  //   uiProps: {
  //     title: "First to the Finish Line",
  //     description: "The first team to reach the target number of votes wins!",
  //   },
  // },
]);

export default GAME_MODES;