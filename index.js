const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./model/user');
var {UsersCollection, RoomsCollection} = require('./config/database');
const users = UsersCollection;
var rooms = RoomsCollection;
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
      var user = new User();
      user.init(body);
      
      const userExists = user.emailExists(users);
      const userPassword = user.getPassword(users);
      console.log(userPassword);
                         
      if (userExists && password === userPassword) {
        
        let currentUser = user.userByEmail(users);
        
        // Create token
        const token = jwt.sign(
          { user_id: currentUser.id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "48h",
          }
        );

        // Save user token
        user.setToken(token);
        currentUser.token = token;

        if(avatar){
          user.setAvatar(avatar);
        } else {
          user.setAvatar('chico');
        }

       
        // user
        let resData = {
          id: currentUser.id, 
          username: currentUser.username, 
          email: user.email, 
          token: user.token,
          avatar: user.avatar
        };
       
        res.cookie('token', user.token);
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
      var user = new User();
      user.init(body);
    
      // check if user already exist
      const usernameExists = user.usernameExists(users);
      const emailExists = user.emailExists(users);
      
      if(emailExists || usernameExists){
        res.send(409, {error: errorTypes.USER_EXISTS});
      } else {

        

        // Generate user id
        randomStr = randomBytes(5).toString('hex');
        userId = user.setId(randomStr);
   
        // Set password
        user.setPassword(password);
    
        // Create token
        const token = jwt.sign(
          { user_id: randomStr, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: '48h',
          }
        );

        // Set user token
        user.setToken(token);

        user.setAvatar("chico");
        const userJSON = JSON.parse(JSON.stringify(user));
        users.push(userJSON);
        res.cookie('token', token);
        let resData = {
          id: user.id, 
          username: user.username, 
          email: user.email, 
          token: user.token,
          avatar: user.avatar
        };
        res.status(201).json(resData);
        
      }
      
    }
  
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
  res.end();
});

app.get('/rooms', auth, (req, res) => {
  res.status(200).json(rooms);
});

app.get('/rooms/:id/play', auth, (req, res) => {
  // Se une usuario
  // room_{id_sala}
  let room = rooms.filter(room => room.id === parseInt(req.params.id))[0];
  //res.status(200).json(room);
  res.render('pages/game');
});

app.get('/rooms/:id', auth, (req, res) => {
  // Se une usuario
  // room_{id_sala}
  let room = rooms.filter(room => room.id === parseInt(req.params.id))[0];
  res.status(200).json(room);
});

app.get('/rooms/join/:roomId/:userId', auth, (req, res) => {
  let roomId = parseInt(req.params.roomId);
  let userId = req.params.userId;
  let newPlayer = users.filter(user => user.id === userId)
                        .map(user => ({id: user.id, username: user.username, avatar: user.avatar})
                  )[0];
  let room = rooms.filter(room => room.id === roomId)[0];
  let currentPlayers = room.currentPlayers;
  let maxPlayers = room.maxPlayers;
  let userAlreadyJoined = currentPlayers.filter(player => player.id === newPlayer.id).length > 0;
  let ableToJoin = maxPlayers > currentPlayers.length && !userAlreadyJoined;
 
  if(!ableToJoin){
    res.status(400).json({error: errorTypes.NOT_ALLOWED});
  }else{
    rooms = rooms.map(room => room.id === roomId ? (room.currentPlayers.push(newPlayer), room) : room);
    res.status(200).json(rooms);
    
  }
});




const server = app.listen(port, () => console.log(`App listening on port ${port}!`));

const SocketIO = require('socket.io');
const io = SocketIO(server);

io.on('connection', (socket)=>{
  console.log('New Connection', socket.id);

  socket.on('game:carta', (data)=>{
    //io.sockets.emit('game:carta', data);
    socket.broadcast.emit('game:carta', data);
    console.log(data);
  })

  

});   

