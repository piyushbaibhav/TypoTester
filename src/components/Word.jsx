// Word.js
import React from 'react';

function Word(props) {
  const { text, active, correct } = props;

  if (correct === true) {
    return <span className='font-bold text-green-500 bg-black'>{text} </span>;
  }
  if (correct === false) {
    return <span className='font-bold text-red-500 bg-black'>{text} </span>;
  }

  if (active) {
    return <span className='font-bold'>{text} </span>;
  }

  return <span>{text} </span>;
}

export default React.memo(Word);
