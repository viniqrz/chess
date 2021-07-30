import { useRef } from 'react';
import whiteKing from './../../img/whiteKing.svg';
import blackKing from './../../img/blackKing.svg';
import './style/Pieces.css';

const King = (props) => {
  const pieceRef = useRef();

  const clickDownHandler = (e) => {
    props.onClickDown(pieceRef.current.offsetWidth, e, `${props.side}King`);
    // props.sendSize(useRef.current.offsetWidth);
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
      className={`piece ${props.side}King noselect`}
    >
      <img
        draggable='false'
        src={props.side === 'white' ? whiteKing : blackKing}
        alt=''
      />
    </div>
  );
};

export default King;
