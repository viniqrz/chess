const isMovePromotion = (curPiece, playerSide, final) => {
  if (!curPiece.name.includes('Pawn')) return;

  const [y] = final;

  let result = false;

  if (playerSide === 'white') {
    if (curPiece.side === 'white') {
      if (y === 1) {
        result = true;
      }
    }

    if (curPiece.side === 'black') {
      if (y === 8) {
        result = true;
      }
    }
  }

  if (playerSide === 'black') {
    if (curPiece.side === 'white') {
      if (y === 8) {
        result = true;
      }
    }

    if (curPiece.side === 'black') {
      if (y === 1) {
        result = true;
      }
    }
  }

  return result;
}

export default isMovePromotion;