export class clientPlayer {
  name = null;
  roomCode = null;
  currentImage = null;
  isVip = false;
  inGame = false;

  saveImage(imageJsonString) {
    this.currentImage = imageJsonString;
  }

  sendImage(websocket) {
    this.clientSocket.send(this.currentImage);
  }
}

export const currentPlayer = new clientPlayer();
