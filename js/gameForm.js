import { createRoom, joinRoom, roomCodeExists, nameAlreadyInRoom } from "./rooms.js"

export function handleCreateJoinSubmit(event) {
    event.preventDefault(); // Prevent form submission
    let formData = {
        name: event.target.elements["name"].value,
        roomCode: event.target.elements["room-code"].value
    };

    new Promise(() => {
        if (event.submitter.id === "join-game-submit") {
            canJoinGame(formData).then((successful) => {
                if(successful)joinRoom(formData.roomCode, formData.name);
                return successful;
            });
        } else if (event.submitter.id === "create-game-submit") {
            canCreateGame(formData).then((successful) => {
                if(successful)createRoom(formData.roomCode, formData.name);
                return successful;
            });
        }
    }).then((successful) => {if(successful)buildWaitingScreen();})
}

function buildWaitingScreen(){

}

async function canCreateGame(formData){
    const roomCodeErrorMessage = document.getElementById("room-code-error");
    const nameErrorMessage = document.getElementById("name-error");
    let valid = true;

    if(!formData.name || formData.name === ""){
        nameErrorMessage.innerText = "Name required."
        valid = false;
    }
    else{
        nameErrorMessage.innerText = ""
    }
    
    if(!formData.roomCode || formData.roomCode === ""){
        roomCodeErrorMessage.innerText = "Room Code required."
        valid = false;
    }
    else if(await roomCodeExists(formData.roomCode)){
        roomCodeErrorMessage.innerText = "Room Code in use, choose another."
        valid = false;
    }
    else{
        roomCodeErrorMessage.innerText = ""
    }

    return valid;
}

async function canJoinGame(formData){
    const roomCodeErrorMessage = document.getElementById("room-code-error");
    const nameErrorMessage = document.getElementById("name-error");
    let valid = true;

    if(!formData.name || formData.name === ""){
        nameErrorMessage.innerText = "Name required."
        valid = false;
    }
    else if(await nameAlreadyInRoom(formData.name, formData.roomCode)){
        nameErrorMessage.innerText = "Name in use, choose another."
        valid = false;
    }
    else{
        nameErrorMessage.innerText = ""
    }
    
    if(!formData.roomCode || formData.roomCode === ""){
        roomCodeErrorMessage.innerText = "Room Code required."
        valid = false;
    }
    else if(!await roomCodeExists(formData.roomCode)){
        roomCodeErrorMessage.innerText = "Room Code does not exist."
        valid = false;
    }
    else{
        roomCodeErrorMessage.innerText = ""
    }

    return valid;
}