import { useState, useRef } from 'react';

import './Board.css';

import moveSfx from './../../sfx/moveSfx.wav';
import getInitialMap from './../../getInitialMap';

import useSquares from './../../hooks/use-squares';
import usePieces from './../../hooks/use-pieces';
import useLegalMoves from './../../hooks/use-legal-moves';

import Pieces from './../Pieces/Pieces.js';

function Board(props) {
  const [pieceBox, setPieceBox] = useState(0);
  const [hold, setHold] = useState(false);
  const [left, setLeft] = useState({});
  const [top, setTop] = useState({});
  const [initial, setInitial] = useState({});
  const [final, setFinal] = useState([0, 0]);
  const [piece, setPiece] = useState({});
  const [map, setMap] = useState(getInitialMap(props.side));
  const [isChecked, setIsChecked] = useState(false);

  const boardRef = useRef();
  const piecesRef = useRef();
  const moveSoundRef = useRef();

  const squares = useSquares();

  const getLegalMoves = useLegalMoves();

  usePieces(boardRef, piecesRef);

  const arrayToIndex = (y, x) => {
    return y * 8 - (8 - [x]) - 1;
  };

  const clearBloom = () => {
    const allyKing = [...piecesRef.current.children].find((el) =>
      el.className.includes(props.side + 'King')
    );

    allyKing.style.background =
      'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(134,134,134,0) 0%)';
  };

  const bloom = () => {
    const allyKing = [...piecesRef.current.children].find((el) =>
      el.className.includes(props.side + 'King')
    );
    const kingCoords = map[props.side + 'King'].coords;
    const square =
      boardRef.current.children[arrayToIndex(kingCoords[0], kingCoords[1])];

    const { left: squareLeft, top: squareTop } = square.getBoundingClientRect();
    const { left: pieceLeft, top: pieceTop } = allyKing.getBoundingClientRect();

    if (squareLeft === pieceLeft && squareTop === pieceTop) {
      allyKing.style.background =
        'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(134,134,134,0) 100%)';
    } else {
      clearBloom();
    }
  };

  if (isChecked) {
    bloom();
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

  const getSquareOfCursor = (e) => {
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
    if (isChecked && !curPiece.includes(props.side + 'King')) {
      return;
    }

    setPieceBox(size);
    setHold(true);

    const square = getSquareOfCursor(e);
    const coords = getCoords(square, 0);
    const legalMoves = getLegalMoves(curPiece, coords, boardRef, piecesRef);

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
        const square = getSquareOfCursor(e);
        getCoords(square, 1);
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

  const isCheck = () => {
    if (piece.name.includes(props.side)) return;

    const side = piece.name.includes('white') ? 'black' : 'white';
    const kingCoords = map[side + 'King'].coords;
    let pieceName = piece.name;
    let coords;

    if (piece.name.includes('1') || piece.name.includes('0')) {
      pieceName = piece.name.slice(0, piece.name.length - 1);
      coords = map[pieceName][piece.name[piece.name.length - 1] * 1].coords;
    } else {
      coords = map[pieceName].coords;
    }

    const legalMoves = getLegalMoves(pieceName, coords, boardRef, piecesRef);

    legalMoves.forEach((move) => {
      if (move[0] === kingCoords[0] && move[1] === kingCoords[1]) {
        setIsChecked(true);
      }
    });
  };

  const makeMove = (finalSquare, targetPiece) => {
    const animationTime = 100;

    const ilegal = takePiece(finalSquare);

    targetPiece.parentNode.style.transition = 'all ' + animationTime + 'ms';

    setTimeout(() => {
      targetPiece.parentNode.style.transition = 'none';
      if (isChecked) {
        bloom();
      }
    }, animationTime);

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

        if (isChecked && piece.name.includes('King')) {
          setIsChecked(false);
          setTimeout(() => {
            clearBloom();
          }, animationTime + 1);
        }
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

    const square = getSquareOfCursor(e);

    makeMove(square, e.target);

    isCheck();
  };

  const contextMenuHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div onMouseUp={upHandler} onMouseMove={moveHandler} className="Board">
      <audio ref={moveSoundRef} src={moveSfx}></audio>
      <div className="board-container" onContextMenu={contextMenuHandler}>
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
            {squares}
          </div>
        </div>
      </div>
      <div ref={piecesRef}>
        <Pieces hold={hold} left={left} top={top} onClickDown={downHandler} />
      </div>
    </div>
  );
}

export default Board;