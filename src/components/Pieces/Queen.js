import whiteQueen from './../../img/whiteQueen.svg';
import blackQueen from './../../img/blackQueen.svg';

const Queen = (props) => {
  const clickDownHandler = (e) => {
    props.onClickDown(e, `${props.side}Queen${props.index}`, props.side);
  };

  return (
    <div
      style={{
        cursor: props.hold ? 'grabbing' : 'grab',
        left: props.left + 'px',
        top: props.top + 'px',
      }}
      onMouseDown={clickDownHandler}
      className={`piece ${props.side}Queen${props.index} noselect`}
      id={`${props.side}Queen${props.index}`}
    >
      <img
        draggable="false"
        src={props.side === 'white' ? whiteQueen : blackQueen}
        alt={props.side + 'Queen' + props.index}
      />
    </div>
  );
};

export default Queen;
