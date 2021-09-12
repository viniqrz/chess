const useBoard = (boardRef) => {
  const arrayToIndex = (y, x) => y * 8 - (8 - [x]) - 1;

  const getSquareOfCursor = (e) => {
    const squaresArr = Array.from(boardRef.current.children);

    let element;

    squaresArr.forEach((square) => {
      const { left, width, height, top } = square.getBoundingClientRect();

      if (left < e.clientX && left + width > e.clientX) {
        if (top < e.clientY && top + height > e.clientY) {
          element = square;
        }
      }
    });

    return element || '';
  };

  const displayHint = (legalMoves, show) => {
    const indexList = legalMoves.map((move) => arrayToIndex(move[0], move[1]));
    indexList.forEach(
      (i) => (boardRef.current.children[i].children[0].style.opacity = show)
    );
  };

  return [getSquareOfCursor, displayHint];
}

export default useBoard;