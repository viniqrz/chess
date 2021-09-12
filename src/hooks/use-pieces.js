const usePieces = (initMap) => {
  const arrangeAllPieces = (map) => {
    const board = document.querySelector('.board');
    const pieces = [...document.querySelector('.pieces').children];

    const arrangePiece = (name, index) => {
      const piece = pieces.find((piece) => piece.id === name);
      const square = board.children[index];
      const { left: squareLeft, top: squareTop } =
        square.getBoundingClientRect();
      piece.style.left = squareLeft + 'px';
      piece.style.top = squareTop + 'px';
      piece.style.opacity = 1;
    };

    const arrayToIndex = (y, x) => y * 8 - (8 - [x]) - 1;

    pieces.forEach((piece) => {
      const { coords } = map[piece.id];

      if (coords[0] === 0) return;

      arrangePiece(piece.id, arrayToIndex(...coords));
    });
  };

  window.onload = () => {
    arrangeAllPieces(initMap);
  };

  return arrangeAllPieces;
};

export default usePieces;
