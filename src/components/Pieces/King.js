import whiteKing from './../../img/whiteKing.svg';
import blackKing from './../../img/blackKing.svg';

const King = (props) => {
  const clickDownHandler = (e) => {
    props.onClickDown(e, `${props.side}King`);
  };

  return (
    <div
      style={{
        cursor: props.hold ? 'grabbing' : 'grab',
        left: props.left + 'px',
        top: props.top + 'px',
      }}
      onMouseDown={clickDownHandler}
      className={`piece ${props.side}King noselect`}
      id={`${props.side}King`}
    >
      <img
        draggable="false"
        src={props.side === 'white' ? whiteKing : blackKing}
        alt={props.side + 'King'}
      />
    </div>
  );
};

export default King;
