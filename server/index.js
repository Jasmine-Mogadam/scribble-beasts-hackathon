import { WebSocketServer } from "ws";
import { Room } from "./room.model.js";
import { Player } from "./player.model.js";
const wss = new WebSocketServer({ port: 3000 });
let rooms = [];

wss.on("connection", (ws) => {
  console.log("new client connected!");
  ws.on("close", () => {
    console.log("client disconnected!");
  });

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());
    const action = message.action;
    const body = message.body;

    switch (action) {
      case "roomCodeExists":
        ws.send(
          JSON.stringify({
            action: action,
            result: roomsContainsRoomCode(body.roomCode),
          })
        );
        break;
      case "isNameInRoom":
        ws.send(
          JSON.stringify({
            action: action,
            result: roomContainsName(body.roomCode, body.name),
          })
        );
        break;
      case "createRoom":
        createRoom(body.roomCode, body.name, ws);
        break;
      case "joinRoom":
        joinRoom(body.roomCode, body.name, ws);
        break;
      case "getPlayers":
        ws.send(
          JSON.stringify({
            action: action,
            result: getPlayers(body.roomCode),
          })
        );
        break;
      case "getVip":
        ws.send(
          JSON.stringify({
            action: action,
            result: getVip(body.roomCode),
          })
        );
        break;
      case "startGame":
        startGame(body.roomCode);
        break;
      case "getRound":
        ws.send(
          JSON.stringify({
            action: action,
            result: getRound(body.roomCode),
          })
        );
        break;
      case "nextRound":
        nextRound(body.roomCode);
      case "sendImage":
        sendImage(body.roomCode, body.name, body.image);
    }
    console.log(message);
    console.log(rooms);
  });
});

function roomsContainsRoomCode(roomCode) {
  return !!getRoom(roomCode);
}

function roomContainsName(roomCode, name) {
  return getRoom(roomCode)?.players.some((p) => p.name === name);
}

function createRoom(roomCode, name, clientSocket) {
  let newRoom = new Room(roomCode);
  newRoom.addPlayer(new Player(name, clientSocket));
  newRoom.event.on("all players lost", () => {
    console.log(
      `all players lost in room ${newRoom.roomCode}, removing from room list.`
    );
    rooms.splice(
      rooms.findIndex((r) => r.roomCode === newRoom.roomCode),
      1
    );
  });
  rooms.push(newRoom);
}

function joinRoom(roomCode, name, clientSocket) {
  let room = getRoom(roomCode);
  if (room) {
    room.addPlayer(new Player(name, clientSocket));
  } else {
    console.log("error! join room by " + name + " failed!");
  }

  room.players.forEach((p) => {
    p.clientSocket.send("player list update");
  });
}

function getRoom(roomCode) {
  let index = rooms.findIndex((r) => r.roomCode === roomCode);
  if (index !== -1) {
    return rooms[index];
  }
  return null;
}

function getPlayers(roomCode) {
  let room = getRoom(roomCode);
  if (room) {
    return room.players.map((p) => p.name);
  } else {
    console.log(`error! cannot get players of empty room ${roomCode}`);
  }
}

function getVip(roomCode) {
  let room = getRoom(roomCode);
  if (room) {
    return room.players[0].name;
  } else {
    console.log(`error! cannot get players of empty room ${roomCode}`);
  }
}

function startGame(roomCode) {
  let room = getRoom(roomCode);
  if (room) {
    room.startGame();
  } else {
    console.log(`error! cannot start game for room ${roomCode}`);
  }
}

function getRound(roomCode) {
  let room = getRoom(roomCode);
  if (room) {
    return room.round;
  } else {
    console.log(`error! cannot get round number of room ${roomCode}`);
  }
}

function nextRound(roomCode) {
  let room = getRoom(roomCode);
  if (room) {
    room.nextRound();
  } else {
    console.log(`error! cannot get room ${roomCode} for next round`);
  }
}

function sendImage(roomCode, name, image) {
  let room = getRoom(roomCode);
  if (room) {
    let player = room.getPlayer(name);
    if (player) {
      player.currentImage = image;
    } else {
      console.log("error! could not find player " + name + " for sendImage");
    }
  } else {
    console.log("error! could not find room " + roomCode + " for sendImage");
  }

  room.players.forEach((p) => {
    p.clientSocket.send("player list update");
  });
}
