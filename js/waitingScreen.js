import { socket, getAsyncMessage } from "./websocket.js";
import { currentPlayer } from "./currentPlayer.js";

export function handleOpenWaitingScreen() {
  document.getElementById("title-screen").classList.add("hide");
  document.getElementById("in-game").classList.remove("hide");
  document.getElementById("waiting-screen").classList.remove("hide");
  document.getElementById("name").innerText = currentPlayer.name;
  document.getElementById("roomCode").innerText =
    "ROOM CODE: " + currentPlayer.roomCode;
  if (currentPlayer.isVip) {
    document.getElementById("instructions").innerText = "Waiting for players.";
    document.getElementById("vip-start-button").classList.remove("hide");
  } else {
    getVip().then((vipName) => {
      document.getElementById(
        "instructions"
      ).innerText = `Waiting for ${vipName} to start the game.`;
    });
  }
  updateWaitlist();
  socket.addEventListener("message", (message) => {
    if (message.data === "player list update") updateWaitlist();
  });
}

async function updateWaitlist() {
  let playerNames = await getPlayers();
  let unorderedList = document.createElement("ul");
  playerNames.forEach((n) => {
    let listItem = document.createElement("li");
    listItem.innerText = n;
    unorderedList.appendChild(listItem);
  });
  const waitlist = document.getElementById("waitlist");
  waitlist.replaceChild(unorderedList, waitlist.childNodes[3]);
}

async function getVip() {
  return getAsyncMessage("getVip", { roomCode: currentPlayer.roomCode });
}

async function getPlayers() {
  return getAsyncMessage("getPlayers", { roomCode: currentPlayer.roomCode });
}
