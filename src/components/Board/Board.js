import { useState, useRef } from 'react';

import './Board.scss';
import moveSfx from './../../sfx/moveSfx.wav';

import getInitialMap from './../../data/getInitialMap';
import squares from '../../data/squares';
import getFen from '../../utils/getFen';
import getCastlePosition from '../../utils/getCastlePosition';
import fenToNumber from '../../utils/fenToNumber';
import isMovePromotion from '../../utils/isMovePromotion';

import usePieces from './../../hooks/use-pieces';
import useLegalMoves from './../../hooks/use-legal-moves';
import useBoard from './../../hooks/use-board';
import useBloom from './../../hooks/use-bloom';

import Pieces from './../Pieces/Pieces.js';
import SideCoords from './../SideCoords/SideCoords';
import UpperCoords from './../UpperCoords/UpperCoords';
import PromotionMenu from './../PromotionMenu/PromotionMenu';

function Board(props) {
  const [hold, setHold] = useState(false);
  const [left, setLeft] = useState({});
  const [top, setTop] = useState({});
  const [initial, setInitial] = useState({});
  const [final, setFinal] = useState([0, 0]);
  const [piece, setPiece] = useState({});
  const [playerSide, setPlayerSide] = useState('white');
  const [map, setMap] = useState(getInitialMap(playerSide));
  const [checked, setChecked] = useState({ side: '', line: '' });
  const [defenders, setDefenders] = useState([]);
  const [history, setHistory] = useState([]);
  const [checkmate, setCheckmate] = useState(false);
  const [promoted, setPromoted] = useState([]);
  const [isPromoting, setIsPromoting] = useState('');
  const [seekedPromotionCheck, setSeekedPromotionCheck] = useState(true); 

  const boardRef = useRef();
  const piecesRef = useRef();
  const moveSoundRef = useRef();
  const gameRef = useRef();

  const getLegalMoves = useLegalMoves();
  const arrange = usePieces(map);
  const [getSquareOfCursor, displayHint] = useBoard(boardRef);
  const [bloom, clearBloom] = useBloom(piecesRef);

  window.addEventListener('resize', () => arrange(map));

  const displayPromotionMenu = () => setIsPromoting(piece.side);

  const elevatePieceImg = (el) => el.style.zIndex = 2;
  const lowerPieceImg = (el) => el.style.zIndex = 1;

  const selectHandler = (selectedPiece) => {
    const name = selectedPiece;
    const index = Math.random().toString().slice(12);
    piece.element.style.display = 'none';
    removeFromMap(piece.name);
    setIsPromoting('');
    setPromoted([...promoted, { name, index, side: piece.side }]);
    
    const newMap = addToMap(final, name + index);
  
    setSeekedPromotionCheck(false);
    setTimeout(() => arrange(newMap), 100);
  };

  const checkForPromotion = (curPiece) => {
    const isPromotion = isMovePromotion(curPiece, playerSide, final);
    if (isPromotion) displayPromotionMenu();
  };

  const addToMap = (coords, name) => {
    const { legalMoves, guarded, pinLines } = getLegalMoves(
      playerSide,
      name,
      coords,
      map
    );

    const pieceObj = {
      chess: 'g1',
      coords: coords,
      legalMoves,
      guarded,
      pinLines,
    };

    const newMap = { ...map, [name]: pieceObj };

    setMap(newMap);

    return newMap;
  };

  const updateMap = (curPiece = piece.name, castle=false) => {
    const newMap = { ...map };

    if (curPiece === piece.name) {
      newMap[curPiece].coords = final;
    } else if (castle) {
      newMap[curPiece].coords = castle;
    };
    
    const { legalMoves, guarded, pinLines } = getLegalMoves(
      playerSide,
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

    return newMap;
  };

  const findCheckmate = () => {
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
    const index = piece.legalMoves.some(
      (move) => move[0] === final[0] && move[1] === final[1]
    );

    if (!index) return true;

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

  const isCheck = (pieceName) => {
    if (pieceName.includes('King')) return;
    const kingSide = pieceName.includes('white') ? 'black' : 'white';
    const [y, x] = map[kingSide + 'King'].coords;

    const pieces = Object.keys(map);
    pieces.forEach((pieceName) => {
      if (pieceName.includes(kingSide)) return;
      updateMap(pieceName);
      const { legalMoves } = map[pieceName];

      legalMoves.forEach((move) => {
        if (move[0] === y && move[1] === x) {
          setChecked({ side: kingSide, line: move[2] || '' });
          bloom(kingSide);
        }
      });
    });
  };

  const findPromotionCheck = () => {
    if (!history[history.length - 1].piece.includes('Pawn')) return;
    if (!map[piece.name].coords[0] === 0) return;

    isCheck(piece.name);
    setSeekedPromotionCheck(true);
  }

  const slidePiece = (movPiece, duration, ilegal) => {
    movPiece.parentNode.style.transition = 'all ' + duration + 'ms';

    setTimeout(() => {
      movPiece.parentNode.style.transition = 'none';
      if (checked.side && ilegal) {
        bloom(checked.side);
      }
    }, duration + 20);
  };

  const updateHistory = (pieceName) => {
    const move = {
      piece: pieceName,
      initial: initial.position,
      final,
    };

    setHistory([...history, move]);
  };

  const fetchEngineMove = () => {
    const oppSide = piece.side === 'white' ? 'b' : 'w';
    const fenStr = getFen(map, playerSide) + ' ' + oppSide;

    fetch('https://chess.apurn.com/nextmove', {
      method: 'POST',
      body: fenStr,
    })
      .then(res => res.text())
      .then(data => { 
        const [initial, final] = fenToNumber(data, playerSide);
      });
  }

  const makeMove = (finalSquare, movPiece, castle=false) => {
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

      updateMap(movPiece.parentNode.id, castle);
      updateHistory(movPiece.parentNode.id);

      moveSoundRef.current.playbackRate = 1.5;
      moveSoundRef.current.play();

      if (checked.side && piece.name.includes(checked.side)) {
        setChecked({ side: '', line: '' });
        setDefenders([]);
        clearBloom(checked.side);
      }

      isCheck(movPiece.parentNode.id);
      checkForPromotion(piece);

      fetchEngineMove();
    }
  };

  const arrayToIndex = (y, x) => y * 8 - (8 - [x]) - 1;

  const isCastle = (square, pieceImg) => {
    const [fY, fX] = final;
    let castleMove = false;

    piece.legalMoves.forEach(el => {
      if (el[3] && el[0] === fY && el[1] === fX) castleMove = true;
    });

    if (!castleMove) return makeMove(square, pieceImg);

    const [index, squareIndex, rookFinal] = getCastlePosition(final, initial, playerSide);

    const rookName = piece.side + 'Rook' + index;
    const pieces = Array.from(piecesRef.current.children);
    const rookImg= pieces.find((el) => el.id === rookName).children[0];
    const rookSquare = boardRef.current.children[squareIndex];

    makeMove(square, pieceImg);
    makeMove(rookSquare, rookImg, rookFinal);
  }

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
      const kingObject = getLegalMoves(playerSide, name, coords, map);
      legalMoves = kingObject.legalMoves;
    }

    setHold(true);
    setPiece({ name, legalMoves, side, element: e.target.parentNode });
  };

  const moveHandler = (e) => {
    if (!hold) return;

    const objLeft = {};
    const objTop = {};
    const { left, right, top, bottom } = gameRef.current.getBoundingClientRect();

    if (e.clientX <= left) return dropPiece(e.target);
    if (e.clientX >= right) return dropPiece(e.target);
    if (e.clientY >= bottom) return dropPiece(e.target);
    if (e.clientY <= top) return dropPiece(e.target);

    objLeft[piece.name] = e.clientX - piece.element.offsetWidth / 2;
    objTop[piece.name] = e.clientY - piece.element.offsetHeight / 2;

    setLeft(objLeft);
    setTop(objTop);

    if (e.target.parentNode.id === piece.name) elevatePieceImg(piece.element);

    if (piece.legalMoves) {
      displayHint(piece.legalMoves, 1);
      const square = getSquareOfCursor(e);
      if (square) getCoords(square, 1);
      if (!square) setFinal([0, 0]);
    }
  };

  const dropPiece = (target) => {
    if (!hold) return;
    
    const square = boardRef.current.children[arrayToIndex(...final)];
    const isKing = piece.name.includes('King');
    
    lowerPieceImg(piece.element);
    setHold(false);
    displayHint(piece.legalMoves, 0);

    if (isKing) isCastle(square, target);
    if (!isKing) makeMove(square, target);    
  }

  const chooseSideHandler = (e) => {
    const newSide = e.target.textContent.toLowerCase();
    setPlayerSide(newSide);
    setMap(getInitialMap(newSide));
    arrange(getInitialMap(newSide));
    setPiece({});
    setInitial();
  }

  const upHandler = (e) => dropPiece(e.target);

  if (checked.side && defenders.length < 1) findCheckmate();
  if (promoted.length > 0 && !seekedPromotionCheck) findPromotionCheck();

  return (
    <div
      onMouseUp={upHandler}
      onMouseMove={moveHandler}
      ref={gameRef}
      className="game-container"
    >
      <audio ref={moveSoundRef} src={moveSfx}></audio>
      <div
        className="board-container"
        onContextMenu={(e) => e.preventDefault()}
      >
        {isPromoting && (
          <PromotionMenu onSelect={selectHandler} side={isPromoting} />
        )}
        <UpperCoords side={playerSide} />
        <SideCoords side={playerSide} />
        <div ref={boardRef} className="board">
          {squares}
        </div>
      </div>
      <div ref={piecesRef} className="pieces">
        <Pieces
          promoted={promoted}
          hold={hold}
          left={left}
          top={top}
          onClickDown={downHandler}
        />
      </div>
      <div>
        <h2>Choose your side</h2>
        <button onClick={ chooseSideHandler }>White</button>
        <button onClick={ chooseSideHandler }>Black</button>
      </div>
      {checkmate && <h1>CHECKMATE!</h1>}
    </div>
  );
}

export default Board;
