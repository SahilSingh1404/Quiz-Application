import React, { useState, useEffect } from "react";
import socket from "./socket";
import PlayerForm from "./components/PlayerForm";
import Quiz from "./components/Quiz";
import Result from "./components/Result";

function App() {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [status, setStatus] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({});
  const [times, setTimes] = useState({});
  const [winner, setWinner] = useState("");

  useEffect(() => {
    socket.on("roomCreated", ({ roomId }) => {
      setRoomId(roomId);
      setStatus(`Room created. Share this ID: ${roomId}`);
    });

    socket.on("errorMsg", (msg) => {
      setStatus(msg);
    });

    socket.on("bothJoined", ({ players }) => {
      setStatus(`Both players joined: ${players.map((p) => p.name).join(" vs ")}`);
    });

    socket.on("startQuiz", ({ questions, currentQ }) => {
      setQuestions(questions);
      setCurrentQ(currentQ);
      setQuizStarted(true);
      setStatus("");
    });

    socket.on("nextQuestion", ({ currentQ }) => {
      setCurrentQ(currentQ);
    });

    socket.on("gameOver", ({ winner, scores, times }) => {
      setWinner(winner);
      setScores(scores);
      setTimes(times);
      setQuizStarted(false);
      setStatus("");
    });

    return () => {
      socket.off("roomCreated");
      socket.off("errorMsg");
      socket.off("bothJoined");
      socket.off("startQuiz");
      socket.off("nextQuestion");
      socket.off("gameOver");
    };
  }, []);

  if (winner) {
    return <Result winner={winner} scores={scores} times={times} />;
  }

  if (quizStarted) {
    return (
      <Quiz
        questions={questions}
        currentQ={currentQ}
        playerName={playerName}
        roomId={roomId}
      />
    );
  }

  return (
    <PlayerForm
      playerName={playerName}
      setPlayerName={setPlayerName}
      roomId={roomId}
      setRoomId={setRoomId}
      status={status}
    />
  );
}

export default App;
