import { useRef } from 'react';
import whiteKnight from './../../img/whiteKnight.svg';
import blackKnight from './../../img/blackKnight.svg';
import './style/Pieces.css';

const Knight = (props) => {
  const pieceRef = useRef();

  const clickDownHandler = (e) => {
    props.onClickDown(
      pieceRef.current.offsetWidth,
      e,
      `${props.side}Knight${props.index}`
    );
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
      className={`piece noselect ${props.side}Knight${props.index}`}
      id={`${props.side}Knight${props.index}`}
    >
      <img
        draggable="false"
        src={props.side === 'white' ? whiteKnight : blackKnight}
        alt=""
      />
    </div>
  );
};

export default Knight;
