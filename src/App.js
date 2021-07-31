import { useState, useRef, useEffect } from 'react';

import './App.css';

import moveSfx from './moveSfx.wav';
import getInitialMap from './getInitialMap';

import King from './components/Pieces/King';
import Queen from './components/Pieces/Queen';
import Bishop from './components/Pieces/Bishop';
import Knight from './components/Pieces/Knight';
import Rook from './components/Pieces/Rook';

function App() {
  const [count, setCount] = useState(0);
  const [pieceBox, setPieceBox] = useState(0);
  const [hold, setHold] = useState(false);
  const [left, setLeft] = useState({});
  const [top, setTop] = useState({});
  const [initial, setInitial] = useState({});
  const [final, setFinal] = useState([0, 0]);
  const [piece, setPiece] = useState({});
  const [map, setMap] = useState(getInitialMap('white'));

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

        if (piece.className.includes('whiteBishop')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          const square = boardRef.current.children[pieceIndexEqualsToOne ? 61 : 58];
          const { left: squareLeft, top: squareTop } =
            square.getBoundingClientRect();
          piece.style.left = squareLeft + 'px';
          piece.style.top = squareTop + 'px';
          piece.style.opacity = 1;
        }

        if (piece.className.includes('blackBishop')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          const square = boardRef.current.children[pieceIndexEqualsToOne ? 5 : 2];
          const { left: squareLeft, top: squareTop } =
            square.getBoundingClientRect();
          piece.style.left = squareLeft + 'px';
          piece.style.top = squareTop + 'px';
          piece.style.opacity = 1;
        }

        if (piece.className.includes('blackKnight')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          const square = boardRef.current.children[pieceIndexEqualsToOne ? 6 : 1];
          const { left: squareLeft, top: squareTop } =
            square.getBoundingClientRect();
          piece.style.left = squareLeft + 'px';
          piece.style.top = squareTop + 'px';
          piece.style.opacity = 1;
        }

        if (piece.className.includes('whiteKnight')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          const square = boardRef.current.children[pieceIndexEqualsToOne ? 62 : 57];
          const { left: squareLeft, top: squareTop } =
            square.getBoundingClientRect();
          piece.style.left = squareLeft + 'px';
          piece.style.top = squareTop + 'px';
          piece.style.opacity = 1;
        }

        if (piece.className.includes('blackRook')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          const square = boardRef.current.children[pieceIndexEqualsToOne ? 7 : 0];
          const { left: squareLeft, top: squareTop } =
            square.getBoundingClientRect();
          piece.style.left = squareLeft + 'px';
          piece.style.top = squareTop + 'px';
          piece.style.opacity = 1;
        }
  
        if (piece.className.includes('whiteRook')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          const square = boardRef.current.children[pieceIndexEqualsToOne ? 63 : 56];
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

  const arrayToIndex = (y, x) => {
    return y * 8 - (8 - [x]) - 1;
  }

  const displayHint = (legalMoves, show) => {
    legalMoves
      .map((move) => {
        return arrayToIndex(move[0], move[1]);
      })
      .forEach((index) => {
        boardRef.current.children[index].children[0].style.opacity = show;
      });
  };

  const getLegalMoves = (curPiece, curPosition) => {
    let movesArr = [];
 
    const getLine0deg = (init, prevArr=null) => {
      let arr = [];
      let x = init[1];
      for (let y = init[0] - 1; y > 0; y--) {
        const possible = [y, x, '0'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
      }

      return prevArr || arr;
    }

    const getLine45deg = (init, prevArr=null) => {
      let arr = [];
      let y = init[0] - 1;
      for (let x = init[1] + 1; x <= 8; x++) {
        if (y < 1) break;
        const possible = [y, x, '45'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
        y -= 1;
      }

      return prevArr || arr;
    }

    const getLine90deg = (init, prevArr=null) => {
      let arr = [];
      let y = init[0];
      for (let x = init[1] + 1; x <= 8; x++) {
        const possible = [y, x, '90'];
        movesArr.push(possible);
      }

      return prevArr || arr;
    }

    const getLine135deg = (init, prevArr=null) => {
      let arr = [];
      let y = init[0] + 1;
      for (let x = init[1] + 1; x <= 8; x++) {
        if (y > 8) break;
        const possible = [y, x, '135'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
        y += 1;
      }

      return prevArr || arr;
    }

    const getLine180deg = (init, prevArr=null) => {
      let arr = [];
      let x = init[1];
      for (let y = init[0] + 1; y <= 8; y++) {
        const possible = [y, x, '180'];
        movesArr.push(possible);
        if (prevArr) prevArr.push(possible);
      }

      return prevArr || arr;
    }

    const getLine225deg = (init, prevArr=null) => {
      let arr = [];
      let y = init[0] + 1;
      for (let x = init[1] - 1; x > 0; x--) {
        if (y > 8) break;
        const possible = [y, x, '225'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
        y += 1;
      }

      return prevArr || arr;
    }

    const getLine270deg = (init, prevArr=null) => {
      let arr = [];
      let y = init[0];
      for (let x = init[1] - 1; x > 0; x--) {
        const possible = [y, x, '270'];
        movesArr.push(possible);
        if (prevArr) init.push(possible);
      }

      return prevArr || arr;
    }

    const getLine315deg = (init, prevArr=null) => {
      let arr = [];
      let y = init[0] - 1;
      for (let x = init[1] - 1; x > 0; x--) {
        if (y < 1) break;
        const possible = [y, x, '315'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
        y -= 1;
      }

      return prevArr || arr;
    }

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
      movesArr = getLine315deg(curPosition, movesArr); 
      movesArr = getLine45deg(curPosition, movesArr); 
      movesArr = getLine135deg(curPosition, movesArr); 
      movesArr = getLine225deg(curPosition, movesArr); 
      movesArr = getLine0deg(curPosition, movesArr); 
      movesArr = getLine180deg(curPosition, movesArr);
      movesArr = getLine90deg(curPosition, movesArr);
      movesArr = getLine270deg(curPosition, movesArr);

      return movesArr;
    }

    if (curPiece.includes('Bishop')) {
      movesArr = getLine315deg(curPosition, movesArr); 
      movesArr = getLine45deg(curPosition, movesArr); 
      movesArr = getLine135deg(curPosition, movesArr); 
      movesArr = getLine225deg(curPosition, movesArr); 

      return movesArr;
    }

    if (curPiece.includes('Knight')) {
      const y0 = curPosition[0];
      const x0 = curPosition[1];
      for (let y = y0 - 2; y < 9 && y <= y0 + 2; y += 4) {
        if (y < 1) continue;
        for (let x = x0 - 1; x < 9 && x <= x0 + 1; x += 2) {
          if (x < 1) continue;
          const possible = [y, x];
          movesArr.push(possible);
        }
      }

      for (let y = y0 - 1; y < 9; y += 2) {
        if (y < 1) continue;
        for (let x = x0 - 2; x < 9; x += 4) {
          if (x <= x0 + 2 && x > 0 && y <= y0 + 1) {
            const possible = [y, x];
            movesArr.push(possible);
          }
        }
      }
      return movesArr;
    }

    if (curPiece.includes('Rook')) {
      movesArr = getLine0deg(curPosition, movesArr); 
      movesArr = getLine90deg(curPosition, movesArr); 
      movesArr = getLine180deg(curPosition, movesArr); 
      movesArr = getLine270deg(curPosition, movesArr); 

      return movesArr;
    }
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

    if (moment && curPosition !== final) {
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
    setPieceBox(size);
    setHold(true);

    const square = getSquare(e);
    const coords = getCoords(square, 0);
    let legalMoves = getLegalMoves(curPiece, coords);

    if (
      curPiece.includes('Queen')
      || curPiece.includes('Rook')
      || curPiece.includes('Bishop')
    ) {
      legalMoves = checkPiecesAhead(legalMoves);
    }

    setPiece({
      name: curPiece,
      legalMoves,
      side: e.target.parentNode.className.includes('white') ? 'white' : 'black',
    });
  };

  const moveHandler = (e) => {
    if (hold) {
      const objLeft = {};
      const objTop = {};

      objLeft[piece.name] = e.clientX - pieceBox / 2;
      objTop[piece.name] = e.clientY - pieceBox / 2;

      setLeft(objLeft);
      setTop(objTop);

      if (e.target.parentNode.className.includes(piece.name.slice(0, -1))) {
        e.target.parentNode.style.zIndex = 2;
      }

      if (piece.legalMoves) {
        displayHint(piece.legalMoves, 1);
        const square = getSquare(e);
        getCoords(square, 1);
      } else {
        const legalMoves = piece.legalMoves || getLegalMoves(piece.name, initial.position, 'moveCheck');

        setPiece({
          name: piece.name,
          legalMoves,
          side: e.target.parentNode.className.includes('white')
            ? 'white'
            : 'black',
        });
      }
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

  const checkPiecesAhead = (initLegalMoves) => {
    const pieces = Array.from(piecesRef.current.children);
    const squares = Array.from(boardRef.current.children);
    let newArr = initLegalMoves;
    let cleanedLines = [];

    initLegalMoves.forEach((legalSquare) => {
      const index = arrayToIndex(legalSquare[0], legalSquare[1]);
      const { left, top } = squares[index].getBoundingClientRect();
      const foundCleanedLine = cleanedLines.find(el => el === legalSquare[2]); 

      if (foundCleanedLine === -1 || foundCleanedLine === undefined) {
        pieces.forEach((piece) => {
          const { left: pieceLeft, top: pieceTop } = piece.getBoundingClientRect();
          if (left === pieceLeft && top === pieceTop) {
            const legalIndex = newArr.findIndex(el => el[0] === legalSquare[0] && el[1] === legalSquare[1]);
            const filteredNewArr = newArr.filter((move, i) => {
              if (move[2] === legalSquare[2] && i > legalIndex) {
                cleanedLines.push(move[2]);
              }
              return !(move[2] === legalSquare[2] && i > legalIndex);
            });

            newArr = filteredNewArr;
          }
        });
      }
    });
    
    return newArr;
  }

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

      const newMap = { ...map };

      if (piece.name.includes('1') || piece.name.includes('0')) {
        const index = piece.name[piece.name.length-1] * 1;
        const name = piece.name.slice(0, -1);

        newMap[name][index].coords = final; 
      } else {
        newMap[piece.name].coords = final;
      }

      setMap(newMap);

      if (finalSquare !== initial.square) {
        moveSoundRef.current.playbackRate = 3;
        moveSoundRef.current.play();
      }
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
      legalMoves: getLegalMoves(coords),
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
    <div onMouseUp={upHandler} onMouseMove={moveHandler} className='App'>
      <audio ref={moveSoundRef} src={moveSfx}></audio>
      {/* <h1 className='noselect'>{count}</h1> */}
      <h3>
        {/* legalMoves: {piece.legalMoves}{' '} */}
        {/* final: {`${final[0]}, ${final[1]}`} */}
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
        <Bishop
          side='black'
          hold={hold}
          left={left.blackBishop0}
          top={top.blackBishop0}
          index={0}
          onClickDown={downHandler}
        />
        <Bishop
          side='black'
          hold={hold}
          left={left.blackBishop1}
          top={top.blackBishop1}
          index={1}
          onClickDown={downHandler}
        />
        <Bishop
          side='white'
          hold={hold}
          left={left.whiteBishop0}
          top={top.whiteBishop0}
          index={0}
          onClickDown={downHandler}
        />
        <Bishop
          side='white'
          hold={hold}
          left={left.whiteBishop1}
          top={top.whiteBishop1}
          index={1}
          onClickDown={downHandler}
        />
        <Knight
          side='white'
          hold={hold}
          left={left.whiteKnight0}
          top={top.whiteKnight0}
          index={0}
          onClickDown={downHandler}
        />
        <Knight
          side='white'
          hold={hold}
          left={left.whiteKnight1}
          top={top.whiteKnight1}
          index={1}
          onClickDown={downHandler}
        />
        <Knight
          side='black'
          hold={hold}
          left={left.blackKnight0}
          top={top.blackKnight0}
          index={0}
          onClickDown={downHandler}
        />
        <Knight
          side='black'
          hold={hold}
          left={left.blackKnight1}
          top={top.blackKnight1}
          index={1}
          onClickDown={downHandler}
        />
        <Rook
          side='black'
          hold={hold}
          left={left.blackRook0}
          top={top.blackRook0}
          index={0}
          onClickDown={downHandler}
        />
        <Rook
          side='black'
          hold={hold}
          left={left.blackRook1}
          top={top.blackRook1}
          index={1}
          onClickDown={downHandler}
        />
        <Rook
          side='white'
          hold={hold}
          left={left.whiteRook0}
          top={top.whiteRook0}
          index={0}
          onClickDown={downHandler}
        />
        <Rook
          side='white'
          hold={hold}
          left={left.whiteRook1}
          top={top.whiteRook1}
          index={1}
          onClickDown={downHandler}
        />
      </div>
    </div>
  );
}

export default App;
