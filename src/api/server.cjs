const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { setupWebSocket } = require('./socket');
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

//generate a unique room ID
function generateRoomId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}



//  simple API route
app.post('/api/create-room', (req, res) => {
  const roomId = generateRoomId();
  const newRoom = {
    roomId,
    users: [],
};

rooms.push(newRoom);

res.json({ newRoom });
});

app.get('/', (req, res) => {
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
setupWebSocket()

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});