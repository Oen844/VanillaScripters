class Room {
  constructor(){
    this.id;
    this.name;
    this.artwork;
    this.maxPlayers = 2;
    this.currentPlayers;
    this.updatedAt;
  }

  init (data) {
    this.id = data.id;
    this.name = data.name;
    this.artwork = data.artwork;
    this.maxPlayers = data.maxPlayers;
    this.currentPlayers = data.currentPlayers;
    this.updatedAt = data.updatedAt;
  }

  getId () { return this.id;}
  

  setId (id) { this.id = id; }

  getName () { return this.name;}

  setName (name) { this.name = name; }

  getArtwork () {return this.artwork;}

  setArtwork (artwork) {this.artwork = artwork;}

  getMaxPlayers () {return this.maxPlayers;}

  setMaxPlayers (maxPlayers) {this.maxPlayers = maxPlayers;}

  getCurrentPlayers () {return this.currentPlayers;}

  setCurrentPlayers (currentPlayers) {this.currentPlayers = currentPlayers;}

  getUpdatedAt () {return this.updatedAt;}

  setUpdatedAt (updatedAt) {this.updatedAt = updatedAt;}

  

}

module.exports = Room;