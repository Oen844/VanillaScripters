const http = require("http")
const fs = require("fs")
const url = require("url")
const util = require("util")
const formidable = require("formidable")
const User = require("./models/user")
const Game = require("./models/game")
const Room = require("./models/room")

// Users

var user1 = new User()
var user2 = new User()
var user3 = new User()

user1.setUser("hector", "1111")
user2.setUser("paco", "1111")
user3.setUser("test", "1111")
const users = [user1, user2, user3]

// Game
let game = new Game()

// Rooms
var roomWind = new Room()
var roomFire = new Room()

var roomWater = new Room()
var roomEarth = new Room()

roomWind.setRoom("wind", 0)
roomFire.setRoom("fire", 0)
roomWater.setRoom("water", 0)
roomEarth.setRoom("earth", 0)

const allRooms = [roomWind, roomFire, roomWater, roomEarth]

// Create the server
const server = http.createServer((req, res) => {
    // Path
    const path = req.url

    // Assets

    // Routing

    if (path === "/login") {
        if (req.method === "POST") {
            let form = new formidable.IncomingForm()
            form.parse(req, function (err, fields, files) {
                if (err) {
                    console.log(err)
                    return
                }

                userLogged = fields.user
                passLogged = fields.password

                users.forEach((user) => {
                    if (
                        user.username === userLogged &&
                        user.password === passLogged
                    ) {
                        res.writeHead(202)
                    }

                    if (passLogged !== user.password) {
                        res.writeHead(401)
                    }
                })
            })
        }
        const index = fs.readFile(
            `${__dirname}/templates/login.html`,
            "utf8",
            (error, data) => {
                if (error) {
                    console.log("Something was wrong!")
                } else {
                    res.end(data)
                }
            }
        )
    } else if (path === "/game") {
        const index = fs.readFile(
            `${__dirname}/templates/game.html`,
            "utf8",
            (error, data) => {
                if (error) {
                    console.log("Something was wrong!")
                } else {
                    res.end(data)
                }
            }
        )
        if (req.method === "POST") {
            let form = new formidable.IncomingForm()
            form.parse(req, function (err, fields, files) {
                if (err) {
                    console.log(err)
                    return
                }
                let roomFrom = fields.roomFrom
                console.log(`Viene de ${roomFrom}`)
                let roomFor = fields.roomFor
                console.log(`Va hacía de ${roomFor}`)

                allRooms.forEach((room) => {
                    if (room.name === roomFor) {
                        if (room.users < 2) {
                            room.users++
                            game.setGame(room.users, room.name, null)
                            res.writeHead(202)
                        } else {
                            res.writeHead(401)
                        }
                    }
                    if (room.name === roomFrom) {
                        room.users--
                    }
                })
                if (roomFor === "home") {
                    console.log("va a home")
                    res.writeHead(205)
                }
                console.log(allRooms)
            })
        }
    } else if (path === "/endgame") {
        if (req.method === "POST") {
            res.writeHead(200)
            res.end("End game")
        } else {
            res.status(400)
        }
    } else {
        res.writeHead(404)
        res.end("Page not found!")
    }
})

server.listen(3001, "127.0.0.1", () => {
    console.log("server on!")
})
