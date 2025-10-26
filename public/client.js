const socket = io();
const list = document.getElementById("list");

socket.on("leaderboard", data => {
  list.innerHTML = "";
  data.slice(0, 50).forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "country";
    div.innerHTML = `
      <div>${i+1}. ${c.flag || ""} ${c.name}</div>
      <div class="points">${c.points}</div>
    `;
    list.appendChild(div);
  });
});
