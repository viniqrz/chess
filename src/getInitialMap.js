const getInitialMap = (side) => {
  return {
    whiteQueen: {
      chess: 'd1',
      coords: side === 'white' ? [8,4] : [1,5],
    },
    whiteKing: {
      chess: 'e1',
      coords: side === 'white' ? [8,5] : [1,4],
    },
    whiteBishop: [
      {
        chess: 'c1',
        coords: side === 'white' ? [8,3] : [1,6],
      },
      {
        chess: 'f1',
        coords: side === 'white' ? [8,6] : [1,3],
      }
    ],
    whiteKnight: [
      {
        chess: 'b1',
        coords: side === 'white' ? [8,2] : [1,7],
      },
      {
        chess: 'g1',
        coords: side === 'white' ? [8,7] : [1,2],
      }
    ],
    whiteRook: [
      {
        chess: 'a1',
        coords: side === 'white' ? [8,1] : [1,8],
      },
      {
        chess: 'h1',
        coords: side === 'white' ? [8,8] : [1,1],
      }
    ],
    blackQueen: {
      chess: 'd8',
      coords: side === 'white' ? [1,4] : [8,5],
    },
    blackKing: {
      chess: 'e8',
      coords: side === 'white' ? [1,5] : [8,4],
    },
    blackBishop: [
      {
        chess: 'c8',
        coords: side === 'white' ? [1,3] : [8,6],
      },
      {
        chess: 'f8',
        coords: side === 'white' ? [1,6] : [8,3],
      }
    ],
    blackKnight: [
      {
        chess: 'b8',
        coords: side === 'white' ? [1,2] : [8,7],
      },
      {
        chess: 'g8',
        coords: side === 'white' ? [1,7] : [8,2],
      }
    ],
    blackRook: [
      {
        chess: 'a8',
        coords: side === 'white' ? [1,1] : [8,8],
      },
      {
        chess: 'h8',
        coords: side === 'white' ? [1,8] : [8,1],
      }
    ],
  }
}

export default getInitialMap;