const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { WebcastPushConnection } = require("tiktok-live-connector");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// === TikTok korisničko ime koje se prati ===
const tiktokUsername = "sundjerbob.aura.kviz"; // ← zameni svojim korisničkim imenom

// === Inicijalizacija TikTok live konekcije ===
const tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

// === Express posluživanje statičkih fajlova ===
app.use(express.static("public"));

// === Socket.io veza sa klijentima ===
io.on("connection", (socket) => {
  console.log("✅ Novi korisnik povezan.");

  // Kad korisnik napusti stranicu
  socket.on("disconnect", () => {
    console.log("❌ Korisnik se odjavio.");
  });
});

// === TikTok event: novi poklon ===
tiktokLiveConnection.connect().then((state) => {
  console.log(`🎥 Povezan na live od @${tiktokUsername}`);
}).catch((err) => {
  console.error("Greška pri konekciji:", err);
});

tiktokLiveConnection.on("gift", (data) => {
  console.log(`${data.uniqueId} je poslao/la ${data.giftName}`);
  io.emit("gift", {
    username: data.uniqueId,
    giftName: data.giftName,
    repeatCount: data.repeatCount
  });
});

// === Port za Render ===
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server pokrenut na portu ${PORT}`);
});
