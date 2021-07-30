import { useRef } from 'react';
import whiteBishop from './../../img/whiteBishop.svg';
import blackBishop from './../../img/blackBishop.svg';
import './style/Pieces.css';

const Bishop = (props) => {
  const pieceRef = useRef();

  const clickDownHandler = (e) => {
    props.onClickDown(
      pieceRef.current.offsetWidth,
      e,
      `${props.side}Bishop${props.index}`
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
      className={`piece noselect ${props.side}Bishop${props.index}`}
    >
      <img
        draggable='false'
        src={props.side === 'white' ? whiteBishop : blackBishop}
        alt=''
      />
    </div>
  );
};

export default Bishop;
