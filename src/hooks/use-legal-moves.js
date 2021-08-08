const useLegalMoves = () => {
  return (curPiece, curPosition, boardRef, piecesRef) => {
    const arrayToIndex = (y, x) => {
      return y * 8 - (8 - [x]) - 1;
    };

    const checkPiecesAhead = (initLegalMoves) => {
      const pieces = Array.from(piecesRef.current.children);
      const squares = Array.from(boardRef.current.children);
      let newArr = initLegalMoves;
      let cleanedLines = [];

      initLegalMoves.forEach((legalSquare) => {
        const index = arrayToIndex(legalSquare[0], legalSquare[1]);
        const { left, top } = squares[index].getBoundingClientRect();
        const foundCleanedLine = cleanedLines.find(
          (el) => el === legalSquare[2]
        );

        if (foundCleanedLine === -1 || foundCleanedLine === undefined) {
          pieces.forEach((piece) => {
            const { left: pieceLeft, top: pieceTop } =
              piece.getBoundingClientRect();
            if (left === pieceLeft && top === pieceTop) {
              const legalIndex = newArr.findIndex(
                (el) => el[0] === legalSquare[0] && el[1] === legalSquare[1]
              );
              const filteredNewArr = newArr.filter((move, i) => {
                if (move[2] === legalSquare[2] && i > legalIndex) {
                  cleanedLines.push(move[2]);
                }
                return !(move[2] === legalSquare[2] && i > legalIndex);
              });

              newArr = filteredNewArr;
            }
          });
        }
      });

      return newArr;
    };

    let movesArr = [];

    const getLine0deg = (init, prevArr = null) => {
      let arr = [];
      let x = init[1];
      for (let y = init[0] - 1; y > 0; y--) {
        const possible = [y, x, '0'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
      }

      return prevArr || arr;
    };

    const getLine45deg = (init, prevArr = null) => {
      let arr = [];
      let y = init[0] - 1;
      for (let x = init[1] + 1; x <= 8; x++) {
        if (y < 1) break;
        const possible = [y, x, '45'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
        y -= 1;
      }

      return prevArr || arr;
    };

    const getLine90deg = (init, prevArr = null) => {
      let arr = [];
      let y = init[0];
      for (let x = init[1] + 1; x <= 8; x++) {
        const possible = [y, x, '90'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
      }

      return prevArr || arr;
    };

    const getLine135deg = (init, prevArr = null) => {
      let arr = [];
      let y = init[0] + 1;
      for (let x = init[1] + 1; x <= 8; x++) {
        if (y > 8) break;
        const possible = [y, x, '135'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
        y += 1;
      }

      return prevArr || arr;
    };

    const getLine180deg = (init, prevArr = null) => {
      let arr = [];
      let x = init[1];
      for (let y = init[0] + 1; y <= 8; y++) {
        const possible = [y, x, '180'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
      }

      return prevArr || arr;
    };

    const getLine225deg = (init, prevArr = null) => {
      let arr = [];
      let y = init[0] + 1;
      for (let x = init[1] - 1; x > 0; x--) {
        if (y > 8) break;
        const possible = [y, x, '225'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
        y += 1;
      }

      return prevArr || arr;
    };

    const getLine270deg = (init, prevArr = null) => {
      let arr = [];
      let y = init[0];
      for (let x = init[1] - 1; x > 0; x--) {
        const possible = [y, x, '270'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
      }

      return prevArr || arr;
    };

    const getLine315deg = (init, prevArr = null) => {
      let arr = [];
      let y = init[0] - 1;
      for (let x = init[1] - 1; x > 0; x--) {
        if (y < 1) break;
        const possible = [y, x, '315'];
        arr.push(possible);
        if (prevArr) prevArr.push(possible);
        y -= 1;
      }

      return prevArr || arr;
    };

    const getQueenMoves = (init) => {
      movesArr = getLine0deg(init, movesArr);
      movesArr = getLine45deg(init, movesArr);
      movesArr = getLine90deg(init, movesArr);
      movesArr = getLine135deg(init, movesArr);
      movesArr = getLine180deg(init, movesArr);
      movesArr = getLine225deg(init, movesArr);
      movesArr = getLine270deg(init, movesArr);
      movesArr = getLine315deg(init, movesArr);

      movesArr = checkPiecesAhead(movesArr);

      return movesArr;
    };

    const getBishopMoves = (init) => {
      movesArr = getLine45deg(init, movesArr);
      movesArr = getLine135deg(init, movesArr);
      movesArr = getLine225deg(init, movesArr);
      movesArr = getLine315deg(init, movesArr);

      movesArr = checkPiecesAhead(movesArr);

      return movesArr;
    };

    const getRookMoves = (init) => {
      movesArr = getLine0deg(init, movesArr);
      movesArr = getLine90deg(init, movesArr);
      movesArr = getLine180deg(init, movesArr);
      movesArr = getLine270deg(init, movesArr);

      movesArr = checkPiecesAhead(movesArr);

      return movesArr;
    };

    const getKnightMoves = (init) => {
      const y0 = init[0];
      const x0 = init[1];
      for (let y = y0 - 2; y < 9 && y <= y0 + 2; y += 4) {
        if (y < 1) continue;
        for (let x = x0 - 1; x < 9 && x <= x0 + 1; x += 2) {
          if (x < 1) continue;
          const possible = [y, x];
          movesArr.push(possible);
        }
      }

      for (let y = y0 - 1; y < 9; y += 2) {
        if (y < 1) continue;
        for (let x = x0 - 2; x < 9; x += 4) {
          if (x <= x0 + 2 && x > 0 && y <= y0 + 1) {
            const possible = [y, x];
            movesArr.push(possible);
          }
        }
      }
      return movesArr;
    };

    if (curPiece.includes('King')) {
      for (let y = curPosition[0] - 1; y <= curPosition[0] + 1; y++) {
        for (let x = curPosition[1] - 1; x <= curPosition[1] + 1; x++) {
          const possible = [y, x];
          let isEqual = false;

          if (y === curPosition[0] && x === curPosition[1]) {
            isEqual = true;
          }

          if (y >= 1 && y <= 8 && x >= 1 && x <= 8 && !isEqual) {
            movesArr.push(possible);
          }
        }
      }

      // const pieces = Array.from(piecesRef.current.children);

      // movesArr.filter((move) => {
      //   pieces.forEach((piece) => {
      //     let pieceName = piece.id;
      //     let index;

      //     if (pieceName.includes('0') || pieceName.includes('1')) {
      //       index = pieceName[pieceName.length - 1];
      //       pieceName = pieceName.slice(0, -1);
      //     }

      //     if (pieceName.includes('Queen')) {
      //       return getQueenMoves();
      //     }

      //     if (pieceName.includes('Bishop')) {
      //       return getBishopMoves();
      //     }

      //     if (pieceName.includes('Knight')) {
      //       return getKnightMoves();
      //     }

      //     if (pieceName.includes('Rook')) {
      //       return getRookMoves();
      //     }
      //   });
      // });

      return movesArr;
    }

    if (curPiece.includes('Queen')) {
      return getQueenMoves(curPosition);
    }

    if (curPiece.includes('Bishop')) {
      return getBishopMoves(curPosition);
    }

    if (curPiece.includes('Knight')) {
      return getKnightMoves(curPosition);
    }

    if (curPiece.includes('Rook')) {
      return getRookMoves(curPosition);
    }
  };
};

export default useLegalMoves;
