import React from 'react';
import King from './King';
import Queen from './Queen';
import Bishop from './Bishop';
import Knight from './Knight';
import Rook from './Rook';
import Pawn from './Pawn';

import './style/Pieces.scss';

const Pieces = (props) => {
  const { promoted, left, top, hold, onClickDown } = props;

  return (
    <>
      {promoted.map((piece, i) => {
        if (piece.name.includes('Queen')) {
          return (
            <Queen
              key={i}
              side={piece.name.slice(0, 5)}
              index={piece.index}
              hold={hold}
              left={left[piece.name + piece.index]}
              top={top[piece.name + piece.index]}
              onClickDown={onClickDown}
            />
          );
        }

        if (piece.name.includes('Bishop')) {
          return (
            <Bishop
              key={i}
              side={piece.name.slice(0, 5)}
              index={piece.index}
              hold={hold}
              left={left[piece.name + piece.index]}
              top={top[piece.name + piece.index]}
              onClickDown={onClickDown}
            />
          );
        }

        if (piece.name.includes('Knight')) {
          return (
            <Knight
              key={i}
              side={piece.name.slice(0, 5)}
              index={piece.index}
              hold={hold}
              left={left[piece.name + piece.index]}
              top={top[piece.name + piece.index]}
              onClickDown={onClickDown}
            />
          );
        }

        if (piece.name.includes('Rook')) {
          return (
            <Rook
              key={i}
              side={piece.name.slice(0, 5)}
              index={piece.index}
              hold={hold}
              left={left[piece.name + piece.index]}
              top={top[piece.name + piece.index]}
              onClickDown={onClickDown}
            />
          );
        }

        return false;
      })}
      <King
        side="white"
        hold={hold}
        left={left.whiteKing}
        top={top.whiteKing}
        onClickDown={onClickDown}
      />
      <King
        side="black"
        hold={hold}
        left={left.blackKing}
        top={top.blackKing}
        onClickDown={onClickDown}
      />
      <Queen
        side="black"
        index={0}
        hold={hold}
        left={left.blackQueen0}
        top={top.blackQueen0}
        onClickDown={onClickDown}
      />
      <Queen
        side="white"
        index={0}
        hold={hold}
        left={left.whiteQueen0}
        top={top.whiteQueen0}
        onClickDown={onClickDown}
      />
      <Bishop
        side="black"
        hold={hold}
        left={left.blackBishop0}
        top={top.blackBishop0}
        index={0}
        onClickDown={onClickDown}
      />
      <Bishop
        side="black"
        hold={hold}
        left={left.blackBishop1}
        top={top.blackBishop1}
        index={1}
        onClickDown={onClickDown}
      />
      <Bishop
        side="white"
        hold={hold}
        left={left.whiteBishop0}
        top={top.whiteBishop0}
        index={0}
        onClickDown={onClickDown}
      />
      <Bishop
        side="white"
        hold={hold}
        left={left.whiteBishop1}
        top={top.whiteBishop1}
        index={1}
        onClickDown={onClickDown}
      />
      <Knight
        side="white"
        hold={hold}
        left={left.whiteKnight0}
        top={top.whiteKnight0}
        index={0}
        onClickDown={onClickDown}
      />
      <Knight
        side="white"
        hold={hold}
        left={left.whiteKnight1}
        top={top.whiteKnight1}
        index={1}
        onClickDown={onClickDown}
      />
      <Knight
        side="black"
        hold={hold}
        left={left.blackKnight0}
        top={top.blackKnight0}
        index={0}
        onClickDown={onClickDown}
      />
      <Knight
        side="black"
        hold={hold}
        left={left.blackKnight1}
        top={top.blackKnight1}
        index={1}
        onClickDown={onClickDown}
      />
      <Rook
        side="black"
        hold={hold}
        left={left.blackRook0}
        top={top.blackRook0}
        index={0}
        onClickDown={onClickDown}
      />
      <Rook
        side="black"
        hold={hold}
        left={left.blackRook1}
        top={top.blackRook1}
        index={1}
        onClickDown={onClickDown}
      />
      <Rook
        side="white"
        hold={hold}
        left={left.whiteRook0}
        top={top.whiteRook0}
        index={0}
        onClickDown={onClickDown}
      />
      <Rook
        side="white"
        hold={hold}
        left={left.whiteRook1}
        top={top.whiteRook1}
        index={1}
        onClickDown={onClickDown}
      />
      <Pawn
        side="white"
        hold={hold}
        left={left.whitePawn0}
        top={top.whitePawn0}
        index={0}
        onClickDown={onClickDown}
      />
      <Pawn
        side="white"
        hold={hold}
        left={left.whitePawn1}
        top={top.whitePawn1}
        index={1}
        onClickDown={onClickDown}
      />
      <Pawn
        side="white"
        hold={hold}
        left={left.whitePawn2}
        top={top.whitePawn2}
        index={2}
        onClickDown={onClickDown}
      />
      <Pawn
        side="white"
        hold={hold}
        left={left.whitePawn3}
        top={top.whitePawn3}
        index={3}
        onClickDown={onClickDown}
      />
      <Pawn
        side="white"
        hold={hold}
        left={left.whitePawn4}
        top={top.whitePawn4}
        index={4}
        onClickDown={onClickDown}
      />
      <Pawn
        side="white"
        hold={hold}
        left={left.whitePawn5}
        top={top.whitePawn5}
        index={5}
        onClickDown={onClickDown}
      />
      <Pawn
        side="white"
        hold={hold}
        left={left.whitePawn6}
        top={top.whitePawn6}
        index={6}
        onClickDown={onClickDown}
      />
      <Pawn
        side="white"
        hold={hold}
        left={left.whitePawn7}
        top={top.whitePawn7}
        index={7}
        onClickDown={onClickDown}
      />
      <Pawn
        side="black"
        hold={hold}
        left={left.blackPawn0}
        top={top.blackPawn0}
        index={0}
        onClickDown={onClickDown}
      />
      <Pawn
        side="black"
        hold={hold}
        left={left.blackPawn1}
        top={top.blackPawn1}
        index={1}
        onClickDown={onClickDown}
      />
      <Pawn
        side="black"
        hold={hold}
        left={left.blackPawn2}
        top={top.blackPawn2}
        index={2}
        onClickDown={onClickDown}
      />
      <Pawn
        side="black"
        hold={hold}
        left={left.blackPawn3}
        top={top.blackPawn3}
        index={3}
        onClickDown={onClickDown}
      />
      <Pawn
        side="black"
        hold={hold}
        left={left.blackPawn4}
        top={top.blackPawn4}
        index={4}
        onClickDown={onClickDown}
      />
      <Pawn
        side="black"
        hold={hold}
        left={left.blackPawn5}
        top={top.blackPawn5}
        index={5}
        onClickDown={onClickDown}
      />
      <Pawn
        side="black"
        hold={hold}
        left={left.blackPawn6}
        top={top.blackPawn6}
        index={6}
        onClickDown={onClickDown}
      />
      <Pawn
        side="black"
        hold={hold}
        left={left.blackPawn7}
        top={top.blackPawn7}
        index={7}
        onClickDown={onClickDown}
      />
    </>
  );
};

export default React.memo(Pieces);
