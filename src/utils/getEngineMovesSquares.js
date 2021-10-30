export default function getEngineMoveSquares(squares, initial, final) {
  const arrayToIndex = (y, x) => y * 8 - (8 - [x]) - 1;

  const initIndex = arrayToIndex(...initial);
  const finalIndex = arrayToIndex(...final);
  const initSquare = squares[initIndex];
  const finalSquare = squares[finalIndex];

  return [initSquare, finalSquare];
}
