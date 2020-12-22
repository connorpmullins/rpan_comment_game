const defaultState = {
  eliminated: [],
  inPlay: false,
  teams: { red: 0, yellow: 0, green: 0, blue: 0 },
  previousComments: [],
  winner: undefined,
};

let lastGameComments = [];

class Game {
  constructor({ eliminationRound, checkForWinner, checkForElimination }) {
    this.state = {
      ...defaultState,
      teams: { ...defaultState.teams },
      previousComments: lastGameComments,
    };
    this.eliminationRound = eliminationRound; // bool
    this.checkForElimination = checkForElimination; // func
    this.checkForWinner = checkForWinner; // func

    this.loop = this.loop.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.getWinner = this.getWinner.bind(this);
  }

  getWinner() {
    return this.state.winner;
  }

  resetGame() {
    this.state = {
      ...defaultState,
      teams: { ...defaultState.teams },
      previousComments: lastGameComments,
    };
    console.log("Reseting Game: ", this.state);
  }

  eliminationCheck() {
    console.log("checking for elimination");
    this.state.eliminated = this.checkForElimination(this.state);
  }

  updateGame(comments) {
    for (let comment of comments) {
      this.state.teams[comment.body.toLowerCase()] += 1;

      // if this is an elimination game, check for elimination
      if (this.eliminationRound) {
        this.eliminationCheck();
      }

      // Check for win condition on each incremental vote
      this.state.winner = this.checkForWinner(this.state);

      // If there is a winner, exit this loop
      if (this.state.winner) {
        lastGameComments = [...this.state.previousComments];
        break;
      }
    }
  }

  findNewComments(comments) {
    const { previousComments } = this.state;
    return comments.filter(
      (comment) => !previousComments.map((c) => c.id).includes(comment.id)
    );
  }

  checkForTrolls(comments) {
    // If some user has made 10 of the last 30 comments, remove their
    // comments from newComments so they don't have an outsized influence
    return comments;
  }

  loop(comments) {
    // check if there is overlap between results & prevResults
    let newComments = this.findNewComments(comments);

    // Stop trolls from spamming
    newComments = this.checkForTrolls(newComments);

    if (newComments.length !== 0) {
      console.log("new comments: ", newComments);
      // for all new comments, update team scores && user interface
      this.updateGame(newComments);

      // Update 'PreviousComments'
      this.state.previousComments = this.state.previousComments.concat(
        newComments
      );
    }

    // remove old comments
    if (this.state.previousComments.length > 30) {
      console.log(
        "> 30 COMMENTS. new prevComments: ",
        this.state.previousComments.slice(
          this.state.previousComments.length - 30
        )
      );
      this.state.previousComments = this.state.previousComments.slice(
        this.state.previousComments.length - 30
      );
    }
  }
}

module.exports = { Game };
