import { useState, useRef } from 'react';

import './App.css';
import King from './components/Pieces/King';

function App() {
  const [count, setCount] = useState(0);
  const [box, setBox] = useState(0);
  const [hold, setHold] = useState(false);
  const [left, setLeft] = useState(window.screen.width / 2.15);
  const [top, setTop] = useState(window.screen.height / 2.6);

  const boardRef = useRef();

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
    if (!hold) return;

    setHold(false);

    const squaresArr = Array.from(boardRef.current.children);

    squaresArr.forEach((square) => {
      const { left, width, height, top } = square.getBoundingClientRect();

      if (left < e.clientX && left + width > e.clientX) {
        if (top < e.clientY && top + height > e.clientY) {
          if (square.className.includes('dark')) {
            square.style.backgroundColor = 'rgba(85, 235, 52, 0.9)';
          } else {
            square.style.backgroundColor = 'rgba(85, 235, 52, 0.45)';
          }
        }
      }
    });

    // console.log(boardRef.current.children[0].getBoundingClientRect());
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
      <King hold={hold} left={left} top={top} onClickDown={downHandler} />
      <div className='board-container'>
        <div style={{ flexDirection: 'row' }} className='upper-coords'>
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
          <div
            style={{ flexDirection: 'column-reverse' }}
            className='side-coords'
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
          <div ref={boardRef} className='board'>
            {createSquares()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
