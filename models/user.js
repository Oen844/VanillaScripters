module.exports = class User {
    username = String
    password = String

    getUsername(username) {
        return username
    }
    setUsername(username) {
        this.username = username
    }
    getPassword(password) {
        return password
    }
    getUser(username, password) {
        return username, password
    }
    setUser(username, password) {
        this.username = username
        this.password = password
    }
}
