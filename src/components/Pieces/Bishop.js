import whiteBishop from './../../img/whiteBishop.svg';
import blackBishop from './../../img/blackBishop.svg';

const Bishop = (props) => {
  const clickDownHandler = (e) => {
    props.onClickDown(e, `${props.side}Bishop${props.index}`);
  };

  return (
    <div
      style={{
        cursor: props.hold ? 'grabbing' : 'grab',
        left: props.left + 'px',
        top: props.top + 'px',
      }}
      onMouseDown={clickDownHandler}
      className={`piece noselect ${props.side}Bishop${props.index}`}
      id={`${props.side}Bishop${props.index}`}
    >
      <img
        draggable="false"
        src={props.side === 'white' ? whiteBishop : blackBishop}
        alt={props.side + 'Bishop'}
      />
    </div>
  );
};

export default Bishop;
