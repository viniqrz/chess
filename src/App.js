import { useState, useRef, useEffect } from 'react';

import './App.css';

import moveSfx from './sfx/moveSfx.wav';
import getInitialMap from './getInitialMap';

import usePieces from './hooks/use-pieces';
import useLegalMoves from './hooks/use-legal-moves';

import Pieces from './components/Pieces.js';
import King from './components/Pieces/King';
import Queen from './components/Pieces/Queen';
import Bishop from './components/Pieces/Bishop';
import Knight from './components/Pieces/Knight';
import Rook from './components/Pieces/Rook';

function App() {
  const [pieceBox, setPieceBox] = useState(0);
  const [hold, setHold] = useState(false);
  const [left, setLeft] = useState({});
  const [top, setTop] = useState({});
  const [initial, setInitial] = useState({});
  const [final, setFinal] = useState([0, 0]);
  const [piece, setPiece] = useState({});
  const [map, setMap] = useState(getInitialMap('white'));
  const [pieces, setPieces] = useState();

  const boardRef = useRef();
  const piecesRef = useRef();
  const moveSoundRef = useRef();

  const getLegalMoves = useLegalMoves();

  usePieces(boardRef, piecesRef);

  const getPieces = (piecesNode) => {
    setPieces(piecesNode);
  };

  const arrayToIndex = (y, x) => {
    return y * 8 - (8 - [x]) - 1;
  };

  const displayHint = (legalMoves, show) => {
    legalMoves
      .map((move) => {
        return arrayToIndex(move[0], move[1]);
      })
      .forEach((index) => {
        boardRef.current.children[index].children[0].style.opacity = show;
      });
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
      curPiece.includes('Queen') ||
      curPiece.includes('Rook') ||
      curPiece.includes('Bishop')
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
        const legalMoves =
          piece.legalMoves ||
          getLegalMoves(piece.name, initial.position, 'moveCheck');

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
      const foundCleanedLine = cleanedLines.find((el) => el === legalSquare[2]);

      if (foundCleanedLine === -1 || foundCleanedLine === undefined) {
        pieces.forEach((piece) => {
          const { left: pieceLeft, top: pieceTop } =
            piece.getBoundingClientRect();
          if (left === pieceLeft && top === pieceTop) {
            const legalIndex = newArr.findIndex(
              (el) => el[0] === legalSquare[0] && el[1] === legalSquare[1]
            );
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

      const newMap = { ...map };

      if (piece.name.includes('1') || piece.name.includes('0')) {
        const index = piece.name[piece.name.length - 1] * 1;
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

    setPiece({
      name: piece.name,
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
              <div key={k + 1.22 * i} className="square light">
                <div className="dot"></div>
              </div>
            );
          } else {
            arr.push(
              <div key={k + 3.11 * i} className="square dark">
                <div className="dot"></div>
              </div>
            );
          }
        } else {
          if (i % 2 !== 0) {
            arr.push(
              <div key={k + 3.633 * i} className="square light">
                <div className="dot"></div>
              </div>
            );
          } else {
            arr.push(
              <div key={k + 3.33 * i} className="square dark">
                <div className="dot"></div>
              </div>
            );
          }
        }
      }
    }
    return arr;
  };

  return (
    <div onMouseUp={upHandler} onMouseMove={moveHandler} className="App">
      <audio ref={moveSoundRef} src={moveSfx}></audio>
      <div className="board-container">
        <div style={{ flexDirection: 'row' }} className="upper-coords">
          <p>A</p>
          <p>B</p>
          <p>C</p>
          <p>D</p>
          <p>E</p>
          <p>F</p>
          <p>G</p>
          <p>H</p>
        </div>
        <div className="inner-container">
          <div
            style={{ flexDirection: 'column-reverse' }}
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
          <div ref={boardRef} className="board">
            {createSquares()}
          </div>
        </div>
      </div>
      <div ref={piecesRef}>
        <Pieces hold={hold} left={left} top={top} onClickDown={downHandler} />
      </div>
    </div>
  );
}

export default App;
