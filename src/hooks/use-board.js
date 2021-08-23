const useBoard = (boardRef, piecesRef) => {
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

  const bloom = (checkedSide) => {
    [...piecesRef.current.children].find((el) =>
      el.className.includes(checkedSide + 'King')
    ).style.background =
      'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(134,134,134,0) 100%)';
  };

  const clearBloom = (checkedSide) => {
    const checkedKing = [...piecesRef.current.children].find((el) =>
      el.className.includes(checkedSide + 'King')
    );

    checkedKing.style.background = 'none';
  };

  return [getSquareOfCursor, displayHint, bloom, clearBloom];
}

export default useBoard;