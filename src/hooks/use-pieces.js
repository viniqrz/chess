const usePieces = (boardRef, piecesRef) => {
  const arrangeAllPieces = () => {
    const arrangePiece = (piece, index) => {
      const square = boardRef.current.children[index];
        const { left: squareLeft, top: squareTop } =
          square.getBoundingClientRect();
        piece.style.left = squareLeft + 'px';
        piece.style.top = squareTop + 'px';
        piece.style.opacity = 1;
    }

    const pieces = [...piecesRef.current.children];
    
    pieces.forEach((piece) => {
      if (piece.className.includes('white')) {
        if (piece.className.includes('whiteKing')) {
          arrangePiece(piece, 60);
        }

        if (piece.className.includes('whiteQueen')) {
          arrangePiece(piece, 59);
        }

        if (piece.className.includes('whiteBishop')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          arrangePiece(piece, pieceIndexEqualsToOne ? 61 : 58);
        }

        if (piece.className.includes('whiteKnight')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          arrangePiece(piece, pieceIndexEqualsToOne ? 62 : 57);
        }

        if (piece.className.includes('whiteBishop')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          arrangePiece(piece, pieceIndexEqualsToOne ? 61 : 58);
        }

        if (piece.className.includes('whiteRook')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          arrangePiece(piece, pieceIndexEqualsToOne ? 63 : 56);
        }
      }

      if (piece.className.includes('black')) {
        if (piece.className.includes('blackKing')) {
          arrangePiece(piece, 4);
        }

        if (piece.className.includes('blackQueen')) {
          arrangePiece(piece, 3);
        }

        if (piece.className.includes('blackBishop')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          arrangePiece(piece, pieceIndexEqualsToOne ? 5 : 2);
        }

        if (piece.className.includes('blackKnight')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          arrangePiece(piece, pieceIndexEqualsToOne ? 6 : 1);
        }

        if (piece.className.includes('blackRook')) {
          const pieceIndexEqualsToOne = (piece.className.includes('1'));
          arrangePiece(piece, pieceIndexEqualsToOne ? 7 : 0);
        }
      }
    });
  };

  window.onload = () => {
    arrangeAllPieces();

    window.addEventListener('resize', arrangeAllPieces);
  };
}

export default usePieces;