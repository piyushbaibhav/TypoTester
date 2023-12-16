const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { setupWebSocket } = require('./socket.cjs');
const app = express();
const server = http.createServer(app);
//const { io, updateChallengeState, userJoin } = setupWebSocket(server);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with the origin of your React application
    methods: ['GET', 'POST'],
  },
});
const PORT = 5000; // Choose a suitable port

app.use(bodyParser.json());
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with the origin of your React application
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions)); // Enable CORS for all routes

const rooms = []; // Array to store room objects

// Function to generate a unique room ID
function generateRoomId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}
// var gid = generateRoomId();
// console.log(gid)


// // Define a simple API route
// app.get('/api/create-room', (req, res) => {
//   //res.send('this is a room')
// });
// API endpoint to create a new room

app.post('/api/create-room', (req, res) => {
  
console.log('/api/create-room')
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
  const data = { message: req.body };
  res.json(data);
});

// Define a simple API route
app.get('/api/data', (req, res) => {
  // Replace this with your actual data logic
  const data = { message: 'Hello from the server side!' };
  res.json(data);
});


// // user websocket
// setupWebSocket()
io.on('connection', (socket) => {
  //console.log(socket.time)
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
    // Handle user disconnect, e.g., remove the user from the room
  });

  socket.on('joinRoom', async (data) => {
    const { roomId, username } = await data;
    //console.log(username)
    const room = rooms.find((r) => r.roomId === roomId);
    console.log('socket buffer:', data)
    //console.log('socket room:', room.find())

    if (room) {

      room.users.push({ username, socketId: socket.id });

      socket.join(roomId);
      io.to(roomId).emit('userJoined', { username }); // Notify all users in the room
      const rmusers = room.users
      io.to(roomId).emit('users',{rmusers})

      console.log('users available:',room.users)

    } else {

      console.log('Room not found');
      // Handle the case when the room is not found
    }
  });
});
 
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});