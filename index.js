const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./model/user');
// var {UsersCollection, RoomsCollection} = require('./config/database');
// const users = UsersCollection;
// var rooms = RoomsCollection;
const mongoConnect = require("./config/database").mongoConnect;
const {loginActionTypes, errorTypes} = require('./config/types');
var cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
const auth = require("./middleware/auth");


const { PORT } = process.env;
const port = process.env.PORT || PORT;

// Routes
// Home
app.get('/', auth, (req, res) => { 
    res.render('pages/home');
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

// Login
app.post('/login', async (req, res) => {
    const body = req.body;
    const {action, username, email, password, avatar} = body;
    
    if(action === loginActionTypes.LOGIN){
      
      // Validate data
      if (!(email && password)) {
        res.status(400).json({error: errorTypes.MISSING_DATA});
        return;
      }
      
      // Validate if user exist in our database
    
      const user = new User();
      
      const currentUser = await user.getUserByEmail(email);
      console.log(currentUser);
      const userPassword = currentUser.password;
                         
      if (currentUser && password === userPassword) {
        const id = currentUser._id.toString();
        // Create token
        const token = jwt.sign(
          { user_id: id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "48h",
          }
        );

        // Save user token & avatar
        let userAvatar = avatar ? avatar : "chico";
        updateUserObj = {token: token, avatar: userAvatar};
       
        user.update(id, updateUserObj)
        .then(result => console.log(result))
        .catch(e => console.log(e))
       
        // user
        let resData = {
          id: id, 
          username: currentUser.username, 
          email: user.email, 
          token: token,
          avatar: userAvatar
        };
       
        res.cookie('token', token);
        res.status(200).json(resData);

      } else {
        res.status(400).json({error: errorTypes.INVALID_CREDENTIALS});
        return;
      }

    }

    if(action === loginActionTypes.REGISTER){

      if (!(username && email && password)) {
        res.status(400).json({error: errorTypes.MISSING_DATA});
        return;
      }

      // Init user object
      let id = "";
      let avatar = "chico";
      var user = new User(id, username, email, password, null, avatar);
      
      // check if user already exist
      const userExists = await user.getUserByEmail( email );
      
      if(userExists){
        res.sendStatus(409).send({error: errorTypes.USER_EXISTS});
      } else {
  
        user.save()
        .then(result => {
          id = result.insertedId.toString();
      
          // Create token
          const token = jwt.sign(
            { user_id: id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: '48h',
            }
          );
          res.cookie('token', token);
          let resData = {
            id: id,
            username: username, 
            email: email, 
            token: token,
            avatar: avatar
          };
          // Update
          user.update(id, {token: token})
          .then(result => console.log(result))
          .catch(e => console.log(e))
          res.status(201).json(resData);
        })
        .catch(error => console.log(error));

      }
      
    }
  
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
  res.end();
});

app.get('/rooms', auth, async(req, res) => {
  const room = new Room();
  const rooms = await room.show();
  res.status(200).json(rooms);
});

app.get('/rooms/:id/play', auth, (req, res) => {
  // Se une usuario
  // room_{id_sala}
  let id = parseInt(req.params.id);
  let room = new Room();
  let roomData = room.getRoomById(id);
  res.render('pages/game', roomData);
});

app.get('/rooms/:id', auth, async(req, res) => {
  // Se une usuario
  // room_{id_sala}
  let id = parseInt(req.params.id);
  let room = new Room();
  let roomData = await room.getRoomById(id);
  res.status(200).json(roomData);
});

app.get('/rooms/join/:roomId/:userId', auth, async(req, res) => {
  let roomId = parseInt(req.params.roomId);
  let userId = req.params.userId;
  let user = new User();
  let newPlayer = await user.getUserById(userId);
  console.log(newPlayer);
  let room = new Room();
  let roomData = await room.getRoomById(roomId);
  let currentPlayers = roomData.currentPlayers;
  let maxPlayers = roomData.maxPlayers;
  let userAlreadyJoined = currentPlayers.filter(player => player._id.toString() === newPlayer._id.toString()).length > 0;
  let ableToJoin = maxPlayers > currentPlayers.length && !userAlreadyJoined;
 
  if(!ableToJoin){
    res.status(400).json({error: errorTypes.NOT_ALLOWED});
  }else{
    roomData.currentPlayers.push(newPlayer);
    room.update(roomId, roomData);
    res.status(200).json(roomData);
  }
});


mongoConnect(() => {});

  const server = app.listen(port, () => console.log(`App listening on port ${port}!`));
  const SocketIO = require('socket.io');
const Room = require('./model/room');
  const io = SocketIO(server);

  io.on('connection', (socket)=>{
    console.log('New Connection', socket.id);

    socket.on('game:carta', (data)=>{
      //io.sockets.emit('game:carta', data);
      socket.broadcast.emit('game:carta', data);
      console.log(data);
    })
  });   




