import { getAsyncMessage, sendAction } from "./websocket.js";
import { handleOpenWaitingScreen } from "./waitingScreen.js";
import { currentPlayer } from "./currentPlayer.js";

export function handleCreateJoinSubmit(event) {
  event.preventDefault(); // Prevent form submission
  let formData = {
    name: event.target.elements["name"].value,
    roomCode: event.target.elements["room-code"].value,
  };

  new Promise((resolve) => {
    if (event.submitter.id === "join-game-submit") {
      canJoinGame(formData).then((successful) => {
        if (successful) joinRoom(formData.roomCode, formData.name);
        resolve(successful);
      });
    } else if (event.submitter.id === "create-game-submit") {
      canCreateGame(formData).then((successful) => {
        if (successful) {
          createRoom(formData.roomCode, formData.name);
          currentPlayer.isVip = true;
        }
        resolve(successful);
      });
    }
  }).then((successful) => {
    if (successful) {
      currentPlayer.name = formData.name;
      currentPlayer.roomCode = formData.roomCode;
      handleOpenWaitingScreen();
    }
  });
}

function createRoom(roomCode, name) {
  sendAction("createRoom", { roomCode: roomCode, name: name });
}
function joinRoom(roomCode, name) {
  sendAction("joinRoom", { roomCode: roomCode, name: name });
}
async function roomCodeExists(roomCode) {
  return getAsyncMessage("roomCodeExists", { roomCode: roomCode });
}
async function nameAlreadyInRoom(name, roomCode) {
  return getAsyncMessage("isNameInRoom", { name: name, roomCode: roomCode });
}

async function canCreateGame(formData) {
  const roomCodeErrorMessage = document.getElementById("room-code-error");
  const nameErrorMessage = document.getElementById("name-error");
  let valid = true;

  if (!formData.name || formData.name === "") {
    nameErrorMessage.innerText = "Name required.";
    valid = false;
  } else {
    nameErrorMessage.innerText = "";
  }

  if (!formData.roomCode || formData.roomCode === "") {
    roomCodeErrorMessage.innerText = "Room Code required.";
    valid = false;
  } else if (await roomCodeExists(formData.roomCode)) {
    roomCodeErrorMessage.innerText = "Room Code in use, choose another.";
    valid = false;
  } else {
    roomCodeErrorMessage.innerText = "";
  }

  return valid;
}

async function canJoinGame(formData) {
  const roomCodeErrorMessage = document.getElementById("room-code-error");
  const nameErrorMessage = document.getElementById("name-error");
  let valid = true;

  if (!formData.name || formData.name === "") {
    nameErrorMessage.innerText = "Name required.";
    valid = false;
  } else if (await nameAlreadyInRoom(formData.name, formData.roomCode)) {
    nameErrorMessage.innerText = "Name in use, choose another.";
    valid = false;
  } else {
    nameErrorMessage.innerText = "";
  }

  if (!formData.roomCode || formData.roomCode === "") {
    roomCodeErrorMessage.innerText = "Room Code required.";
    valid = false;
  } else if (!(await roomCodeExists(formData.roomCode))) {
    roomCodeErrorMessage.innerText = "Room Code does not exist.";
    valid = false;
  } else {
    roomCodeErrorMessage.innerText = "";
  }

  return valid;
}
