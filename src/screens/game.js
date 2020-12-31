const GameScreen = ({ gameState: { eliminated, teams, winner }, gameInfo: {title, description} }) => (
  <div>
    <div className="App-header">
      <p>{title}</p>
      <p>{description}</p>
    </div>
    <div className="App-body">
      {Boolean(eliminated && eliminated.length) && (<p>eliminated: {eliminated}</p>)}
      <div>
        teams:{" "}
        {Object.keys(teams).map((team) => (
          <p key={team}>
            {team}: {teams[team]}
          </p>
        ))}
      </div>
    </div>
  </div>
);
export default GameScreen;
