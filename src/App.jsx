
import React, { useRef, useState, useEffect } from 'react';
import Word from './components/Word';
import Timer from './components/Timer';
import ModeSelection from './components/ModeSelection';
import './App.css';
import { generate } from 'random-words';
import Footer from './components/Footer';
import axios from 'axios';
import { io } from 'socket.io-client';

import {
  initSocket,
  disconnectSocket,
  updateChallengeState,
} from './api/socketModule.cjs';

const socket = initSocket(); // Establish WebSocket connection

const getCloud = (count = 40) => {
  const words = generate({ exactly: count, join: ' ' });
  return words.split(' ');
};

function RestartButton({ onClick }) {
  return (
    <button
      className="  hover:underline underline-offset-8 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      Retry
    </button>
  );
}
function ReloadButton({ onClick }) {
  return (
    <button
      className=" hover:underline underline-offset-8 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      Restart
    </button>
  );
}

function App() {
  const [userInput, setUserInput] = useState('');
  const cloud = useRef(getCloud());
  const [startCounting, setStartCounting] = useState(false);
  const [activeWordIndex, setactiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);
  const [selectedMode, setSelectedMode] = useState(15);
  const [remainingTime, setRemainingTime] = useState(selectedMode);
  const [totalWordsAttempted, setTotalWordsAttempted] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  // const [correctWords, setCorrectWords] = useState(0);



  ////////// join a room 
  const [roomId, setRoomId] = useState(null);
  const [username, setUsername] = useState(null);
  const [roomUsersData, setRoomUsersData] = useState([]);
  const roomUsers = [];

  useEffect(() => {
    let timer;

    fetchData();

    if (startCounting && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((time) => time - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setStartCounting(false);
      setUserInput('Completed');
      clearInterval(timer); // Stop the timer when time is up
    }

    return () => clearInterval(timer);
  }, [startCounting, remainingTime]);

  const processInput = (value) => {
    if (activeWordIndex === cloud.current.length || remainingTime === 0) {
      // Stop
      return;
    }

    if (!startCounting) {
      setStartCounting(true);
    }

    if (value.endsWith(' ')) {
      if (activeWordIndex === cloud.current.length - 1) {
        setStartCounting(false);
        setUserInput('Completed');
      } else {
        setUserInput('');
      }
      setactiveWordIndex((index) => index + 1);

      setCorrectWordArray((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[activeWordIndex] = word === cloud.current[activeWordIndex];
        return newResult;
      });
      setTotalWordsAttempted((count) => count + 1);
    } else {
      setUserInput(value);
    }
    //##b-end added
    updateChallengeState();
  };

  const handleModeSelection = (mode) => {
    setSelectedMode(mode);
    setRemainingTime(mode);
    setStartCounting(false); // Reset the counting when mode changes
    setTotalWordsAttempted(0);

    // increase word count for 90 second
    const wordCount = mode === 90 ? 60 : 40;
    cloud.current = getCloud(wordCount);
    setactiveWordIndex(0);
    setUserInput('');
    setStartCounting(false);
    setCorrectWordArray([]);
    setRemainingTime(mode);

    //##b-end added
    updateChallengeState();
  };

  const handleRestart = () => {
    setUserInput('');
    setStartCounting(false);
    setactiveWordIndex(0);
    setCorrectWordArray([]);
    setRemainingTime(selectedMode);
    setTotalWordsAttempted(0);
    setTimeElapsed(0);
    // setCorrectWords(0);

    //##b-end added
    updateChallengeState();
  };
  const handleReloadWords = () => {
    cloud.current = getCloud(selectedMode === 90 ? 80 : 40); // increase word count to 80
    setactiveWordIndex(0);
    setUserInput('');
    setStartCounting(false);
    setCorrectWordArray([]);
    setRemainingTime(selectedMode);
    setTotalWordsAttempted(0);
    setTimeElapsed(0);
    // setCorrectWords(0);
    //when restart the speed doesn't resart

    //##b-end added
    updateChallengeState();
  };
  /////////////////
  useEffect(() => {

    initSocket();
    updateChallengeState(
      socket,
      startCounting,
      activeWordIndex,
      correctWordArray,
      remainingTime,
      totalWordsAttempted
    );
  }, [
    socket,
    startCounting,
    activeWordIndex,
    correctWordArray,
    remainingTime,
    totalWordsAttempted,
  ]);

  //////////////////////////
  const handleRoomCreation = async () => {
    try {
      const response = await axios.post(
        "https://chocolate-dhole-ring.cyclic.app//api/create-room"
      );
      console.log(response.data.newRoom);
      const { roomId } = response.data.newRoom;
      setRoomId(roomId);
      socket.emit("joinRoom", { roomId, username });
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };
  ////////////////////

  const handleRoomJoin = async () => {
        const enteredRoomId = prompt("Enter the room ID:"); // You can replace this with your own way of getting a room ID
        const enteredUsername = prompt("Enter your username:"); // You can replace this with your own way of getting a username

    try {
      if (enteredUsername) {

        setRoomId(enteredRoomId);
        setUsername(enteredUsername);
        
        socket.emit("joinRoom", { roomId, username: enteredUsername });
        socket.emit("userJoin", username);
        socket.on("users", (data) => {
          setRoomUsersData(data.rmusers);
          roomUsers.push(data.rmusers);
          console.log(roomUsersData);
        console.log("prompt Acquired :", enteredRoomId, enteredUsername);
        });
        // Redirect the user to the joined room or handle accordingly
        // (You may use React Router for navigation)
      }
    } catch (error) {
      console.error("Invalid room or username");
    }
  };
  useEffect(() => {
    return () => {
      // Clean up resources when the component unmounts
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Handle user-initiated disconnection (e.g., leaving the room)
  const handleDisconnect = () => {
    disconnectSocket();
    setRoomUsersData([]); // Clear the room users
  };

  return (
    <div className="flex flex-col  items-center h-screen">
      <h1 className="text-5xl font-extrabold mb-4 pb-11"style={{ color: 'rgb(140 141 217)' }}>Typo Tester</h1>
      <ModeSelection onSelectMode={handleModeSelection} />
      <div className="mb-8">
        <Timer
          startCounting={startCounting}
          correctWords={correctWordArray.filter(Boolean).length}
          remainingTime={remainingTime}
          totalWordsAttempted={totalWordsAttempted}
          timeElapsed={timeElapsed}
          setTimeElapsed={setTimeElapsed}
        />
      </div>

      <p className="text-2xl mb-8 my-6 px-2 text-left tracking-wide "style={{ color: 'rgb(165 184 220)' }}>
        {cloud.current.map((word, index) => (
          <Word key={index} text={word} active={index === activeWordIndex} correct={correctWordArray[index]} />
        ))}
      </p>
      <input
        className="w-full px-2 py-1  border-gray-300 rounded text-lg text-blue-200 mb-4"
        placeholder="Start typing..."
        type="text"
        value={userInput}
        onChange={(e) => processInput(e.target.value)}
        // autoFocus={false}
      />
      <div className='flex-none my-4 '>
        <RestartButton onClick={handleRestart} />
        <ReloadButton onClick={handleReloadWords} />
      </div>

      <div className="w-1/4 rounded bg-gray-500 p-4">
        <h2 className="text-black  mb-2">Room Users :</h2>
        <ul>{roomUsers.map((user, index) => (
            <li key={index} className="mb-1">{`${index + 1}. ${
              number.username
            }`}</li>
          ))}
        </ul>
      </div>

      <div className="flex-none my-4">
        <button onClick={handleRoomCreation}>Create Room</button>
        &nbsp;&nbsp; Rm-Id: {roomId} &nbsp;&nbsp;
        {<button onClick={handleRoomJoin}>join Room</button>}
        &nbsp;&nbsp;
      </div>
      <button
        onClick={handleDisconnect}
        className="my-4 text-black font-bold py-0 px-1  rounded bg-red-500"
      >
        Disconnect
      </button>

      <Footer/>
    </div>
  );
}

// Make an API request TEST
async function fetchData() {
  try {
    const response = await axios.get("https://chocolate-dhole-ring.cyclic.app/");
    console.log(response.data);
    // Handle the data as needed in your frontend
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default App;
