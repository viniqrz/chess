import whiteRook from './../../img/whiteRook.svg';
import blackRook from './../../img/blackRook.svg';
import './style/Pieces.css';

const Rook = (props) => {
  const clickDownHandler = (e) => {
    props.onClickDown(e, `${props.side}Rook${props.index}`);
  };

  return (
    <div
      style={{
        cursor: props.hold ? 'grabbing' : 'grab',
        left: props.left + 'px',
        top: props.top + 'px',
      }}
      onMouseDown={clickDownHandler}
      className={`piece noselect ${props.side}Rook${props.index}`}
      id={`${props.side}Rook${props.index}`}
    >
      <img
        draggable="false"
        src={props.side === 'white' ? whiteRook : blackRook}
        alt={props.side + 'Rook'}
      />
    </div>
  );
};

export default Rook;
