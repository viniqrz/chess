import { useState, useRef, useEffect } from 'react';

import './Board.css';
import moveSfx from './../../sfx/moveSfx.wav';

import getInitialMap from './../../getInitialMap';
import squares from '../../squares';

import usePieces from './../../hooks/use-pieces';
import useLegalMoves from './../../hooks/use-legal-moves';

import Pieces from './../Pieces/Pieces.js';
import SideCoords from './../SideCoords/SideCoords';
import UpperCoords from './../UpperCoords/UpperCoords';

function Board(props) {
  const [hold, setHold] = useState(false);
  const [left, setLeft] = useState({});
  const [top, setTop] = useState({});
  const [initial, setInitial] = useState({});
  const [final, setFinal] = useState([0, 0]);
  const [piece, setPiece] = useState({});
  const [map, setMap] = useState(getInitialMap(props.side));
  const [checked, setChecked] = useState({ side: '', line: '' });
  const [defenders, setDefenders] = useState([]);
  const [history, setHistory] = useState([]);

  const boardRef = useRef();
  const piecesRef = useRef();
  const moveSoundRef = useRef();

  // const squares = useSquares();

  const getLegalMoves = useLegalMoves();

  usePieces(boardRef, piecesRef);

  useEffect(() => {
    console.log(defenders);
  }, [defenders]);

  const updateMap = (curPiece = piece.name) => {
    if (curPiece === piece.name) map[curPiece].coords = final;

    const newMap = { ...map };
    const { legalMoves, guarded } = getLegalMoves(
      curPiece,
      newMap[curPiece].coords,
      map,
    );

    newMap[curPiece].legalMoves = legalMoves;

    if (curPiece.includes('King')) newMap[curPiece].guarded = guarded;

    setMap(newMap);

    return newMap;
  }

  if (checked.side && defenders.length < 1) {
    const threat = history[history.length - 1];
    const threatMoves = map[threat.piece].legalMoves;
    const threatCoords = threat.final;
    const pieces = [...piecesRef.current.children];

    let defendersList = [];
    let isThreatDefended = false;

    // Find defenders
    let threatLine = threatMoves.filter((el) => el[2] === checked.line);
    threatLine = threatLine.slice(0, threatLine.length - 1);

    [...threatLine, threatCoords].forEach((sq) => {
      pieces.forEach((piece) => {
        if (piece.id.includes(checked.side + 'King')) return;

        if (piece.id.includes(checked.side)) {
          const { legalMoves } = getLegalMoves(piece.id, map[piece.id].coords, map);

          legalMoves.forEach((move) => {
            const [y, x] = move;
            if (y === sq[0] && x === sq[1]) {
              defendersList.push({ move: [y, x], name: piece.id });
            }
          });
        }

        if (!piece.id.includes(checked.side) && !isThreatDefended) {
          const newMap = updateMap(piece.id);
          const { legalMoves } = newMap[piece.id];

          legalMoves.forEach((move) => {
            const [y, x] = move;
            if (y === threatCoords[0] && x === threatCoords[1]) {
              isThreatDefended = true;
            }
          });
        }
      })
    });

    const { legalMoves: kingLegalMoves } = getLegalMoves(
      checked.side + 'King',
      map[checked.side + 'King'].coords,
      map
    );

    if (defendersList.length === 0 && kingLegalMoves.length === 0) alert('CHECKMATE!');

    setDefenders(defendersList.length === 0 ? [null] : defendersList);
  }

  const arrayToIndex = (y, x) => y * 8 - (8 - [x]) - 1;

  const clearBloom = () => {
    const checkedKing = [...piecesRef.current.children].find((el) =>
      el.className.includes(checked.side + 'King')
    );

    checkedKing.style.background =
      'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(134,134,134,0) 0%)';
  };

  const bloom = () => {
    const pieces = [...piecesRef.current.children];
    const [y, x] = map[checked.side + 'King'].coords;
    const squares = boardRef.current.children;
    const square = squares[arrayToIndex(y, x)];
    const checkedKing = pieces.find(el => el.className.includes(checked.side + 'King'));
    const { left: squareLeft, top: squareTop } = square.getBoundingClientRect();
    const { left: pieceLeft, top: pieceTop } = checkedKing.getBoundingClientRect();

    if (squareLeft === pieceLeft && squareTop === pieceTop) {
      checkedKing.style.background =
        'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(134,134,134,0) 100%)';
    } else {
      clearBloom();
    }
  };

  if (checked.side) {
    bloom();
  }

  const displayHint = (legalMoves, show) => {
    const indexList = legalMoves.map((move) => arrayToIndex(move[0], move[1]));
    indexList.forEach((i) => (
      boardRef.current.children[i].children[0].style.opacity = show
    ));
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

    return element || '';
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

  const isIlegal = (square) => {
    const index = piece.legalMoves.findIndex((move) => move[0] === final[0] && move[1] === final[1]);

    if (index === -1) return true;

    const { left, top } = square.getBoundingClientRect();
    const pieces = [...piecesRef.current.children];

    let ilegal = false;


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
    const kingSide = piece.name.includes('white') ? 'black' : 'white';
    const [y, x] = map[kingSide + 'King'].coords;
    const coords = map[piece.name].coords;

    if (piece.name.includes(kingSide)) return;

    const { legalMoves } = getLegalMoves(piece.name, coords, map);

    legalMoves.forEach((move) => {
      if (move[0] === y && move[1] === x) {
        setChecked({ side: kingSide, line: move[2] || '' });
      }
    });
  };

  const slidePiece = (movPiece, duration, ilegal) => {
    movPiece.parentNode.style.transition = 'all ' + duration + 'ms';

    setTimeout(() => {
      movPiece.parentNode.style.transition = 'none';
      if (checked.side && ilegal) {
        bloom();
      }
    }, duration);
  }

  const updateHistory = () => {
    const move = {
      piece: piece.name,
      initial: initial.position,
      final,
    }

    setHistory([...history, move]);
  }

  const makeMove = (finalSquare, movPiece) => {
    let ilegal = true;

    if (finalSquare) {
      ilegal = isIlegal(finalSquare);
    }

    slidePiece(movPiece, 100, ilegal);

    if (ilegal) {
      const { left, top } = initial.square.getBoundingClientRect();
      movPiece.parentNode.style.left = left + 'px';
      movPiece.parentNode.style.top = top + 'px';
    } else {
      const { left, top } = finalSquare.getBoundingClientRect();
      movPiece.parentNode.style.left = left + 'px';
      movPiece.parentNode.style.top = top + 'px';

      updateMap();
      updateHistory();

      moveSoundRef.current.playbackRate = 1.5;
      moveSoundRef.current.play();

      if (checked.side && piece.name.includes('King')) {
        setChecked({ side: '', line: '' });
        setDefenders([]);
      }
    }
  };

  const downHandler = (e, name, side) => {
    if (name.includes('King')) {
      [...piecesRef.current.children].forEach((el) => {
        if (el.id.includes(props.side)) return;
        updateMap(el.id);
      });
    }

    if (name.includes(checked.side)) {
      // !name.includes(checked.side + 'King');
    }

    const square = getSquareOfCursor(e);
    const coords = getCoords(square, 0);
    const { legalMoves } = getLegalMoves(name, coords, map);

    setHold(true);
    setPiece({ name, legalMoves, side, element: e.target.parentNode });
  };

  const moveHandler = (e) => {
    if (!hold) return;
    const objLeft = {};
    const objTop = {};

    objLeft[piece.name] = e.clientX - piece.element.offsetWidth / 2;
    objTop[piece.name] = e.clientY - piece.element.offsetHeight / 2;

    setLeft(objLeft);
    setTop(objTop);

    if (e.target.parentNode.className.includes(piece.name.slice(0, -1))) {
      e.target.parentNode.style.zIndex = 2;
    }

    if (piece.legalMoves) {
      const square = getSquareOfCursor(e);
      displayHint(piece.legalMoves, 1);
      if (square) getCoords(square, 1);
    }
  };

  const upHandler = (e) => {
    if (!hold) return;
    setHold(false);
    const square = getSquareOfCursor(e);

    piece.element.style.zIndex = 1;


    displayHint(piece.legalMoves, 0);
    makeMove(square, e.target);
    isCheck();
  };

  return (
    <div onMouseUp={upHandler} onMouseMove={moveHandler} className="page">
      <audio ref={moveSoundRef} src={moveSfx}></audio>
      <div className="board-container" onContextMenu={(e) => e.preventDefault()}>
        <UpperCoords side={props.side} />
        <div className="inner-container">
          <SideCoords side={props.side} />
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
