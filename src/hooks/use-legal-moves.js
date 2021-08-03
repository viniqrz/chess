const useLegalMoves = () => {
  return (curPiece, curPosition) => {
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
        movesArr.push(possible);
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
        movesArr.push(possible);
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
        movesArr.push(possible);
        if (prevArr) init.push(possible);
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

      return movesArr;
    }

    if (curPiece.includes('Queen')) {
      movesArr = getLine0deg(curPosition, movesArr);
      movesArr = getLine45deg(curPosition, movesArr);
      movesArr = getLine90deg(curPosition, movesArr);
      movesArr = getLine135deg(curPosition, movesArr);
      movesArr = getLine180deg(curPosition, movesArr);
      movesArr = getLine225deg(curPosition, movesArr);
      movesArr = getLine270deg(curPosition, movesArr);
      movesArr = getLine315deg(curPosition, movesArr);

      return movesArr;
    }

    if (curPiece.includes('Bishop')) {
      movesArr = getLine45deg(curPosition, movesArr);
      movesArr = getLine135deg(curPosition, movesArr);
      movesArr = getLine225deg(curPosition, movesArr);
      movesArr = getLine315deg(curPosition, movesArr);

      return movesArr;
    }

    if (curPiece.includes('Knight')) {
      const y0 = curPosition[0];
      const x0 = curPosition[1];
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
    }

    if (curPiece.includes('Rook')) {
      movesArr = getLine0deg(curPosition, movesArr);
      movesArr = getLine90deg(curPosition, movesArr);
      movesArr = getLine180deg(curPosition, movesArr);
      movesArr = getLine270deg(curPosition, movesArr);

      return movesArr;
    }
  };
};

export default useLegalMoves;
