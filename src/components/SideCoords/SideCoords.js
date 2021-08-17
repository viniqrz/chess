import React from 'react';

const SideCoords = (props) => {
  const direction = props.side === 'white' ? 'column-reverse' : 'column';

  return (
    <div
      style={{ flexDirection: direction, }}
      className="side-coords"
    >
      <p>1</p>
      <p>2</p>
      <p>3</p>
      <p>4</p>
      <p>5</p>
      <p>6</p>
      <p>7</p>
      <p>8</p>
    </div>
  );
}

export default SideCoords;