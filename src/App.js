import { useState, useRef } from 'react';

import './App.css';
import king from './king.png';

function App() {
  const [count, setCount] = useState(0);
  const [box, setBox] = useState(0);
  const [hold, setHold] = useState(false);
  const [left, setLeft] = useState(window.screen.width / 2.15);
  const [top, setTop] = useState(window.screen.height / 2.6);

  console.log(window);

  const boxRef = useRef();

  const downHandler = (e) => {
    setBox(
      'box-coords: ' +
        boxRef.current.getBoundingClientRect().left +
        ' ' +
        boxRef.current.getBoundingClientRect().top
    );
    setHold(true);
  };

  const moveHandler = (e) => {
    setCount('coords: ' + e.clientX + ' ' + e.clientY);

    if (hold) {
      setLeft(e.clientX - boxRef.current.offsetWidth / 2);
      setTop(e.clientY - boxRef.current.offsetHeight / 2);
    }
  };

  const upHandler = (e) => {
    setHold(false);
  };

  return (
    <div onMouseMove={moveHandler} onMouseUp={upHandler} className='App'>
      <h1 className='noselect'>{count}</h1>
      <h1 className='noselect'>{box}</h1>
      <h1 className='noselect'>{hold ? 'true' : 'false'}</h1>
      <div
        style={{
          cursor: hold ? 'grabbing' : 'grab',
          left: left + 'px',
          top: top + 'px',
        }}
        ref={boxRef}
        onMouseDown={downHandler}
        className='box'
      >
        <img draggable='false' src={king} alt='' />
      </div>
    </div>
  );
}

export default App;
