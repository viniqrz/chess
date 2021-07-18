import { useRef } from 'react';
import king from './../../whiteKing.svg';
import './Pieces.css';

const King = (props) => {
  const pieceRef = useRef();

  const clickDownHandler = (e) => {
    props.onClickDown(pieceRef.current.offsetWidth, e, 'king');
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
      className='piece king noselect'
    >
      <img draggable='false' src={king} alt='' />
    </div>
  );
};

export default King;
