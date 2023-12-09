
import React, { useRef, useState } from 'react';
import Word from './components/Word'; 
import Timer from './components/Timer'; 
import './App.css';

const getCloud = () =>
  `coding piyush react nextjs mongodb frontend backend cloud devops faang placement javascript gate happy wood world blanket house car`.split(' ');

function App() {
  const [userInput, setUserInput] = useState('');
  const cloud = useRef(getCloud());
  const [startCounting, setstartCounting] = useState(false)
  const [activeWordIndex, setactiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);

  function processInput(value) {

    if(!startCounting){
      setstartCounting(true)
    }
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
      <Timer
        startCounting={startCounting}
      />

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
