class User {
    constructor(){
        this.id = null;
        this.username = null;
        this.email = null;
        this.password = null;
        this.token = null;
        this.avatar = null;
        this.games = null;
    }

    init (data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.token = data.token;
        this.avatar = data.avatar;
    }

    getId () { return this.id;}

    setId (id) { this.id = id; }

    getUsername () { return this.username;}

    setUsername (username) { this.username = username; }

    getEmail () {return this.email;}

    setEmail (email) {this.email = email;}

    getPassword () {return this.password;}

    setPassword (password) {this.password = password;}

    getToken () {return this.token;}

    setToken (token) {this.token = token;}

    getAvatar () {return this.avatar;}

    setAvatar (avatar) {this.avatar = avatar;}

    usernameExists (users) {
        
        return users
                .filter(user => user.username === this.username)
                .length > 0;
        }               

    emailExists (users) {
        return users
                .filter(user => user.email === this.email)
                .length > 0;
    }

    userByEmail (users) {
        return users
                .filter(user => user.email === this.email)[0];
        }
  
}

module.exports = User;