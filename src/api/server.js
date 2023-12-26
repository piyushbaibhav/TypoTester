const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createServer } = require('http');
//import http from 'node:http';
const { Server } = require('socket.io');
//const { setupWebSocket } = require('./socket.cjs');
const app = express();
const httpServer = createServer(app);


//const socket = io(`${process.env.VERCEL_URL}`, { transports: ['websocket'] });

//const { io, updateChallengeState, userJoin } = setupWebSocket(server);
const io = new Server(httpServer, {
  cors: {
    origin: 'https://typo-tester-phi.vercel.app', // Replace with the origin of your React application
    methods: ["GET","HEAD","PUT","PATCH","POST","DELETE" ],
    credentials: true
  },
  allowEIO3: true,
});

app.use(bodyParser.json());
app.use(cors({origin : 'https://typo-tester-phi.vercel.app'})); // Enable CORS for all routes

const PORT = 5000; // Choose a suitable port

const rooms = []; // Array to store room objects


// // user websocket
// setupWebSocket()
io.on('connection', (socket) => {
  //console.log(socket.time)
  console.log('A user connected');

  socket.on('userDisconnect', () => {
    console.log('User disconnected');
    // Handle user disconnect, e.g., remove the user from the room
  });

  socket.on('joinRoom', (data) => {
    const { roomId, username } =  data;
    //console.log(username)
    const room = rooms.find((r) => r.roomId === roomId);
    //console.log('socket buffer:', data)

    if (room) {

      room.users.push({ username, socketId: socket.id });

      socket.join(roomId);
      io.to(roomId).emit('userJoined', { username }); // Notify all users in the room
      const rmusers = room.users
      io.to(roomId).emit('users',{rmusers})
      const us = rmusers.map((e , i) => (`${i + 1}: ${e.username}`));
      console.log('users available:',us)

    } else {

      console.log('Room not found');
      // Handle the case when the room is not found
    }
  });
});
// Function to generate a unique room ID
function generateRoomId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// // Define a simple API route
// add this
app.get('/socket.io', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});
///

app.get('/api/create-room', (req, res) => {
  // Replace this with your actual data logic
  const data = { message: `'Server says hello' , ${req.body}` };
  res.json(data);
});
app.post('/api/create-room', (req, res) => {
  
console.log('     create-room')
const roomId = generateRoomId();
console.log("room created  " , roomId)

const newRoom = {
  roomId,
  users: [],
};

rooms.push(newRoom);
// console.log('rooms available :' , rooms)
res.json({ newRoom });
console.log('n-room :' , newRoom)
});

app.get('/', (req, res) => {
  // Replace this with your actual data logic
  const data = { message: 'Server says hello' };
  console.log(data)
  let numOfClients = io.engine.clientsCount;
console.log("Number of connections:" + numOfClients);
  res.json(data);
});

// Define a simple API route
app.get('/api/data', (req, res) => {
  // Replace this with your actual data logic
  const data = { message: 'Hello from the server side!' };
  res.json(data);
});



 
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});