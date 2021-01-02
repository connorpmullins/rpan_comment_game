const Card = ({ title, children }) => (
  <div className="Overview-card">
    <h4 style={{ "text-align": "center" }}>{title}</h4>
    {children}
  </div>
);

const Info = ({ title, children }) => (
  <span className="Overview-info">
    <strong>{title}</strong>
    {children}
  </span>
);

const OverviewScreen = ({ gameMode, previousWinner, round, totalWins }) => (
  <div>
    {Boolean(previousWinner) && (
      <Card title="Previous Game">
        <Info title="Winner: ">{previousWinner.toUpperCase()}</Info>
        <Info title="MVPs: ">
          TO-DO (display MVP for each team or overall MVP)
        </Info>
      </Card>
    )}
    <Card title="Overview">
      <Info title="Round: ">{round}</Info>
      <Info title="Next Game Mode: ">{gameMode}</Info>
      <Info title="Total Wins: ">
        {Object.keys(totalWins).map((team) => (
          <span key={team}>
            {team}: {totalWins[team] + " "}
          </span>
        ))}
      </Info>
    </Card>
    <Card title="Info">
      <Info title="About: ">
          This is a work-in-progress game that allows you to vote for the team you
          want to win through comments. It cycles game modes, increasing the round
          every time we go through every mode. Every round requires more votes to
          win.
      </Info>
      <br/>
      <Info title="Contribute: ">
        If you want to help make this better shoot me a message!
      </Info>
      <br/>
      <Info title="Code: ">
        https://github.com/connorpmullins/rpan_comment_game
      </Info>
      <br/>
      <Info title="P.S. ">
        I'm looking for a React/React Native developer role in the Bay Area if 
        your team is hiring: connorpmullins@gmail.com
      </Info>
    </Card>
  </div>
);

export default OverviewScreen;
