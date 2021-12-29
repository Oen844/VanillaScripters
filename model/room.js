const getDb = require("../config/database").getDb;
var ObjectId = require('mongodb').ObjectID;

class Room {
  constructor(id, name, artwork, currentPlayers){
    this.id = id;
    this.name = name;
    this.artwork = artwork;
    this.maxPlayers = 2;
    this.currentPlayers = currentPlayers;
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

  show(){
    const db = getDb();
    return db.collection('rooms')
    .find()
    .toArray()
    .then(result => result).catch(e => console.log(e))
  }

  update(id, room){
    const db = getDb();
    return db.collection('rooms')
    .updateOne({_id : id} , {$set : room }).then(result => result).catch(e => console.log(e))
  }

  getRoomById (id) {
    const db = getDb();
    return db.collection('rooms')
    .findOne({_id: id}).then(result => result).catch(e => console.log(e));
}

}

module.exports = Room;