import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlayerForm.css";

export default function PlayerForm() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!player1.trim() || !player2.trim()) {
      setError("⚠️ Please enter both player names!");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (player1.trim() === player2.trim()) {
      setError("⚠️ Player names must be different!");
      setTimeout(() => setError(""), 2000);
      return;
    }

    localStorage.setItem("player1", player1);
    localStorage.setItem("player2", player2);
    localStorage.setItem("turn", "p1");
    localStorage.setItem("scores", JSON.stringify({ p1: 0, p2: 0 }));
    navigate("/quiz");
  };

  return (
    <div className="player-form-container">
      <div className="player-form-card">
        <h1 className="quiz-title"> Quiz Challenge</h1>
        <p className="subtitle">Enter player names to begin!</p>

        <input
          type="text"
          placeholder="Player 1 Name"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="player-input"
        />

        <input
          type="text"
          placeholder="Player 2 Name"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="player-input"
        />

        {error && <div className="error-msg">{error}</div>}

        <button className="start-btn" onClick={handleStart}>
          Start Quiz
        </button>
      </div>
    </div>
  );
}
