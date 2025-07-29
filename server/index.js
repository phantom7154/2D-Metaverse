const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const players = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Default player object
  players[socket.id] = {
    id: socket.id,
    name: "Unknown",
    x: 400,
    y: 300,
  };

  // Client sets their name
  socket.on("setName", (name) => {
    players[socket.id].name = name || "Unnamed";
    // Send to everyone that a new player has joined
    socket.emit("currentPlayers", players);
    socket.broadcast.emit("newPlayer", players[socket.id]);
  });

  socket.on("move", (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      io.emit("playerMoved", players[socket.id]);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
