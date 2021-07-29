import { useRef } from 'react';
import whiteRook from './../../img/whiteRook.svg';
import blackRook from './../../img/blackRook.svg';
import './Pieces.css';

const Rook = (props) => {
  const pieceRef = useRef();

  const clickDownHandler = (e) => {
    props.onClickDown(
      pieceRef.current.offsetWidth,
      e,
      `${props.side}Rook${props.index}`
    );
  };

  return (
    <div
      style={{
        cursor: props.hold ? 'grabbing' : 'grab',
        left: props.left + 'px',
        top: props.top + 'px',
      }}
      ref={pieceRef}
      onMouseDown={clickDownHandler}
      className={`piece noselect ${props.side}Rook${props.index}`}
    >
      <img
        draggable='false'
        src={props.side === 'white' ? whiteRook : blackRook}
        alt=''
      />
    </div>
  );
};

export default Rook;
