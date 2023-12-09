import { useRef, useState } from 'react'

import './App.css'

const getCloud = () => `coding piyush react nextjs mongodb frontend backend cloud devops faang placement javascript gate happy wood world blanket house car`.split(' ')
// .sort(()=> Math.random()>0.5?1:-1)

function Word(props){

  const {text, active, correct }= props

  if(correct===true){
    return <span className='italic bg-green-400' >{text} </span>
  }
  if(correct===false){
    return <span className='italic text-lg bg-red-400' >{text} </span>
  }

  if(active){
    return <span className='italic bg-yellow-400' >{text} </span>
  }


  return <span>{text} </span>
}

function App() {

  const[userInput, setUserInput]=useState('')
  const cloud = useRef(getCloud())
  const [activeWordIndex, setactiveWordIndex]=useState(0)

  function processInput(value){
    if (value.endsWith(' ')){
      setactiveWordIndex(index=>index+1)
      setUserInput('')
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
                correct={null}
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
