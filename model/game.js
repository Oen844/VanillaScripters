class Game {
  constructor(){
    this.id = null;
    this.roomId = null;
    this.players = null;
    this.winner = null;
    this.createdAt = null;
  }

  init (data) {
    this.id = data.id;
    this.roomId = data.roomId;
    this.players = data.players;
    this.winner = data.winner;
    this.createdAt = data.createdAt;
  }

  getId () { return this.id;}

  setId (id) { this.id = id; }

  getRoomId () { return this.roomId;}

  setRoomId (roomId) { this.roomId = roomId; }

  getPlayers () {return this.players;}

  setPlayers (players) {this.players = players;}

  getWinner () {return this.winner;}

  setWinner (winner) {this.winner = winner;}

  getCreatedAt () {return this.createdAt;}

  setCreatedAt (createdAt) {this.createdAt = createdAt;}
}

module.exports = Game;