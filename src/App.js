import { useState, useRef } from 'react';

import './App.css';
import King from './components/Pieces/King';

function App() {
  const [count, setCount] = useState(0);
  const [box, setBox] = useState(0);
  const [hold, setHold] = useState(false);
  const [left, setLeft] = useState(window.screen.width / 2.15);
  const [top, setTop] = useState(window.screen.height / 2.6);

  const boxRef = useRef();

  const downHandler = (size) => {
    setBox(size);
    setHold(true);
  };

  const moveHandler = (e) => {
    setCount('coords: ' + e.clientX + ' ' + e.clientY);

    if (hold) {
      setLeft(e.clientX - box / 2);
      setTop(e.clientY - box / 2);
    }
  };

  const upHandler = (e) => {
    setHold(false);
  };

  const createSquares = () => {
    let arr = [];

    for (let k = 0; k < 8; k++) {
      for (let i = 0; i < 8; i++) {
        if (k % 2 === 0) {
          if (i % 2 === 0) {
            arr.push(<div className='square light'></div>);
          } else {
            arr.push(<div className='square dark'></div>);
          }
        } else {
          if (i % 2 !== 0) {
            arr.push(<div className='square light'></div>);
          } else {
            arr.push(<div className='square dark'></div>);
          }
        }
      }
    }
    return arr;
  };

  return (
    <div onMouseMove={moveHandler} onMouseUp={upHandler} className='App'>
      <h1 className='noselect'>{count}</h1>
      {/* <h1 className='noselect'>{hold ? 'true' : 'false'}</h1> */}
      <King
        hold={hold}
        left={left}
        top={top}
        ref={boxRef}
        onClickDown={downHandler}
      />
      <div className='board-container'>
        <div className='upper-coords'>
          <p>A</p>
          <p>B</p>
          <p>C</p>
          <p>D</p>
          <p>E</p>
          <p>F</p>
          <p>G</p>
          <p>H</p>
        </div>
        <div className='inner-container'>
          <div className='side-coords'>
            <p>A</p>
            <p>B</p>
            <p>C</p>
            <p>D</p>
            <p>E</p>
            <p>F</p>
            <p>G</p>
            <p>H</p>
          </div>
          <div className='board'>{createSquares()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
