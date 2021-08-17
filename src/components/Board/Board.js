import { useState, useRef, useEffect } from 'react';

import './Board.css';

import moveSfx from './../../sfx/moveSfx.wav';
import getInitialMap from './../../getInitialMap';

import useSquares from './../../hooks/use-squares';
import usePieces from './../../hooks/use-pieces';
import useLegalMoves from './../../hooks/use-legal-moves';

import Pieces from './../Pieces/Pieces.js';

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

  const squares = useSquares();

  const getLegalMoves = useLegalMoves();

  usePieces(boardRef, piecesRef);

  if (checked.side && defenders.length < 1) {
    let defendersList = [];
    console.log('checked');

    const kingLegalMoves = getLegalMoves(
      checked.side + 'King',
      map[checked.side + 'King'].coords,
      boardRef,
      piecesRef,
      map
    );
    
    const threat = history[history.length - 1];
    const threatMoves = map[threat.piece].legalMoves;
    const pieces = [...piecesRef.current.children]
      .filter(el => el.id.includes(checked.side));

    if (!threat.piece.includes('Knight') && !threat.piece.includes('Pawn')) {
      let threatLine = threatMoves.filter((el) => el[2] === checked.line);
      threatLine = threatLine.slice(0, threatLine.length - 1);
      
      threatLine.forEach((sq) => {
        pieces.forEach((piece) => {
          if (piece.id.includes('King')) return;
          const { legalMoves } = getLegalMoves(
            piece.id,
            map[piece.id].coords,
            boardRef,
            piecesRef,
            map
          );

          legalMoves.forEach((move) => {
            const [y, x] = move;
            if (y === sq[0] && x === sq[1]) {
              console.log('oba peao', piece.id);
              defendersList.push(piece.id);
            }
          });
        })
      });
    }

    setDefenders(defendersList);
  }

  const getCheckScape = () => {
    // aaaaa
  }

  const arrayToIndex = (y, x) => {
    return y * 8 - (8 - [x]) - 1;
  };

  const clearBloom = () => {
    const checkedKing = [...piecesRef.current.children].find((el) =>
      el.className.includes(checked.side + 'King')
    );

    checkedKing.style.background =
      'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(134,134,134,0) 0%)';
  };

  const bloom = () => {
    const checkedKing = [...piecesRef.current.children].find((el) =>
      el.className.includes(checked.side + 'King')
    );
    const kingCoords = map[checked.side + 'King'].coords;
    const square =
      boardRef.current.children[arrayToIndex(kingCoords[0], kingCoords[1])];

    const { left: squareLeft, top: squareTop } = square.getBoundingClientRect();
    const { left: pieceLeft, top: pieceTop } =
      checkedKing.getBoundingClientRect();

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
    legalMoves
      .map((move) => arrayToIndex(move[0], move[1]))
      .forEach((i) => boardRef.current.children[i].children[0].style.opacity = show);
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

  const isIlegal = (square) => {
    const legalIndex = piece.legalMoves.findIndex((legalMove) => {
      return legalMove[0] === final[0] && legalMove[1] === final[1];
    });

    if (legalIndex === -1) return true;

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
    const kingSide = piece.name.includes('white') ? 'black' : 'white';
    const kingCoords = map[kingSide + 'King'].coords;
    const coords = map[piece.name].coords;
    
    let checked = false;

    if (piece.name.includes(kingSide)) return;
    
    const { legalMoves } = getLegalMoves(
      piece.name,
      coords,
      boardRef,
      piecesRef,
      map
    );

    legalMoves.forEach((move) => {
      if (move[0] === kingCoords[0] && move[1] === kingCoords[1]) {
        checked = true;
        setChecked({
          side: kingSide,
          line: move[2] || '', 
        });
      }
    });

    if (checked) getCheckScape(); 
  };

  const updateMap = () => {
    const newMap = { ...map };

    newMap[piece.name].coords = final;

    const { legalMoves, guarded } = getLegalMoves(
      piece.name,
      final,
      boardRef,
      piecesRef,
      map,
    );

    newMap[piece.name].legalMoves = legalMoves;
    if (piece.name.includes('King')) newMap[piece.name].guarded = guarded;
    
    setMap(newMap);
  }

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
    const ilegal = isIlegal(finalSquare);

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
      }
    }
  };

  const downHandler = (e, curPiece) => {
    if (curPiece.includes(checked.side)) {
      // !curPiece.includes(checked.side + 'King')
      
    }

    setHold(true);

    const square = getSquareOfCursor(e);
    const coords = getCoords(square, 0);
    const { legalMoves } = getLegalMoves(
      curPiece,
      coords,
      boardRef,
      piecesRef,
      map
    );

    setPiece({
      name: curPiece,
      legalMoves,
      side: e.target.parentNode.className.includes('white') ? 'white' : 'black',
      element: e.target.parentNode,
    });
  };

  const moveHandler = (e) => {
    if (hold) {
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
        getCoords(square, 1);
      }
    }
  };

  const upHandler = (e) => {
    if (!hold) return;

    setHold(false);

    piece.element.style.zIndex = 1;

    displayHint(piece.legalMoves, 0);

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
