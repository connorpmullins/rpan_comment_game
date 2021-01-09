import snoos from "../GameFiles/snoos";

const progressStyle = {
  "align-items": "flex-end",
  display: "flex",
  "flex-direction": "row",
  "justify-content": "center",
  width: "100%",
};

const GameScreen = ({
  gameState: { eliminated, teams, winner },
  gameInfo: { title, description, target },
}) => (
  <div>
    <div className="Game-header">
      <div className="Game-info">
        <strong>Game Mode: </strong> {title}
      </div>
      <div className="Game-info">
        <strong>Description: </strong> {description}
      </div>
      <div className="Game-info">
        <strong>How to play: </strong> Comment red, green, blue, or yellow to
        cast a vote
      </div>
    </div>
    <div className="App-body">
      {Boolean(eliminated && eliminated.length) && (
        <p>Eliminated: {eliminated.join(", ")}</p>
      )}
      <div className="Team-scores">
        {Object.keys(teams).map((team) => {
          const isEliminated = eliminated && eliminated.includes(team);
          const style = {
            ...progressStyle,
            backgroundColor: isEliminated ? "gray" : team,
            height: `${(teams[team] / target) * 100}%`,
          };
          return (
            <div className="Team-score">
              <div className="Score-wrapper" key={team}>
                <div style={style}>
                  <p style={team === "yellow" ? { color: "blue" } : {}}>
                    {teams[team]}
                  </p>
                </div>
              </div>
              <img src={snoos[team]} alt="team mascot" className="Mascot" />
              <span>{team}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
export default GameScreen;
