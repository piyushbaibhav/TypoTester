
import React, { useRef, useState } from 'react';
import Word from './components/Word'; 
import Timer from './components/Timer'; 
import './App.css';
import { generate, count } from "random-words";



// const getCloud = () =>
//   `coding piyush react nextjs mongodb frontend backend cloud devops faang placement javascript gate happy wood world blanket house car`.split(' ').sort(()=> Math.random()>0.5?1:-1)
const getCloud = (count = 40) => {
  const words = generate({ exactly: count, join: ' ' });
  return words.split(' ');
};

function App() {
  const [userInput, setUserInput] = useState('');
  const cloud = useRef(getCloud());
  const [startCounting, setstartCounting] = useState(false)
  const [activeWordIndex, setactiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);


  function processInput(value) {

    
    if(activeWordIndex===cloud.current.length){
      //stop
      return
    }
    if(!startCounting){
      setstartCounting(true)
    }
    if (value.endsWith(' ')) {
      if(activeWordIndex===cloud.current.length-1){
        setstartCounting(false)
        setUserInput('Completed')
        
      }else{
        setUserInput('')
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
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <h1 className='text-2xl'>typing test</h1>
      <div className='mb-4'>
        <Timer
          startCounting={startCounting}
          correctWords={correctWordArray.filter(Boolean).length}
        />
      </div>
      <p className='text-lg mb-4'>
        {cloud.current.map((word, index) => (
          <Word key={index} text={word} active={index === activeWordIndex} correct={correctWordArray[index]} />
        ))}
      </p>

      <input 
      className='w-full px-2 py-1 border-gray-300 rounded text-lg'
      placeholder="Start typing..." 
      type='text' 
      value={userInput} 
      onChange={(e) => processInput(e.target.value)}
      />
    </div>
  );
}

export default App;
