import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";

const questions = [
  {
    question: "PCA is primarily used for which purpose in data analysis?",
    options: [
      "Feature reduction",
      "Model evaluation",
      "Data labeling",
      "Feature scaling"
    ],
    answer: "Feature reduction",
  },
  {
    question: "Which process updates neural network weights to minimize the loss function?",
    options: [
      "Optimization",
      "Regularization",
      "Activation",
      "Normalization"
    ],
    answer: "Optimization",
  },
];


export default function Quiz() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [timer, setTimer] = useState(15);

  const player1 = localStorage.getItem("player1");
  const player2 = localStorage.getItem("player2");
//   const scores = JSON.parse(localStorage.getItem("scores"));
  const turn = localStorage.getItem("turn");

  const currentPlayer = turn === "p1" ? player1 : player2;
  const [errorMsg, setErrorMsg] = useState("");


useEffect(() => {
  if (timer <= 0) {
    handleSubmit(true); 
    return;
  }

  const interval = setInterval(() => {
    setTimer(t => parseFloat((t - 0.2).toFixed(1)));
  }, 200);

  return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [timer]); 

  const handleSubmit = (auto = false) => {
  const stored = JSON.parse(localStorage.getItem("scores")) || { p1: 0, p2: 0 };
  const newScores = { ...stored };

  if (auto) {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected("");
      setErrorMsg("");
      setTimer(15);
    } else if (turn === "p1") {
      localStorage.setItem("turn", "p2");
      setCurrent(0);
      setSelected("");
      setErrorMsg("");
      setTimer(15);
    } else {
      navigate("/result");
    }
    return;
  }

  // Manual submission case
  if (!selected) {
    setErrorMsg("⚠️ Please select an option before submitting!");
    setTimeout(() => setErrorMsg(""), 2000);
    return;
  }

  if (selected === questions[current].answer) {
    newScores[turn] = (newScores[turn] || 0) + 1;
  }

  localStorage.setItem("scores", JSON.stringify(newScores));

  if (current + 1 < questions.length) {
    setCurrent(current + 1);
    setSelected("");
    setErrorMsg("");
    setTimer(15);
  } else if (turn === "p1") {
    localStorage.setItem("turn", "p2");
    setCurrent(0);
    setSelected("");
    setErrorMsg("");
    setTimer(15);
  } else {
    navigate("/result");
  }
};


  const timerWidth = `${(timer / 15) * 100}%`;

  return (
    <div className="quiz-container">
      <div className="quiz-card relative">
        <div className="top-bar">
          <div className="player-name">{currentPlayer}'s Turn</div>
          <div className="question-badge">
            Question {current + 1} / {questions.length}
          </div>
        </div>

        <div className="timer-bar-container">
          <div className="timer-bar" style={{ width: timerWidth }}></div>
        </div>

        <div className="question-text">{questions[current].question}</div>

        <div className="options-container">
          {questions[current].options.map(opt => (
            <button
              key={opt}
              className={`option-button ${selected === opt ? "option-selected" : ""}`}
              onClick={() => setSelected(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
  className="submit-button"
  onClick={() => handleSubmit(false)} 
>
  Submit
</button>

      </div>
    </div>
  );
}
