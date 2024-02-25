import { EventEmitter } from "node:events";

export class Room {
  roomCode = null;
  players = [];
  round = 1;
  event = new EventEmitter();

  constructor(roomCode) {
    this.roomCode = roomCode;
  }

  getPlayer(playerName) {
    let index = this.players.findIndex((p) => p.name === playerName);
    if (index !== -1) {
      return this.players[index];
    }
    return null;
  }

  addPlayer(player) {
    this.players.push(player);
    player.clientSocket.addEventListener("close", () => {
      this.removePlayer(player);
    });
  }

  removePlayer(player) {
    let index = this.players.findIndex((p) => p.name === player.name);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
    if (this.players.length === 0) {
      this.event.emit("all players lost");
    } else {
      this.players.forEach((p) => p.clientSocket.send("player list update"));
    }
  }

  startGame() {
    this.players.forEach((p) => {
      p.clientSocket.send("start game");
    });
  }

  nextRound() {
    round++;
    this.swapImages();
    this.players.forEach((p) => p.clientSocket.send("next round"));
  }

  swapImages() {
    // Loop through each player, updating their currentImage based on the next player's currentImage
    for (let i = 0; i < this.players.length - 1; i++) {
      this.players[i].currentImage = this.players[i + 1].currentImage;
    }

    // Update the last player's currentImage to be the same as the first player's currentImage before the loop
    this.players[this.players.length - 1].currentImage =
      this.players[0].currentImage;
  }

  getRoundInstructions() {
    switch (round) {
      case 1:
        return "Draw any scribble to your heart's content!";
        break;
      case 2:
        return "Line your friend's scribble to make a beast!";
        break;
      case 3:
        return "Color the lined beast to bring it to life!";
        break;
      case 4:
        return "Add final touches to make your beast perfect!";
        break;
      case 5:
        return "Argue how your beast will save the world!";
        break;
    }
  }
}
