const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

let countries = [];
try {
  countries = JSON.parse(fs.readFileSync(path.join(__dirname, "countries.json")));
} catch (e) {
  console.error("countries.json missing!");
}

const scores = {};
countries.forEach(c => scores[c.code] = { ...c, points: 0 });

function randomCountry() {
  return countries[Math.floor(Math.random() * countries.length)];
}

function broadcast() {
  const arr = Object.values(scores).sort((a, b) => b.points - a.points);
  io.emit("leaderboard", arr);
}

app.use("/", express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log(`Running on port ${PORT}`));

setInterval(() => {
  // BRZA simulacija
  for (let i = 0; i < 10; i++) {
    const c = randomCountry();
    c.points += Math.floor(Math.random() * 50);
  }
  broadcast();
}, 1000);

io.on("connection", s => {
  s.emit("leaderboard", Object.values(scores).sort((a,b)=>b.points-a.points));
});
