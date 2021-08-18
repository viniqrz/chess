import whiteKnight from './../../img/whiteKnight.svg';
import blackKnight from './../../img/blackKnight.svg';
import './style/Pieces.css';

const Knight = (props) => {
  const clickDownHandler = (e) => {
    props.onClickDown(e, `${props.side}Knight${props.index}`, props.side);
  };

  return (
    <div
      style={{
        cursor: props.hold ? 'grabbing' : 'grab',
        left: props.left + 'px',
        top: props.top + 'px',
      }}
      onMouseDown={clickDownHandler}
      className={`piece noselect ${props.side}Knight${props.index}`}
      id={`${props.side}Knight${props.index}`}
    >
      <img
        draggable="false"
        src={props.side === 'white' ? whiteKnight : blackKnight}
        alt={props.side + 'Knight'}
      />
    </div>
  );
};

export default Knight;
