
import React, { useRef, useState, useEffect } from 'react';
import Word from './components/Word';
import Timer from './components/Timer';
import ModeSelection from './components/ModeSelection';
import './App.css';
import { generate } from 'random-words';

const getCloud = (count = 40) => {
  const words = generate({ exactly: count, join: ' ' });
  return words.split(' ');
};

function App() {
  const [userInput, setUserInput] = useState('');
  const cloud = useRef(getCloud());
  const [startCounting, setStartCounting] = useState(false);
  const [activeWordIndex, setactiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);
  const [selectedMode, setSelectedMode] = useState(15);
  const [remainingTime, setRemainingTime] = useState(selectedMode);

  useEffect(() => {
    let timer;

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
    } else {
      setUserInput(value);
    }
  };

  const handleModeSelection = (mode) => {
    setSelectedMode(mode);
    setRemainingTime(mode);
    setStartCounting(false); // Reset the counting when mode changes
  };

  return (
    <div className="flex flex-col  items-center h-screen">
      <h1 className="text-4xl font-bold mb-4 pb-11">Typing Test</h1>
      <ModeSelection onSelectMode={handleModeSelection} />
      <div className="mb-4">
        <Timer startCounting={startCounting} correctWords={correctWordArray.filter(Boolean).length} remainingTime={remainingTime} />
      </div>
      <p className="text-lg mb-4">
        {cloud.current.map((word, index) => (
          <Word key={index} text={word} active={index === activeWordIndex} correct={correctWordArray[index]} />
        ))}
      </p>
      <input
        className="w-full px-2 py-1 border-gray-300 rounded text-lg"
        placeholder="Start typing..."
        type="text"
        value={userInput}
        onChange={(e) => processInput(e.target.value)}
      />
    </div>
  );
}

export default App;
