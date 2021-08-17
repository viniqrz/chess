import whiteQueen from './../../img/whiteQueen.svg';
import blackQueen from './../../img/blackQueen.svg';
import './style/Pieces.css';

const Queen = (props) => {
  const clickDownHandler = (e) => {
    props.onClickDown(e, `${props.side}Queen`);
  };

  return (
    <div
      style={{
        cursor: props.hold ? 'grabbing' : 'grab',
        left: props.left + 'px',
        top: props.top + 'px',
      }}
      onMouseDown={clickDownHandler}
      className={`piece ${props.side}Queen noselect`}
      id={`${props.side}Queen`}
    >
      <img
        draggable="false"
        src={props.side === 'white' ? whiteQueen : blackQueen}
        alt={props.side + 'Queen'}
      />
    </div>
  );
};

export default Queen;
