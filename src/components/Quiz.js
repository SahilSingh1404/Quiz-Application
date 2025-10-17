import React, { useState, useEffect } from "react";
import socket from "../socket";
import "./Quiz.css";

export default function Quiz({ questions, currentQ, playerName, roomId }) {
  const [selected, setSelected] = useState("");
  const [timer, setTimer] = useState(15);
  const [disableButtons, setDisableButtons] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
  setSelected("");
  setTimer(15);
  setDisableButtons(false);
  setWaiting(false);

  const interval = setInterval(() => {
    setTimer((t) => {
      if (t <= 1) {
        clearInterval(interval);
        // ALWAYS submit something, even if nothing selected
        if (!disableButtons) {
          setDisableButtons(true);
          setWaiting(true);
          socket.emit("submitAnswer", {
            roomId,
            playerName,
            answer: selected || "No Answer",
            timeTaken: 15,
          });
        }
        return 0;
      }
      return t - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [currentQ]);

  const handleTimeoutSubmit = () => {
    if (!disableButtons) {
      setDisableButtons(true);
      setWaiting(true);
      socket.emit("submitAnswer", {
        roomId,
        playerName,
        answer: "No Answer",
        timeTaken: 15,
      });
    }
  };

  const handleSubmit = () => {
    if (!selected) return alert("Select an answer before submitting");
    setDisableButtons(true);
    setWaiting(true);
    socket.emit("submitAnswer", {
      roomId,
      playerName,
      answer: selected,
      timeTaken: 15 - timer,
    });
  };

  const q = questions[currentQ];
  if (!q) return <p className="quiz-status">Loading question...</p>;

  const progressPercentage = (timer / 15) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <h2 className="quiz-title">
          Question {currentQ + 1} of {questions.length}
        </h2>
        <p className="quiz-question">{q.question}</p>
        <div className="quiz-options">
          {q.options.map((opt, i) => (
            <button
              key={i}
              disabled={disableButtons}
              onClick={() => setSelected(opt)}
              className={`quiz-option ${selected === opt ? "selected" : ""}`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="quiz-timer-bar">
          <div
            className="quiz-timer-progress"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="quiz-timer-text">⏱ {timer}s</p>

        <button
          onClick={handleSubmit}
          disabled={disableButtons}
          className={`quiz-submit ${disableButtons ? "disabled" : ""}`}
        >
          Submit
        </button>

        {waiting && (
          <p className="quiz-waiting">
            ✅ Waiting for the other player to submit...
          </p>
        )}
      </div>
    </div>
  );
}
