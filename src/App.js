import { useState, useRef, useEffect } from 'react';

import './App.css';
import King from './components/Pieces/King';
import Queen from './components/Pieces/Queen';
import moveSfx from './moveSfx.wav';

function App() {
  const [count, setCount] = useState(0);
  const [box, setBox] = useState(0);
  const [hold, setHold] = useState(false);
  const [left, setLeft] = useState({});
  const [top, setTop] = useState({});
  const [initial, setInitial] = useState({});
  const [final, setFinal] = useState([0, 0]);
  const [piece, setPiece] = useState({});

  const boardRef = useRef();
  const piecesRef = useRef();
  const moveSoundRef = useRef();

  useEffect(() => {
    const arrangePieces = () => {
      const pieces = [...piecesRef.current.children];
      pieces.forEach((piece) => {
        if (piece.className.includes('whiteKing')) {
          const square = boardRef.current.children[60];
          const { left: squareLeft, top: squareTop } =
            square.getBoundingClientRect();
          piece.style.left = squareLeft + 'px';
          piece.style.top = squareTop + 'px';
          piece.style.opacity = 1;
        }

        if (piece.className.includes('blackKing')) {
          const square = boardRef.current.children[4];
          const { left: squareLeft, top: squareTop } =
            square.getBoundingClientRect();
          piece.style.left = squareLeft + 'px';
          piece.style.top = squareTop + 'px';
          piece.style.opacity = 1;
        }

        if (piece.className.includes('whiteQueen')) {
          const square = boardRef.current.children[59];
          const { left: squareLeft, top: squareTop } =
            square.getBoundingClientRect();
          piece.style.left = squareLeft + 'px';
          piece.style.top = squareTop + 'px';
          piece.style.opacity = 1;
        }

        if (piece.className.includes('blackQueen')) {
          const square = boardRef.current.children[3];
          const { left: squareLeft, top: squareTop } =
            square.getBoundingClientRect();
          piece.style.left = squareLeft + 'px';
          piece.style.top = squareTop + 'px';
          piece.style.opacity = 1;
        }
      });
    };

    window.onload = () => {
      arrangePieces();

      window.addEventListener('resize', arrangePieces);
    };
  });

  const displayHint = (legalMoves, show) => {
    legalMoves
      .map((move) => {
        return move[0] * 8 - (8 - [move[1]]) - 1;
      })
      .forEach((index) => {
        boardRef.current.children[index].children[0].style.opacity = show;
      });
  };

  const checkMoves = (curPiece, curPosition) => {
    let movesArr = [];

    if (curPiece.includes('King')) {
      for (let y = curPosition[0] - 1; y <= curPosition[0] + 1; y++) {
        for (let x = curPosition[1] - 1; x <= curPosition[1] + 1; x++) {
          const possible = [y, x];
          let isEqual = false;

          if (y === curPosition[0] && x === curPosition[1]) {
            isEqual = true;
          }

          if (y >= 1 && y <= 8 && x >= 1 && x <= 8 && !isEqual) {
            movesArr.push(possible);
          }
        }
      }

      return movesArr;
    }

    if (curPiece.includes('Queen')) {
      let x, y;
      // DIAG -45deg
      y = curPosition[0] - 1;
      for (let x = curPosition[1] - 1; x > 0; x--) {
        if (y < 1) break;
        const possible = [y, x];
        movesArr.push(possible);
        y -= 1;
      }

      // DIAG +45deg
      y = curPosition[0] - 1;
      for (let x = curPosition[1] + 1; x <= 8; x++) {
        if (y < 1) break;
        const possible = [y, x];
        movesArr.push(possible);
        y -= 1;
      }

      // DIAG +135deg
      y = curPosition[0] + 1;
      for (let x = curPosition[1] + 1; x <= 8; x++) {
        if (y > 8) break;
        const possible = [y, x];
        movesArr.push(possible);
        y += 1;
      }

      // DIAG +225deg
      y = curPosition[0] + 1;
      for (let x = curPosition[1] - 1; x > 0; x--) {
        if (y > 8) break;
        const possible = [y, x];
        movesArr.push(possible);
        y += 1;
      }

      // VERT 0deg
      x = curPosition[1];
      for (let y = curPosition[0] - 1; y > 0; y--) {
        const possible = [y, x];
        movesArr.push(possible);
      }

      // VERT 180deg
      x = curPosition[1];
      for (let y = curPosition[0] + 1; y <= 8; y++) {
        const possible = [y, x];
        movesArr.push(possible);
      }

      // HOR 90deg
      y = curPosition[0];
      for (let x = curPosition[1] + 1; x <= 8; x++) {
        const possible = [y, x];
        movesArr.push(possible);
      }

      // HOR 270deg
      y = curPosition[0];
      for (let x = curPosition[1] - 1; x > 0; x--) {
        const possible = [y, x];
        movesArr.push(possible);
      }

      return movesArr;
    }

    // [5,4] => DIAG -45deg (-y -x) [4,3] [3,2] [2,1] VERT 0deg (+y x) 1 [4,4] [3,4] [2,4] [1,4]
    // [5,4] => DIAG +45deg (-y +x) [4,5] [3,6] [2,7] [1,8] HOR 90deg (y +x) [4,4] [3,4] [2,4] [1,4]

    // DIAG +135deg (+y +x)
    // VERT +180deg (+y x)
    // DIAG +225deg (+y -x)
    // HOR +270deg (-y x)
  };

  const getSquare = (e) => {
    const squaresArr = Array.from(boardRef.current.children);
    let element;

    squaresArr.forEach((square) => {
      const { left, width, height, top } = square.getBoundingClientRect();

      if (left < e.clientX && left + width > e.clientX) {
        if (top < e.clientY && top + height > e.clientY) {
          element = square;
        }
      }
    });

    return element;
  };

  const getCoords = (element, moment) => {
    const squaresArr = Array.from(boardRef.current.children);

    const index = squaresArr.findIndex((el) => el === element) + 1;

    const curPosition = [Math.ceil(index / 8), index % 8 || 8];

    if (moment) {
      setFinal(curPosition);
    } else {
      setInitial({
        position: curPosition,
        square: element,
      });
    }

    return curPosition;
  };

  const downHandler = (size, e, curPiece) => {
    setBox(size);
    setHold(true);

    const square = getSquare(e);
    const coords = getCoords(square, 0);
    const legalMoves = checkMoves(curPiece, coords);

    setPiece({
      name: curPiece,
      legalMoves,
      side: e.target.parentNode.className.includes('white') ? 'white' : 'black',
    });
  };

  const moveHandler = (e) => {
    setCount('coords: ' + e.clientX + ' ' + e.clientY);

    if (hold) {
      const objLeft = {};
      const objTop = {};

      objLeft[piece.name] = e.clientX - box / 2;
      objTop[piece.name] = e.clientY - box / 2;

      if (e.target.parentNode.className.includes(piece.name)) {
        e.target.parentNode.style.zIndex = 2;
      }

      setLeft(objLeft);
      setTop(objTop);

      // console.log(piece.legalMoves);
      if (piece.legalMoves) displayHint(piece.legalMoves, 1);

      const square = getSquare(e);
      getCoords(square, 1);

      setPiece({
        name: piece.name,
        legalMoves: checkMoves(piece.name, initial.position, 'moveCheck'),
        side: e.target.parentNode.className.includes('white')
          ? 'white'
          : 'black',
      });
    }
  };

  const takePiece = (square) => {
    const { left, top } = square.getBoundingClientRect();

    let ilegal = false;

    const pieces = [...piecesRef.current.children];

    pieces.forEach((el) => {
      const { left: elLeft, top: elTop } = el.getBoundingClientRect();

      if (el.className.includes(piece.name)) return;

      if (el.className.includes(piece.side)) {
        if (elLeft === left && elTop === top) {
          ilegal = true;
        }
      }

      if (elLeft === left && elTop === top && !ilegal) {
        el.style.display = 'none';
      }
    });

    return ilegal;
  };

  const makeMove = (finalSquare, targetPiece) => {
    const animationTime = 100;

    targetPiece.parentNode.style.transition = 'all ' + animationTime + 'ms';

    setTimeout(() => {
      targetPiece.parentNode.style.transition = 'none';
    }, animationTime);

    const ilegal = takePiece(finalSquare);

    if (ilegal) {
      const { left, top } = initial.square.getBoundingClientRect();
      targetPiece.parentNode.style.left = left + 'px';
      targetPiece.parentNode.style.top = top + 'px';
    } else {
      const { left, top } = finalSquare.getBoundingClientRect();
      targetPiece.parentNode.style.left = left + 'px';
      targetPiece.parentNode.style.top = top + 'px';
      moveSoundRef.current.playbackRate = 3.5;
      moveSoundRef.current.play();
    }
  };

  const upHandler = (e) => {
    if (!hold) return;
    setHold(false);

    e.target.parentNode.style.zIndex = 1;

    displayHint(piece.legalMoves, 0);

    const legalIndex = piece.legalMoves.findIndex((legalMove) => {
      return legalMove[0] === final[0] && legalMove[1] === final[1];
    });

    if (legalIndex === -1) {
      makeMove(initial.square, e.target);
      return;
    }

    const square = getSquare(e);

    makeMove(square, e.target);

    const coords = getCoords(square, 0);

    setPiece({
      name: piece.name,
      legalMoves: checkMoves(coords),
      side: e.target.parentNode.className.includes('white') ? 'white' : 'black',
    });
  };

  const createSquares = () => {
    let arr = [];

    for (let k = 0; k < 8; k++) {
      for (let i = 0; i < 8; i++) {
        if (k % 2 === 0) {
          if (i % 2 === 0) {
            arr.push(
              <div key={k + 1.22 * i} className='square light'>
                <div className='dot'></div>
              </div>
            );
          } else {
            arr.push(
              <div key={k + 3.11 * i} className='square dark'>
                <div className='dot'></div>
              </div>
            );
          }
        } else {
          if (i % 2 !== 0) {
            arr.push(
              <div key={k + 3.633 * i} className='square light'>
                <div className='dot'></div>
              </div>
            );
          } else {
            arr.push(
              <div key={k + 3.33 * i} className='square dark'>
                <div className='dot'></div>
              </div>
            );
          }
        }
      }
    }
    return arr;
  };

  return (
    <div onMouseMove={moveHandler} onMouseUp={upHandler} className='App'>
      <audio ref={moveSoundRef} src={moveSfx}></audio>
      <h1 className='noselect'>{count}</h1>
      <h3>
        piece: {piece.name || 'none'} initial: legalMoves: {piece.legalMoves}{' '}
        final: {`${final[0]}, ${final[1]}`}
      </h3>
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
      <div ref={piecesRef}>
        <King
          side='white'
          hold={hold}
          left={left.whiteKing}
          top={top.whiteKing}
          onClickDown={downHandler}
        />
        <King
          side='black'
          hold={hold}
          left={left.blackKing}
          top={top.blackKing}
          onClickDown={downHandler}
        />
        <Queen
          side='black'
          hold={hold}
          left={left.blackQueen}
          top={top.blackQueen}
          onClickDown={downHandler}
        />

        <Queen
          side='white'
          hold={hold}
          left={left.whiteQueen}
          top={top.whiteQueen}
          onClickDown={downHandler}
        />
      </div>
    </div>
  );
}

export default App;
