import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Result.css";

export default function Result() {
  const navigate = useNavigate();
  const [winner, setWinner] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [scores, setScores] = useState({ p1: 0, p2: 0 });

  useEffect(() => {
    const p1 = localStorage.getItem("player1");
    const p2 = localStorage.getItem("player2");
    const sc = JSON.parse(localStorage.getItem("scores"));
    setPlayer1(p1);
    setPlayer2(p2);
    setScores(sc);

    if (sc.p1 > sc.p2) setWinner(p1);
    else if (sc.p2 > sc.p1) setWinner(p2);
    else setWinner("Tie");
  }, []);

  const handleRestart = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="result-container">
      <div className="result-card">
        <h1 className="result-title">🏁 Quiz Results</h1>

        {winner === "Tie" ? (
          <h2 className="tie-text">🤝 It’s a Tie!</h2>
        ) : (
          <h2 className="winner-text">🏆 {winner} Wins!</h2>
        )}

        <div className="scoreboard">
          <div className={`score-box ${winner === player1 ? "highlight" : ""}`}>
            <h3>{player1}</h3>
            <p>{scores.p1} Points</p>
          </div>

          <div className={`score-box ${winner === player2 ? "highlight" : ""}`}>
            <h3>{player2}</h3>
            <p>{scores.p2} Points</p>
          </div>
        </div>

        <button className="restart-btn" onClick={handleRestart}>
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
