const useLegalMoves = () => {
  return (playerSide, curPiece, curPosition, map) => {
    const side = curPiece.includes('white') ? 'white' : 'black';

    const checkPiecesAhead = (initLegalMoves, pinLines = false) => {
      let newArr = initLegalMoves;
      let clearLines = [];

      initLegalMoves.forEach((legalSquare) => {
        const [sqY, sqX, sqLine] = legalSquare;
        const foundCleanedLine = clearLines.some((el) => el === sqLine);

        if (foundCleanedLine) return;

        const piecesArr = Object.entries(map);
        piecesArr.forEach((piece) => {
          const [name, details] = piece;
          const { coords } = details;
          const [pieceY, pieceX] = coords;

          if (sqY === pieceY && sqX === pieceX) {
            const legalIndex = newArr.findIndex(
              (el) => el[0] === sqY && el[1] === sqX
            );

            const filteredNewArr = newArr.filter((move, i) => {
              const movLine = move[2];
              const isSameOrAfterPiece = movLine === sqLine && i >= legalIndex;
              const isAfterPiece = movLine === sqLine && i > legalIndex;

              if (pinLines && name.includes(side)) return true;

              // King as attacker case
              if (name.includes(side) && curPiece.includes('King')) {
                if (isSameOrAfterPiece) {
                  clearLines.push(movLine);
                }

                return !isSameOrAfterPiece;
              }

              // King as target case
              if (name.includes('King') && !name.includes(side)) {
                if (movLine === sqLine && i > legalIndex + 1) {
                  clearLines.push(movLine);
                }

                return !(movLine === sqLine && i > legalIndex + 1);
              }

              // generic case
              if (isAfterPiece) {
                clearLines.push(movLine);
              }

              return !isAfterPiece;
            });

            newArr = filteredNewArr;
          }
        });
      });

      return newArr;
    };

    const checkForPin = (initLegalMoves) => {
      const pieceNames = Object.keys(map);
      const { pinLines } = map[side + 'King'];
      const [curY, curX] = curPosition;
      const alliesInLine = [];

      let opponentInLine = '';
      let pinnedLine;

      pinLines.forEach((el) => {
        const [pinY, pinX, pinDeg] = el;
        if (pinY === curY && pinX === curX) {
          alliesInLine.push(curPiece);
          pinnedLine = pinLines.filter((el) => el[2] === pinDeg);
          return true;
        }

        return false;
      });

      if (alliesInLine.length === 0) return initLegalMoves;

      // seek enemies in line
      pieceNames.forEach((pieceName) => {
        if (pieceName.includes(side)) return;
        if (pieceName.includes('King')) return;
        if (pieceName.includes('Knight')) return;

        const [pieceY, pieceX] = map[pieceName].coords;

        pinnedLine.forEach((el) => {
          const [pinY, pinX] = el;
          if (pinY === pieceY && pinX === pieceX) {
            opponentInLine = pieceName;
          }
        });
      });

      if (!opponentInLine) return initLegalMoves;

      // seek allies in line
      pieceNames.forEach((pieceName) => {
        if (
          !pieceName.includes(side) ||
          pieceName.includes(curPiece) ||
          pieceName.includes('King')
        )
          return;

        const [pieceY, pieceX] = map[pieceName].coords;

        pinnedLine.forEach((el) => {
          const [pinY, pinX] = el;
          if (pinY === pieceY && pinX === pieceX) {
            alliesInLine.push(pieceName);
          }
        });
      });

      if (alliesInLine.length >= 2) return initLegalMoves;

      const oppMoves = map[opponentInLine].legalMoves;
      const isThreat = oppMoves.some((move) => {
        const [oppY, oppX] = move;

        return oppY === curY && oppX === curX;
      });

      if (!isThreat) return initLegalMoves;

      let finalMoves = [];

      initLegalMoves.forEach((move) => {
        const [moveY, moveX] = move;
        pinnedLine.forEach((sq) => {
          const [pinY, pinX] = sq;

          if (pinY === moveY && pinX === moveX) {
            finalMoves.push(move);
          }
        });
      });

      return finalMoves;
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
      movesArr = checkForPin(movesArr);

      return { legalMoves: movesArr, guarded: movesArr, pinLines: movesArr };
    };

    const getBishopMoves = (init) => {
      movesArr = getLine45deg(init, movesArr);
      movesArr = getLine135deg(init, movesArr);
      movesArr = getLine225deg(init, movesArr);
      movesArr = getLine315deg(init, movesArr);

      movesArr = checkPiecesAhead(movesArr);
      movesArr = checkForPin(movesArr);

      return { legalMoves: movesArr, guarded: movesArr, pinLines: movesArr };
    };

    const getRookMoves = (init) => {
      movesArr = getLine0deg(init, movesArr);
      movesArr = getLine90deg(init, movesArr);
      movesArr = getLine180deg(init, movesArr);
      movesArr = getLine270deg(init, movesArr);

      movesArr = checkPiecesAhead(movesArr);
      movesArr = checkForPin(movesArr);

      return { legalMoves: movesArr, guarded: movesArr, pinLines: movesArr };
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

      movesArr = checkForPin(movesArr);

      return { legalMoves: movesArr, guarded: movesArr, pinLines: movesArr };
    };

    if (curPiece.includes('King')) {
      const pushMove = (y, x, line, castle) => {
        const possible = [y, x, line, castle];
        let isEqual = false;

        if (y === curPosition[0] && x === curPosition[1]) {
          isEqual = true;
        }

        if (y >= 1 && y <= 8 && x >= 1 && x <= 8 && !isEqual) {
          movesArr.push(possible);
        }
      };

      const [curY, curX] = curPosition;

      // King Moves
      pushMove(curPosition[0] - 1, curPosition[1], '0', false);
      pushMove(curPosition[0] - 1, curPosition[1] + 1, '45', false);
      pushMove(curPosition[0], curPosition[1] + 1, '90', false);

      if (playerSide === 'white') {
        if (side === 'white') {
          if (curY === 8 && curX === 5) {
            movesArr.push([8, 7, '90', true]);
          }
        }

        if (side === 'black') {
          if (curY === 1 && curX === 5) {
            movesArr.push([1, 7, '90', true]);
          }
        }
      }

      if (playerSide === 'black') {
        if (curY === 8 && curX === 5) {
          movesArr.push([8, 7, '90', true]);
        }

        if (curY === 8 && curX === 4) {
          movesArr.push([8, 6, '90', true]);
          movesArr.push([8, 7, '90', true]);
        }

        if (side === 'white') {
          if (curY === 1 && curX === 4) {
            movesArr.push([1, 6, '90', true]);
            movesArr.push([1, 7, '90', true]);
          }
        }

        if (side === 'black') {
          if (curY === 8 && curX === 4 ) {
            movesArr.push([8, 6, '90', true]);
            movesArr.push([8, 7, '90', true]);
          }
        }
      }
     
      pushMove(curPosition[0] + 1, curPosition[1] + 1, '135', false);
      pushMove(curPosition[0] + 1, curPosition[1], '180', false);
      pushMove(curPosition[0] + 1, curPosition[1] - 1, '225', false);
      pushMove(curPosition[0], curPosition[1] - 1, '270', false);
      
      if (playerSide === 'white') {
        if (side === 'white') {
          if (curY === 8 && curX === 5) {
            movesArr.push([8, 3, '270', true]);
            movesArr.push([8, 2, '270', true]);
          }
        }

        if (side === 'black') {
          if (curY === 1 && curX === 5) {
            movesArr.push([1, 3, '270', true]);
            movesArr.push([1, 2, '270', true]);
          }
        }
      }

      if (playerSide === 'black') {
        if (side === 'white') {
          if (curY === 1 && curX === 4) {
            movesArr.push([1, 2, '270', true]);
          }
        }

        if (side === 'black') {
          if (curY === 8 && curX === 4) {
            movesArr.push([8, 2, '270', true]);
          }
        }
      }

      pushMove(curPosition[0] - 1, curPosition[1] - 1, '315', false);

      //King Possible Pin Lines
      let pinLines = [];

      pinLines = pinLines = getLine0deg(curPosition, pinLines);
      pinLines = getLine45deg(curPosition, pinLines);
      pinLines = getLine90deg(curPosition, pinLines);
      pinLines = getLine135deg(curPosition, pinLines);
      pinLines = getLine180deg(curPosition, pinLines);
      pinLines = getLine225deg(curPosition, pinLines);
      pinLines = getLine270deg(curPosition, pinLines);
      pinLines = getLine315deg(curPosition, pinLines);

      pinLines = checkPiecesAhead(pinLines, true);

      const pieces = Object.keys(map);
      let movesArr2 = [];

      movesArr.forEach((move) => {
        const [y, x] = move;

        let isLegal = true;

        pieces.forEach((piece) => {
          if (!isLegal || piece.includes(side)) return;

          const opponentMoves = piece.includes('King') || piece.includes('Pawn')
            ? map[piece].guarded
            : map[piece].legalMoves;
          
          opponentMoves.forEach((el) => {
            if (el[0] === y && el[1] === x) {
              isLegal = false;
            }
          });
        });

        if (isLegal) movesArr2.push(move);
      });

      movesArr2 = checkPiecesAhead(movesArr2);

      let isLegalToLeft = false;
      let isLegalToRight = false;
      let isLeftRookUntouched = false;
      let isRightRookUntouched = false;

      if (playerSide === 'white') {
        if (side === 'white') {
          if (curY === 8 && curX === 5) {
            isLegalToLeft = movesArr2.some(el => el[0] === 8 && el[1] === 2);
            isLegalToRight = movesArr2.some(el => el[0] === 8 && el[1] === 7);
            isLeftRookUntouched = map.whiteRook0.coords[0] === 8
              && map.whiteRook0.coords[1] === 1;
            isRightRookUntouched = map.whiteRook1.coords[0] === 8
            && map.whiteRook1.coords[1] === 8;
            // console.log('1', movesArr2);

            if (!isLegalToLeft) {
              movesArr2 = movesArr2.filter(el => el[1] !== 3);
            } else {
              movesArr2 = movesArr2.filter(el => el[1] !== 2);

              if (!isLeftRookUntouched) {
                movesArr2 = movesArr2.filter(el => el[1] !== 3);
              }
            }

            if (isLegalToRight) {
              if (!isRightRookUntouched) {
                movesArr2 = movesArr2.filter(el => el[1] !== 7);
              }
            }
            
            // console.log('2', movesArr2, isLeftRookUntouched, isRightRookUntouched);
          }
        }

        if (side === 'black') {
          if (curY === 1 && curX === 5) {
            isLegalToLeft = movesArr2.some(el => el[0] === 1 && el[1] === 2);
            isLegalToRight = movesArr2.some(el => el[0] === 1 && el[1] === 7);
            isLeftRookUntouched = map.blackRook0.coords[0] === 1
              && map.blackRook0.coords[1] === 1;
            isRightRookUntouched = map.blackRook1.coords[0] === 1
              && map.blackRook1.coords[1] === 8;

            if (!isLegalToLeft) {
              movesArr2 = movesArr2.filter(el => el[1] !== 3);
            } else {
              movesArr2 = movesArr2.filter(el => el[1] !== 2);

              if (!isLeftRookUntouched) {
                movesArr2 = movesArr2.filter(el => el[1] !== 3);
              }
            }

            if (isLegalToRight) {
              if (!isRightRookUntouched) {
                movesArr2 = movesArr2.filter(el => el[1] !== 7);
              }
            }
          }
        }
      }

      if (playerSide === 'black') {
        if (side === 'white') {
          if (curY === 1 && curX === 4) {
            isLegalToLeft = movesArr2.some(el => el[0] === 1 && el[1] === 2);
            isLegalToRight = movesArr2.some(el => el[0] === 1 && el[1] === 7);
            isLeftRookUntouched = map.whiteRook1.coords[0] === 1
              && map.whiteRook1.coords[1] === 1;
            isRightRookUntouched = map.whiteRook0.coords[0] === 1
              && map.whiteRook0.coords[1] === 8;

            if (!isLegalToRight) {
              movesArr2 = movesArr2.filter(el => el[1] !== 6);
            } else {
              movesArr2 = movesArr2.filter(el => el[1] !== 7);

              if (!isRightRookUntouched) {
                movesArr2 = movesArr2.filter(el => el[1] !== 6);
              }
            }

            if (isLegalToLeft) {
              if (!isLeftRookUntouched) {
                movesArr2 = movesArr2.filter(el => el[1] !== 2);
              }
            }
          }
        }

        if (side === 'black') {
          console.log(movesArr2);
          if (curY === 8 && curX === 4) {
            isLegalToLeft = movesArr2.some(el => el[0] === 8 && el[1] === 2);
            isLegalToRight = movesArr2.some(el => el[0] === 8 && el[1] === 7);
            isLeftRookUntouched = map.blackRook1.coords[0] === 8
              && map.blackRook1.coords[1] === 1;
            isRightRookUntouched = map.blackRook0.coords[0] === 8
              && map.blackRook0.coords[1] === 8;

            if (!isLegalToRight) {
              movesArr2 = movesArr2.filter(el => el[1] !== 6);
            } else {
              movesArr2 = movesArr2.filter(el => el[1] !== 7);

              if (!isRightRookUntouched) {
                movesArr2 = movesArr2.filter(el => el[1] !== 6);
              }
            }

            if (isLegalToLeft) {
              if (!isLeftRookUntouched) {
                movesArr2 = movesArr2.filter(el => el[1] !== 2);
              }
            }
          }
        }
      }


      // if (curY === 8) {
      //   let isLegalToLeft = false;
      //   let isLegalToRight = false;

      //   if (playerSide === 'white') {
      //     if (!curX === 5) return;

      //     filteredMovesArr.forEach((el) => {
      //       if (!el[0] === curY) return; 
      //       if (el[1] === curX - 1) isLegalToLeft = true;
      //       if (el[1] === curX + 1) isLegalToRight = true;
      //     });

      //     if (isLegalToLeft) {
            
      //     }

      //     if (isLegalToRight) {

      //     }
      //   }

      //   if (playerSide === 'black') {
      //     if (!curX === 4) return;
            
      //     filteredMovesArr.forEach((el) => {
      //       if (!el[0] === curY) return;
      //       if (el[1] === curX - 1) isLegalToLeft = true;
      //       if (el[1] === curX + 1) isLegalToRight = true;
      //     });

      //     if (isLegalToLeft) {

      //     }

      //     if (isLegalToRight) {

      //     }
      //   }
      // }

      return { legalMoves: movesArr2, guarded: movesArr, pinLines };
    }

    if (curPiece.includes('Pawn')) {
      const [curY, curX] = curPosition;

      const mySide = () => {
        if (curY === 7) {
          return [[6, curX, '0'], [5, curX, '0'], [6, curX + 1, '45'], [6, curX - 1, '315']];
        } else {
          return [[curY - 1, curX, '0'], [curY - 1, curX + 1, '45'], [curY - 1, curX - 1, '315']];
        }
      }

      const oppSide = () => {
        if (curY === 2) {
          return [[3, curX + 1, '135'], [3, curX, '180'], [4, curX, '180'], [3, curX - 1, '225']];
        } else {
          return [[curY + 1, curX + 1, '135'], [curY + 1, curX, '180'], [curY + 1, curX - 1, '315']];
        }
      }

      if (playerSide === 'white') {
        if (side === 'white') {
          movesArr = mySide();
        }

        if (side === 'black') {
          movesArr = oppSide();
        }
      }

      if (playerSide === 'black') {
        if (side === 'white') {
          movesArr = oppSide();
        }

        if (side === 'black') {
          movesArr = mySide();
        }
      }

      const conditionalMoves = movesArr.filter(el => {
        return el[2] !== '180' && el[2] !== '0';
      });

      let filteredMovesArr = [];
      let cleaned = '';

      const piecesArr = Object.keys(map);
      movesArr.forEach((move) => {
        const [moveY, moveX, moveLine] = move;
        const isPassiveMove = moveLine === '180' || moveLine === '0';

        let isEmpty = true;

        piecesArr.forEach((pieceName) => {
          if (!isEmpty) return;
          
          const [pieceY, pieceX] = map[pieceName].coords;

          if (pieceY === moveY && pieceX === moveX) {
            isEmpty = false;

            if (!isPassiveMove && !pieceName.includes(side)) {
              filteredMovesArr.push(move);
            } else {
              cleaned = moveLine;
            }
          }
        });

        if (isPassiveMove) {
          if (isEmpty && moveLine !== cleaned) {
            filteredMovesArr.push(move);
          }
        }
      });

      return { legalMoves: filteredMovesArr, guarded: conditionalMoves, pinLines: filteredMovesArr };
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
