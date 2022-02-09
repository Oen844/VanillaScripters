module.exports = class Game {
    players = Number
    room = String
    winner = String

    getGame(players, room, winner) {
        return players, room, winner
    }
    setGame(players, room, winner) {
        this.players = players
        this.room = room
        this.winner = winner
    }
}
