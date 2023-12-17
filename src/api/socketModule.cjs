// socketModule.js

import { io } from 'socket.io';


const socket = io("https://typo-server.vercel.app/");
//   (server, {
//     cors: {
//       origin: '*',
//     }
// });

// Event listeners and other socket-related code
export const initSocket = () => {
  if (socket) {
  

  // Listen for typing challenge state updates from the server
  socket.on("challengeState", (challengeState) => {
    setStartCounting(challengeState.startCounting);
    setactiveWordIndex(challengeState.activeWordIndex);
    setCorrectWordArray(challengeState.correctWordArray);
    setRemainingTime(challengeState.remainingTime);
    setTotalWordsAttempted(challengeState.totalWordsAttempted);
  });
  // Listen for user join event
  socket.on("userJoin", (joinedUsername) => {
    setRoomUsers((users) => [...users, joinedUsername]);
  });
  // Listen for user disconnect event
  socket.on("userDisconnect", (disconnectedUsername) => {
    console.log(`${disconnectedUsername} has disconnected.`);
    // Handle user disconnection, e.g., remove the user from the UI
  });
    return socket;
  }
};

export const updateChallengeState = (socket, startCounting, activeWordIndex, correctWordArray, remainingTime, totalWordsAttempted) => {
    // Emit typing challenge state updates to the server
    if (socket) {
      const challengeState = {
        startCounting,
        activeWordIndex,
        correctWordArray,
        remainingTime,
        totalWordsAttempted,
      };
      socket.emit('updateChallengeState', challengeState);
    }
  };
  
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket.emit("disconnectUser");
    
  }
};
