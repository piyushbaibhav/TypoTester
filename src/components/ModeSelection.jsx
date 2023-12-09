
import React from 'react';

function ModeSelection({ onSelectMode }) {
  const modes = [15, 30, 60, 90];

  return (
    <div>
      <p>Select Mode:</p>
      <select onChange={(e) => onSelectMode(parseInt(e.target.value))}>
        {modes.map((mode) => (
          <option key={mode} value={mode}>
            {mode} seconds
          </option>
        ))}
      </select>
    </div>
  );
}

export default ModeSelection;
