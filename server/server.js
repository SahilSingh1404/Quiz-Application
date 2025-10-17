const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = {};
const questions = [
  {
    question: "PCA is primarily used for which purpose in data analysis?",
    options: ["Feature reduction", "Model evaluation", "Data labeling", "Feature scaling"],
    answer: "Feature reduction",
  },
  {
    question: "Which process updates neural network weights to minimize the loss function?",
    options: ["Optimization", "Regularization", "Activation", "Normalization"],
    answer: "Optimization",
  },
];

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("createRoom", ({ playerName }) => {
    const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    rooms[roomId] = {
      players: [{ id: socket.id, name: playerName }],
      scores: {},
      times: {},
      currentQ: 0,
      answers: {},
    };
    socket.join(roomId);
    console.log(`Room ${roomId} created by ${playerName}`);
    io.to(socket.id).emit("roomCreated", { roomId });
  });

  socket.on("joinRoom", ({ roomId, playerName }) => {
    const room = rooms[roomId];
    if (!room) {
      io.to(socket.id).emit("errorMsg", "❌ Room not found!");
      return;
    }
    if (room.players.length >= 2) {
      io.to(socket.id).emit("errorMsg", "❌ Room is full!");
      return;
    }

    room.players.push({ id: socket.id, name: playerName });
    socket.join(roomId);
    console.log(`${playerName} joined room ${roomId}`);

    io.to(roomId).emit("bothJoined", {
      players: room.players.map((p) => ({ name: p.name })),
    });

    if (room.players.length === 2) {
      io.to(roomId).emit("startQuiz", {
        roomId,
        questions,
        currentQ: 0,
      });
    }
  });

  socket.on("submitAnswer", ({ roomId, playerName, answer, timeTaken }) => {
    const room = rooms[roomId];
    if (!room) return;

    const currentQ = room.currentQ;
    const question = questions[currentQ];

    if (!room.answers[currentQ]) room.answers[currentQ] = {};
    room.answers[currentQ][playerName] = { answer, timeTaken };

    if (Object.keys(room.answers[currentQ]).length === 2) {
      for (const [name, data] of Object.entries(room.answers[currentQ])) {
        if (!room.scores[name]) room.scores[name] = 0;
        if (!room.times[name]) room.times[name] = 0;

        if (data.answer === question.answer) room.scores[name] += 1;
        room.times[name] += data.timeTaken;
      }

      if (currentQ + 1 < questions.length) {
        room.currentQ += 1;
        io.to(roomId).emit("nextQuestion", { currentQ: room.currentQ });
      } else {
        const [p1, p2] = room.players.map((p) => p.name);
        const s1 = room.scores[p1] || 0;
        const s2 = room.scores[p2] || 0;
        const t1 = room.times[p1] || 0;
        const t2 = room.times[p2] || 0;

        let winner = "Tie";
        if (s1 > s2) winner = p1;
        else if (s2 > s1) winner = p2;
        else if (t1 < t2) winner = p1;
        else if (t2 < t1) winner = p2;

        io.to(roomId).emit("gameOver", {
          winner,
          scores: room.scores,
          times: room.times,
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
