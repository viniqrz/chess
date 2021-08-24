import whitePawn from './../../img/whitePawn.svg';
import blackPawn from './../../img/blackPawn.svg';

const Pawn = (props) => {
  const clickDownHandler = (e) => {
    props.onClickDown(e, `${props.side}Pawn${props.index}`, props.side);
  };

  return (
    <div
      style={{
        cursor: props.hold ? 'grabbing' : 'grab',
        left: props.left + 'px',
        top: props.top + 'px',
      }}
      onMouseDown={clickDownHandler}
      className={`piece noselect ${props.side}Pawn${props.index}`}
      id={`${props.side}Pawn${props.index}`}
    >
      <img
        draggable="false"
        src={props.side === 'white' ? whitePawn : blackPawn}
        alt={props.side + 'Pawn'}
      />
    </div>
  );
};

export default Pawn;
