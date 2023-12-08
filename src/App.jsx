import { useRef, useState } from 'react'

import './App.css'

const getCloud = () => `coding piyush react nextjs mongodb frontend backend cloud devops faang placement javascript gate happy wood world blanket house car`.split(' ').sort(()=> Math.random()>0.5?1:-1)

function App() {

  const[userInput, setUserInput]=useState('')
  const cloud = useRef(getCloud())
  

  return (
    <div>
      <h1>typing test</h1>

      <p>{cloud.current.join(' ')} </p>

      <input 
        type="text" 
        value={userInput} onChange={(e) => setUserInput(e.target.value)
      } />
    </div>
  )
}

export default App
