import { useState, useRef, useEffect } from 'react';

import './App.css';
import King from './components/Pieces/King';

function App() {
  const [count, setCount] = useState(0);
  const [box, setBox] = useState(0);
  const [hold, setHold] = useState(false);
  const [left, setLeft] = useState(window.screen.width / 2.15);
  const [top, setTop] = useState(window.screen.height / 2.6);
  const [initial, setInitial] = useState([0, 0]);
  const [final, setFinal] = useState([0, 0]);
  const [piece, setPiece] = useState('none');

  const boardRef = useRef();

  const checkMoves = (curPosition) => {
    if (piece === 'king') {
      let movesArr = [];

      for (let y = curPosition[0] - 1; y <= curPosition[0] + 1; y++) {
        for (let x = curPosition[1] - 1; x <= curPosition[1] + 1; x++) {
          const possible = [y, x];
          let isEqual = false;

          if (y === curPosition[0] && x === curPosition[1]) {
            isEqual = true;
          }

          if (y >= 1 && x >= 1 && !isEqual) movesArr.push(possible);
        }
      }

      console.log(movesArr);

      // for (let y = 1; y <= 8; y++) {
      //   for (let x = 1; x <= 8; x++) {
      // [2, 2] => [1,1] [1,2] [1,3] [2,1] [2,3] [3,1] [3,2] [3,3]
      // [3,6] => [2,5] [2,6] [2,7] [3,5] [3,7] [4,5] [4,6] [4,7]
      // [5,3] => [4,2] [4,3] [4,4] [5,2] [5,4] [6,2] [6,3] [6,4]
      // CENTER
      // [y,x] => [y-1,x-1] [y-1,x] [y-1,x+1] [y,x-1] [y,+1] [y+1,x-1] [y+!,x] [y+1,x+1]
      //CORNER
      // [1,1] => [1, 2], [2,1], [2,2]
      // [8,8] => [7,7], [7,8], [8,7]
      // [4,1] => [3,1], [3, 2], [4,2], [5,1], [5,2]
      //     }
      //   }
    }
  };

  const getSquare = (e) => {
    const squaresArr = Array.from(boardRef.current.children);
    let element;

    squaresArr.forEach((square) => {
      const { left, width, height, top } = square.getBoundingClientRect();

      if (left < e.clientX && left + width > e.clientX) {
        if (top < e.clientY && top + height > e.clientY) {
          if (square.className.includes('dark')) {
            // square.style.backgroundColor = 'rgba(85, 235, 52, 0.9)';
          } else {
            // square.style.backgroundColor = 'rgba(85, 235, 52, 0.45)';
          }

          element = square;
        }
      }
    });

    return element;
  };

  const getCoords = (element, moment) => {
    const squaresArr = Array.from(boardRef.current.children);

    const index = squaresArr.findIndex((el) => el === element) + 1;

    const curPosition = [Math.ceil(index / 8), index % 8];

    if (moment) {
      setFinal(curPosition);
    } else {
      setInitial(curPosition);
    }

    return curPosition;
  };

  const downHandler = (size, e, curPiece) => {
    setBox(size);
    setHold(true);

    const square = getSquare(e);
    const coords = getCoords(square, 0);
    checkMoves(coords);
    setPiece(curPiece);
  };

  const moveHandler = (e) => {
    setCount('coords: ' + e.clientX + ' ' + e.clientY);

    if (hold) {
      setLeft(e.clientX - box / 2);
      setTop(e.clientY - box / 2);

      const square = getSquare(e);
      const coords = getCoords(square, 1);
      // checkMoves(coords);
    }
  };

  const upHandler = (e) => {
    if (!hold) return;

    setHold(false);
  };

  const createSquares = () => {
    let arr = [];

    for (let k = 0; k < 8; k++) {
      for (let i = 0; i < 8; i++) {
        if (k % 2 === 0) {
          if (i % 2 === 0) {
            arr.push(<div key={k + 1.22 * i} className='square light'></div>);
          } else {
            arr.push(<div key={k + 3.11 * i} className='square dark'></div>);
          }
        } else {
          if (i % 2 !== 0) {
            arr.push(<div key={k + 3.633 * i} className='square light'></div>);
          } else {
            arr.push(<div key={k + 3.33 * i} className='square dark'></div>);
          }
        }
      }
    }
    return arr;
  };

  return (
    <div onMouseMove={moveHandler} onMouseUp={upHandler} className='App'>
      <h1 className='noselect'>{count}</h1>
      <h3>
        piece: {piece} initial: {`${initial[0]}, ${initial[1]}`} final:{' '}
        {`${final[0]}, ${final[1]}`}
      </h3>
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
