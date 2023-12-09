
import React from 'react';

function Word(props) {
  const { text, active, correct } = props;
  const styles = {
    // fontWeight: correct ? 'bold' : 'normal',
    // color: correct ? 'green' : 'red',
    textDecoration: active ? 'underline' : 'none', // Add underline style when active
  };

  if (correct === true) {
    return <span className='font-bold text-green-500 '>{text} </span>;
  }
  if (correct === false) {
    return <span className='font-bold text-red-500 '>{text} </span>;
  }

  if (active) {
    return <span style={styles}>{text} </span>;
  }

  return <span>{text} </span>;
}

export default React.memo(Word);
