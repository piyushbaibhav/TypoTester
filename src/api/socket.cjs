
const { Server } = require('socket.io');

const setupWebSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173', // Replace with the origin of your React application
      methods: ['GET', 'POST'],
    },
  });
  

// user websocket
io.on('connection', (socket) => {
    //console.log(`User connected: ${socket.id}`);
    socket.on('disconnect', () => {
      //console.log('User disconnected');
      // Handle user disconnect, e.g., remove the user from the room
    });
  
    socket.on('joinRoom', async (data) => {
      const { roomId, username } = await data;
      const room = rooms.find((r) => r.roomId === roomId);
      console.log('socket buffer:', data)
  
      if (room) {
  
        room.users.push({ username, socketId: socket.id });
  
        socket.join(roomId);
        io.to(roomId).emit('userJoined', { username }); // Notify all users in the room
        const rmusers = room.users
        io.to(roomId).emit('users',{rmusers})
  
        //console.log('users available:',room.users)
  
      } else {
  
        console.log('Room not found');
        // Handle the case when the room is not found
      }
    });
  });
}

module.exports = { setupWebSocket };
