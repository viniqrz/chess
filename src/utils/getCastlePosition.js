const getCastlePosition = (final, initial, playerSide) => {
  const arrayToIndex = (y, x) => y * 8 - (8 - [x]) - 1;

  const [fY, fX] = final;

  let index;
  let squareIndex;
  let rookFinal;

  if (fX > initial.position[1]) {
    index = playerSide === 'white' ? '1' : '0';
    squareIndex = arrayToIndex(fY, fX - 1);
    rookFinal = [fY, fX - 1];
  } else {
    index = playerSide === 'white' ? '0' : '1';
    squareIndex = arrayToIndex(fY, fX + 1);
    rookFinal = [fY, fX + 1];
  }

  return [index, squareIndex, rookFinal];
}

export default getCastlePosition;