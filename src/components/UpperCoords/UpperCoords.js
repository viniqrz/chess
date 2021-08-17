import React from 'react';

const UpperCoords = (props) => {
  const direction = props.side === 'white' ? 'row' : 'row-reverse';

  return (
    <div
      style={{ flexDirection: direction, }}
      className="upper-coords"
    >
      <p>A</p>
      <p>B</p>
      <p>C</p>
      <p>D</p>
      <p>E</p>
      <p>F</p>
      <p>G</p>
      <p>H</p>
    </div>
  );
}

export default UpperCoords;