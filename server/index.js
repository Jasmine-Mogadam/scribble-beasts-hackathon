import {WebSocketServer} from "ws";
import { Room } from "./room.model.js";
import { Player } from "./player.model.js";
const wss = new WebSocketServer({ port: 3000 });
let rooms = [];

wss.on("connection", ws => {
   console.log("new client connected!")
   ws.on("close", () => {
        console.log("client disconnected!")
   }) 

   ws.on("message", data => {
      const message = JSON.parse(data.toString());
      const action = message.action;
      const body = message.body;

      switch(action){
         case "roomCodeExists":
            ws.send(JSON.stringify({action: action, result: roomsContainsRoomCode(body.roomCode)}));
            break;
         case "isNameInRoom":
            ws.send(JSON.stringify({action: action, result: roomContainsName(body.roomCode, body.name)}));
            break;
         case "createRoom":
            createRoom(body.roomCode, body.name, ws);
            break;
         case "joinRoom":
            joinRoom(body.roomCode, body.name, ws);
            break;
      }
      console.log(message);
      console.log(rooms);
    });
    
})

function roomsContainsRoomCode(roomCode){
   return rooms.some(r => r.roomCode === roomCode);
}

function roomContainsName(roomCode, name){
   let index = rooms.findIndex(r => r.roomCode === roomCode);
   if(index !== -1){
      return rooms[index].players.some(p => p.name === name)
   }

   return false;
}

function createRoom(roomCode, name, clientSocket){
   let newRoom = new Room(roomCode);
   newRoom.addPlayer(new Player(name, clientSocket))
   rooms.push(newRoom)
}

function joinRoom(roomCode, name, clientSocket){
   let index = rooms.findIndex(r => r.roomCode === roomCode);
   if(index !== -1){
      rooms[index].addPlayer(new Player(name, clientSocket))
   }
   else{
      console.log("error! join room by " + name + " failed!")
   }
}