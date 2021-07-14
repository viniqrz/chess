import { useRef } from 'react';
import king from './../../king.png';

const King = (props) => {
  const pieceRef = useRef();

  const clickDownHandler = () => {
    props.onClickDown(pieceRef.current.offsetWidth);
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
      className='box'
    >
      <img draggable='false' src={king} alt='' />
    </div>
  );
};

export default King;
