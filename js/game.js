import { sendAction } from "./websocket.js";
import { currentPlayer } from "./currentPlayer.js";
import { drawOnImage } from "./drawing.js";

let inGame = false;

export function handleGame() {
  // START ROUND 1
  roundOne();
}

function roundOne() {
  document.getElementById("waiting-screen").classList.add("hide");
  document.getElementById("round-1-screen").classList.remove("hide");
  console.log("Game started!");
  drawOnImage("scribble");
  if (currentPlayer.isVip) {
    sendAction("startGame", { roomCode: currentPlayer.roomCode });
    currentPlayer.inGame = true;
  }
}
