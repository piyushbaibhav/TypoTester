
import React, { useEffect, useState } from 'react';

function Timer(props) {
    const {correctWords,startCounting}=props
    const [timeElapsed, setTimeElapsed] = useState(0)
    useEffect(()=>{
        if(startCounting){
            setInterval(()=>{
                setTimeElapsed(oldTime=>oldTime+1)
            },1000)
        }

    },[startCounting])
  
  const minutes= timeElapsed/60
  return <div>
             <p>Time: {timeElapsed} </p>
             <p>Speed: {((correctWords/minutes) || 0).toFixed(2)} WPM </p>
         </div>
}

export default Timer;
