// App.js
import React, { useRef, useState } from 'react';
import Word from './components/Word'; // Import the Word component
import Timer from './components/Timer'; // Import the Timer component
import './App.css';

const getCloud = () =>
  `coding piyush react nextjs mongodb frontend backend cloud devops faang placement javascript gate happy wood world blanket house car`.split(' ');

function App() {
  const [userInput, setUserInput] = useState('');
  const cloud = useRef(getCloud());
  const [activeWordIndex, setactiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);

  function processInput(value) {
    if (value.endsWith(' ')) {
      setactiveWordIndex((index) => index + 1);
      setUserInput('');

      setCorrectWordArray((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[activeWordIndex] = word === cloud.current[activeWordIndex];
        return newResult;
      });
    } else {
      setUserInput(value);
    }
  }

  return (
    <div>
      <h1>typing test</h1>
      <Timer />

      <p>
        {cloud.current.map((word, index) => (
          <Word key={index} text={word} active={index === activeWordIndex} correct={correctWordArray[index]} />
        ))}
      </p>

      <input type='text' value={userInput} onChange={(e) => processInput(e.target.value)} />
    </div>
  );
}

export default App;
