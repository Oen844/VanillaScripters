const getDb = require("../config/database").getDb;
var ObjectId = require('mongodb').ObjectID;

class User {

    constructor(id, username, email, password, token, avatar) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.token = token;
        this.avatar = avatar;
    }

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

    save(){
        const db = getDb();
        return db.collection('users')
        .insertOne(this).then(result => result).catch(e => console.log(e))
    }

    update(id, user){
        const db = getDb();
        return db.collection('users')
        .updateOne({_id : ObjectId(id)} , {$set : user }).then(result => result).catch(e => console.log(e))
    }


    getUserByEmail (email) {
        const db = getDb();
        return db.collection('users')
        .findOne({email: email}).then(result => result).catch(e => console.log(e));
    }

    getUserById (id) {
        const db = getDb();
        return db.collection('users')
        .findOne({_id: ObjectId(id)}).then(result => result).catch(e => console.log(e));
    }
  
}

module.exports = User;


