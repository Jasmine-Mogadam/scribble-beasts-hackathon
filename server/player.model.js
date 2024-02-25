export class Player {
  name = null;
  currentImage = null;
  clientSocket = null;

  constructor(name, clientSocket) {
    this.name = name;
    this.clientSocket = clientSocket;
  }

  sendImage(imageJsonString) {
    this.clientSocket.send(imageJsonString);
  }
}
