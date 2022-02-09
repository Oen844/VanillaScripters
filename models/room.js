module.exports = class Room {
    name = String
    users = Number

    getRoom(name, users) {
        return name, users
    }
    setRoom(name, users) {
        this.name = name
        this.users = users
    }
}
