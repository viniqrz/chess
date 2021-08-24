import { useState, useRef } from 'react';

import './Board.scss';
import moveSfx from './../../sfx/moveSfx.wav';

import getInitialMap from './../../data/getInitialMap';
import squares from './../../squares';

import usePieces from './../../hooks/use-pieces';
import useLegalMoves from './../../hooks/use-legal-moves';
import useBoard from './../../hooks/use-board';
import useBloom from './../../hooks/use-bloom'

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
  const [checkmate, setCheckmate] = useState(false);

  const boardRef = useRef();
  const piecesRef = useRef();
  const moveSoundRef = useRef();

  const getLegalMoves = useLegalMoves();
  const arrange = usePieces(map);
  const [getSquareOfCursor, displayHint] = useBoard(boardRef);
  const [bloom, clearBloom] = useBloom(piecesRef);

  window.addEventListener('resize', () => arrange(map));

  const updateMap = (curPiece = piece.name) => {
    const newMap = { ...map };

    if (curPiece === piece.name) newMap[curPiece].coords = final;

    const { legalMoves, guarded, pinLines } = getLegalMoves(
      props.side,
      curPiece,
      newMap[curPiece].coords,
      map
    );

    newMap[curPiece].legalMoves = legalMoves;

    if (curPiece.includes('King') || curPiece.includes('Pawn')) {
      newMap[curPiece].guarded = guarded;
      newMap[curPiece].pinLines = pinLines;
    }

    setMap(newMap);

    return newMap;
  };

  const removeFromMap = (name) => {
    const newMap = { ...map };

    newMap[name].legalMoves = [];
    newMap[name].coords = [0, 0];
    newMap[name].guarded = [[0, 0]];

    if (checked.side) {
      setChecked({ side: '', line: '' });
      setDefenders([]);
      clearBloom(checked.side);
    }

    setMap(newMap);
  };

  if (checked.side && defenders.length < 1) {
    const threat = history[history.length - 1];
    const threatMoves = map[threat.piece].legalMoves;
    const threatCoords = threat.final;
    const pieces = [...piecesRef.current.children];

    let defendersList = [];

    // Find defenders
    let threatLine = threatMoves.filter((el) => el[2] === checked.line);
    threatLine = threatLine.slice(0, threatLine.length - 1);

    [...threatLine, threatCoords].forEach((sq) => {
      pieces.forEach((piece) => {
        updateMap(piece.id);
        const { legalMoves } = map[piece.id];

        if (piece.id.includes(checked.side + 'King')) return;

        if (piece.id.includes(checked.side)) {
          legalMoves.forEach((move) => {
            const [y, x] = move;
            if (y === sq[0] && x === sq[1]) {
              defendersList.push({ move: [y, x], name: piece.id });
            }
          });
        }
      });
    });

    const kingMoves = map[checked.side + 'King'].legalMoves;

    if (defendersList.length === 0 && kingMoves.length === 0) {
      setCheckmate(true);
    }

    setDefenders(defendersList.length === 0 ? [null] : defendersList);
  }

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
    const index = piece.legalMoves.findIndex(
      (move) => move[0] === final[0] && move[1] === final[1]
    );

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

        removeFromMap(el.id);
      }
    });

    return ilegal;
  };

  const isCheck = () => {
    if (piece.name.includes('King')) return;
    const kingSide = piece.name.includes('white') ? 'black' : 'white';
    const [y, x] = map[kingSide + 'King'].coords;

    const pieces = Object.keys(map);
    pieces.forEach((pieceName) => {
      if (pieceName.includes(kingSide)) return;
      updateMap(pieceName);
      const { legalMoves } = map[pieceName];

      legalMoves.forEach((move) => {
        if (move[0] === y && move[1] === x) {
          console.log('-', map);
          setChecked({ side: kingSide, line: move[2] || '' });
          bloom(kingSide);
        }
      });
    });
  };

  const slidePiece = (movPiece, duration, ilegal) => {
    movPiece.parentNode.style.transition = 'all ' + duration + 'ms';

    setTimeout(() => {
      movPiece.parentNode.style.transition = 'none';
      if (checked.side && ilegal) {
        bloom(checked.side);
      }
    }, duration + 20);
  };

  const updateHistory = () => {
    const move = {
      piece: piece.name,
      initial: initial.position,
      final,
    };

    setHistory([...history, move]);
  };

  const makeMove = (finalSquare, movPiece) => {
    let ilegal = true;

    if (finalSquare) {
      ilegal = isIlegal(finalSquare);
    }

    slidePiece(movPiece, 100, ilegal);

    console.log(ilegal);
    console.log()

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

      if (checked.side && piece.name.includes(checked.side)) {
        setChecked({ side: '', line: '' });
        setDefenders([]);
        clearBloom(checked.side);
      }

      isCheck();
    }
  };

  const downHandler = (e, name, side) => {
    if (checkmate) return;
    if (checked.side && name.includes(checked.side + 'King')) {
      clearBloom(checked.side);
    }

    const square = getSquareOfCursor(e);
    const coords = getCoords(square, 0);

    let legalMoves = [];
    let isKing = name.includes('King');

    if (isKing) {
      [...piecesRef.current.children].forEach((el) => {
        if (el.id.includes(side)) return;
        updateMap(el.id);
      });
    }

    if (!isKing) {
      [...piecesRef.current.children].forEach((el) => {
        if (el.id.includes(side) && !el.id.includes('King')) return;
        if (el.id.includes('Knight')) return;
        updateMap(el.id);
      });
    }

    if (checked.side && name.includes(checked.side) && !isKing) {
      if (!defenders.some((el) => el.name === name)) return;

      const defender = defenders.find((el) => el.name === name);

      legalMoves = [defender.move];
    } else {
      const kingObject = getLegalMoves(props.side, name, coords, map);
      legalMoves = kingObject.legalMoves;
    }

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
  };

  return (
    <div onMouseUp={upHandler} onMouseMove={moveHandler} className="page">
      <audio ref={moveSoundRef} src={moveSfx}></audio>
      <div
        className="board-container"
        onContextMenu={(e) => e.preventDefault()}
      >
        <UpperCoords side={props.side} />
        <div className="inner-container">
          <SideCoords side={props.side} />
          <div ref={boardRef} className="board">
            {squares}
          </div>
        </div>
      </div>
      <div ref={piecesRef} className="pieces">
        <Pieces hold={hold} left={left} top={top} onClickDown={downHandler} />
      </div>
      {checkmate && <h1>CHECKMATE!</h1>}
    </div>
  );
}

export default Board;
