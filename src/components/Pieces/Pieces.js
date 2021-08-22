import King from './King';
import Queen from './Queen';
import Bishop from './Bishop';
import Knight from './Knight';
import Rook from './Rook';

import './style/Pieces.scss';

const Pieces = (props) => {
  const { left, top, hold, onClickDown } = props;

  return (
    <>
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
        hold={hold}
        left={left.blackQueen}
        top={top.blackQueen}
        onClickDown={onClickDown}
      />
      <Queen
        side="white"
        hold={hold}
        left={left.whiteQueen}
        top={top.whiteQueen}
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
    </>
  );
};

export default Pieces;
