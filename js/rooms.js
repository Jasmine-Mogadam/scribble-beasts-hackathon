import {socket, waitForMessage} from "./websocket.js"

export function createRoom(roomCode, name){
    socket.send(JSON.stringify({
        action: "createRoom",
        body:{
            roomCode: roomCode,
            name: name
        }
    }));
}

export function joinRoom(roomCode, name){
    socket.send(JSON.stringify({
        action: "joinRoom",
        body:{
            roomCode: roomCode,
            name: name
        }
    }));
}

export async function roomCodeExists(roomCode){
    socket.send(JSON.stringify({
        action: "roomCodeExists",
        body:{
            roomCode: roomCode
        }
    }));

    return (await waitForMessage("roomCodeExists")).result;
}

export async function nameAlreadyInRoom(name, roomCode){
    socket.send(JSON.stringify({
        action: "isNameInRoom",
        body:{
            roomCode: roomCode,
            name: name
        }
    }));

    return (await waitForMessage("isNameInRoom")).result;
}