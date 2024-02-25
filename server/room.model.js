export class Room{
    roomCode = null;
    players = [];
    round = 1;

    constructor(roomCode){
        this.roomCode = roomCode
    }

    addPlayer(player){
        this.players.push(player)
        player.clientSocket.addEventListener('close', () => {
            this.removePlayer(player)
          });
    }

    removePlayer(player){
        let index = this.players.findIndex(p => p.name === player.name);
        if (index !== -1) {
            this.players.splice(index,  1);
        }
        if(this.players.length === 0){
            console.log("all players in room lost!");
        }
    }

    nextRound(){
        round++;
        this.players[0].sendImage(this.players[this.players.length - 1].currentImage);
        this.players[this.players.length - 1].sendImage(this.players[0].currentImage);

        for(let i = 1; i < this.players.length - 1; i++){
            this.players[i].sendImage(this.players[i + 1].currentImage);
        }
    }

    getRoundInstructions(){
        switch(round){
            case 1:
                return "Draw any scribble to your heart's content!"
                break;
            case 2:
                return "Line your friend's scribble to make a beast!"
                break;
            case 3:
                return "Color the lined beast to bring it to life!"
                break;
            case 4:
                return "Add final touches to make your beast perfect!"
                break;
            case 5:
                return "Argue how your beast will save the world!"
                break;
        }
    }
}