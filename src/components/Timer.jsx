import React, { useEffect, useState } from 'react';

function Timer(props) {
  const { correctWords, startCounting, remainingTime, totalWordsAttempted,setTimeElapsed,timeElapsed } = props;

  useEffect(() => {
    let id;

    if (startCounting && remainingTime > 0) {
      id = setInterval(() => {
        setTimeElapsed((oldTime) => oldTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(id);
    };
  }, [startCounting, remainingTime]);

  const minutes = timeElapsed / 60;
  const wordsPerMinute = (minutes > 0 ? correctWords / minutes : 0);
  const accuracy = (correctWords / totalWordsAttempted) * 100 || 0;

  return (
    <div>
      <p className='font-medium'>
        <b className='text-xl'>Time:</b> {remainingTime}
      </p>
      <p className='font-medium'>
        <b className='text-xl'>Speed:</b> {wordsPerMinute.toFixed(2)} WPM &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <b className='text-xl'>Accuracy:</b> {accuracy.toFixed(2)}%
      </p>
      </div>
  );
}

export default Timer;
