
import React, { useEffect, useState } from 'react';

function Timer(props) {
    const [timeElapsed, setTimeElapsed] = useState(0)
    useEffect(()=>{
        if(props.startCounting){
            setInterval(()=>{
                setTimeElapsed(oldTime=>oldTime+1)
            },1000)
        }

    },[props.startCounting])
  

  return <div>
             <p>Time: {timeElapsed} </p>
             <p>Speed: {} </p>
         </div>
}

export default Timer;
