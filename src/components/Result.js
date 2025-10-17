import React from "react";
import { useNavigate } from "react-router-dom";
import "./Result.css";

export default function Result({ winner, scores, times }) {
  const navigate = useNavigate();
  const winnerText =
    winner === "Tie" ? "The game ended in a tie!" : `Winner: ${winner}`;

  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="result-container">
      <div className="result-card">
        <h2 className="result-title">{winnerText}</h2>

        <h3 className="result-subtitle">Scores:</h3>
        <ul className="result-list">
          {Object.entries(scores).map(([name, score]) => (
            <li key={name}>
              {name}: <span className="result-score">{score}</span> points (⏱{" "}
              {times[name]}s)
            </li>
          ))}
        </ul>

        <button className="result-playagain-btn" onClick={handlePlayAgain}>
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
