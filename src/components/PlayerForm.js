import React from "react";
import socket from "../socket";
import "./PlayerForm.css";

export default function PlayerForm({
  playerName,
  setPlayerName,
  roomId,
  setRoomId,
  status,
}) {
  const handleCreate = () => {
    if (!playerName) return alert("Enter your name");
    socket.emit("createRoom", { playerName });
  };

  const handleJoin = () => {
    if (!playerName || !roomId) return alert("Enter name and room ID");
    socket.emit("joinRoom", { playerName, roomId });
  };

  return (
  <div className="playerform-container">
    <div className="playerform-card">
      <h1 className="playerform-title">
        <span className="highlight">Real-Time Quiz Arena</span>
      </h1>
      <p className="playerform-subtitle">
        Create or join a room to start playing instantly!
      </p>

      <input
        type="text"
        placeholder="Enter your name"
        className="playerform-input"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Room ID (to join)"
        className="playerform-input"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <div className="playerform-buttons">
        <button onClick={handleCreate} className="playerform-btn create">
          🚀 Create Room
        </button>
        <button onClick={handleJoin} className="playerform-btn join">
          🔗 Join Room
        </button>
      </div>

      {status && <p className="playerform-status">{status}</p>}
    </div>
  </div>
);

}
