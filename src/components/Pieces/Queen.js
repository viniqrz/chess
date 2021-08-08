import { useRef } from 'react';
import whiteQueen from './../../img/whiteQueen.svg';
import blackQueen from './../../img/blackQueen.svg';
import './style/Pieces.css';

const Queen = (props) => {
  const pieceRef = useRef();

  const clickDownHandler = (e) => {
    props.onClickDown(pieceRef.current.offsetWidth, e, `${props.side}Queen`);
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
      className={`piece ${props.side}Queen noselect`}
      id={`${props.side}Queen`}
    >
      <img
        draggable="false"
        src={props.side === 'white' ? whiteQueen : blackQueen}
        alt=""
      />
    </div>
  );
};

export default Queen;
