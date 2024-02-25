import { handleCreateJoinSubmit } from "./gameForm.js";
import {socket} from "./websocket.js"

window.onload = function() {
    // Add event listener to the form
    document.getElementById("game-start-join").addEventListener("submit", handleCreateJoinSubmit);
    
  // Handle any errors that occur.
  socket.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
  };

  // Show a connected message when the WebSocket is opened.
  socket.onopen = function(event) {
    //socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.url;
    //socketStatus.className = 'open';
  };

  // Handle messages sent by the server.
  socket.onmessage = function(event) {
    var data = JSON.parse(event.data);
    console.log(data);
    //messagesList.innerHTML += '<li class="received"><span>Received:</span>' + message + '</li>';
  };

  // Show a disconnected message when the WebSocket is closed.
  socket.onclose = function(event) {
    //socketStatus.innerHTML = 'Disconnected from WebSocket.';
    //socketStatus.className = 'closed';
  };
}

