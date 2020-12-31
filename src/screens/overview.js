const OverviewScreen = ({ gameMode, previousWinner, round, totalWins }) => (
  <div>
    <div className="App-header">
      <p>Overview</p>
    </div>
    {Boolean(previousWinner) && (
      <div className="App-body">
        <p>Winner: {previousWinner}</p>
      </div>
    )}
    <div className="App-body">
      <p>Round: {round}</p>
    </div>
    <div className="App-body">
      <p>Game Mode: {gameMode}</p>
    </div>
    <div className="App-body">
      <p>Total Wins:</p>
      {Object.keys(totalWins).map((team) => (
        <p key={team}>
          {team}: {totalWins[team]}
        </p>
      ))}
    </div>
  </div>
);

export default OverviewScreen;
