import { handleCreateJoinSubmit } from "./titleScreen.js";
import { handleGame } from "./game.js";
import { socket } from "./websocket.js";
import { currentPlayer } from "./currentPlayer.js";

window.onload = function () {
  document
    .getElementById("game-start-join")
    .addEventListener("submit", handleCreateJoinSubmit);

  document
    .getElementById("start-game-button")
    .addEventListener("click", handleGame);
};

// Handle any errors that occur.
socket.onerror = function (error) {
  console.log("WebSocket Error: " + error);
};

// Handle messages sent by the server.
socket.onmessage = function (event) {
  let data = "bad message";
  try {
    data = JSON.parse(event.data);
  } catch {
    data = event.data;
  }
  if (data === "start game" && !currentPlayer.inGame) {
    handleGame();
  }
  console.log(data);
};

// Show a disconnected message when the WebSocket is closed.
socket.onclose = function (event) {
  socketErrorEle = document
    .getElementById("socket-disconnected")
    .classList.remove("hide");
};
