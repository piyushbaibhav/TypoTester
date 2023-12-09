import React, { useRef, useState } from 'react'

import './App.css'

const getCloud = () => `coding piyush react nextjs mongodb frontend backend cloud devops faang placement javascript gate happy wood world blanket house car`.split(' ')
// .sort(()=> Math.random()>0.5?1:-1)

function Word(props){

  const {text, active, correct }= props

  if(correct===true){
    return <span className='font-bold text-green-500 bg-black' >{text} </span>
  }
  if(correct===false){
    return <span className='font-bold text-red-500 bg-black' >{text} </span>
  }

  if(active){
    return <span className='font-bold' >{text} </span>
  }


  return <span>{text} </span>
}
Word=React.memo(Word)

function App() {

  const[userInput, setUserInput]=useState('')
  const cloud = useRef(getCloud())
  const [activeWordIndex, setactiveWordIndex]=useState(0)
  const [correctWordArray, setCorrectWordArray]=useState([])

  function processInput(value){
    //add validation for the quiz end
    // add word count and timer
    if (value.endsWith(' ')){
      setactiveWordIndex(index=>index+1)
      setUserInput('')

      
      //corect word
      setCorrectWordArray(data=>{
          const word = value.trim()
          const newResult=[...data]
          newResult[activeWordIndex]=word===cloud.current[activeWordIndex]
          return newResult
        })
      
    }else{
      setUserInput(value)
    }
  }
  

  return (
    <div>
      <h1>typing test</h1>

      <p>{cloud.current.map((word, index)=>{
        return <Word 
                text = {word}
                active={index===activeWordIndex}
                correct={correctWordArray[index]}
                />
      
      
      
      })} </p>

      <input 
        type="text" 
        value={userInput} 
        onChange={(e) => processInput(e.target.value)
      } />
    </div>
  )
}

export default App
