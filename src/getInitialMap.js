const getInitialMap = (side) => {
  return {
    whiteQueen: {
      chess: 'd1',
      coords: side === 'white' ? [8, 4] : [1, 5],
      legalMoves:
        side === 'white'
          ? [
              [7, 4, '0'],
              [7, 5, '45'],
              [8, 5, '90'],
              [8, 3, '270'],
            ]
          : [
              [1, 6, '90'],
              [2, 6, '135'],
              [2, 5, '180'],
              [2, 4, '225'],
              [1, 4, '270'],
            ],
    },
    whiteKing: {
      chess: 'e1',
      coords: side === 'white' ? [8, 5] : [1, 4],
      legalMoves:
        side === 'white'
          ? [
              [7, 4],
              [7, 5],
              [7, 6],
              [8, 4],
              [8, 6],
            ]
          : [
              [1, 3],
              [1, 5],
              [2, 3],
              [2, 4],
              [2, 5],
            ],
    },
    whiteBishop: [
      {
        chess: 'c1',
        coords: side === 'white' ? [8, 3] : [1, 6],
        legalMoves:
          side === 'white'
            ? [
                [7, 4, '45'],
                [7, 2, '315'],
              ]
            : [
                [2, 7, '135'],
                [2, 5, '225'],
              ],
      },
      {
        chess: 'f1',
        coords: side === 'white' ? [8, 6] : [1, 3],
        legalMoves:
          side === 'white'
            ? [
                [7, 7, '45'],
                [7, 5, '315'],
              ]
            : [
                [2, 7, '135'],
                [2, 5, '225'],
              ],
      },
    ],
    whiteKnight: [
      {
        chess: 'b1',
        coords: side === 'white' ? [8, 2] : [1, 7],
        legalMoves:
          side === 'white'
            ? [
                [6, 1],
                [6, 3],
                [7, 4],
              ]
            : [
                [2, 5],
                [3, 6],
                [3, 8],
              ],
      },
      {
        chess: 'g1',
        coords: side === 'white' ? [8, 7] : [1, 2],
        legalMoves:
          side === 'white'
            ? [
                [6, 6],
                [6, 8],
                [7, 5],
              ]
            : [
                [2, 4],
                [3, 1],
                [3, 3],
              ],
      },
    ],
    whiteRook: [
      {
        chess: 'a1',
        coords: side === 'white' ? [8, 1] : [1, 8],
        legalMoves:
          side === 'white'
            ? [
                [7, 1, '0'],
                [8, 2, '90'],
              ]
            : [
                [2, 8, '180'],
                [1, 7, '270'],
              ],
      },
      {
        chess: 'h1',
        coords: side === 'white' ? [8, 8] : [1, 1],
        legalMoves:
          side === 'white'
            ? [
                [7, 8, '0'],
                [8, 7, '270'],
              ]
            : [
                [1, 2, '90'],
                [2, 1, '180'],
              ],
      },
    ],
    blackQueen: {
      chess: 'd8',
      coords: side === 'white' ? [1, 4] : [8, 5],
      legalMoves:
        side === 'white'
          ? [
              [1, 5, '90'],
              [2, 5, '135'],
              [2, 4, '180'],
              [2, 3, '225'],
              [1, 3, '270'],
            ]
          : [
              [7, 5, '0'],
              [7, 6, '45'],
              [8, 6, '90'],
              [8, 4, '270'],
              [7, 3, '315'],
            ],
    },
    blackKing: {
      chess: 'e8',
      coords: side === 'white' ? [1, 5] : [8, 4],
      legalMoves:
        side === 'white'
          ? [
              [1, 4],
              [1, 6],
              [2, 4],
              [2, 5],
              [2, 6],
            ]
          : [
              [7, 3],
              [7, 4],
              [7, 5],
              [8, 3],
              [8, 5],
            ],
    },
    blackBishop: [
      {
        chess: 'c8',
        coords: side === 'white' ? [1, 3] : [8, 6],
        legalMoves:
          side === 'white'
            ? [
                [2, 4, '135'],
                [2, 2, '225'],
              ]
            : [
                [7, 7, '45'],
                [7, 5, '315'],
              ],
      },
      {
        chess: 'f8',
        coords: side === 'white' ? [1, 6] : [8, 3],
        legalMoves:
          side === 'white'
            ? [
                [2, 7, '135'],
                [2, 5, '225'],
              ]
            : [
                [7, 4, '45'],
                [7, 2, '315'],
              ],
      },
    ],
    blackKnight: [
      {
        chess: 'b8',
        coords: side === 'white' ? [1, 2] : [8, 7],
        legalMoves:
          side === 'white'
            ? [
                [2, 4],
                [3, 1],
                [3, 3],
              ]
            : [
                [6, 6],
                [6, 8],
                [7, 5],
              ],
      },
      {
        chess: 'g8',
        coords: side === 'white' ? [1, 7] : [8, 2],
        legalMoves:
          side === 'white'
            ? [
                [2, 5],
                [3, 6],
                [3, 8],
              ]
            : [
                [6, 1],
                [6, 3],
                [7, 4],
              ],
      },
    ],
    blackRook: [
      {
        chess: 'a8',
        coords: side === 'white' ? [1, 1] : [8, 8],
        legalMoves:
          side === 'white'
            ? [
                [1, 2, '90'],
                [2, 1, '180'],
              ]
            : [
                [7, 8, '0'],
                [8, 7, '270'],
              ],
      },
      {
        chess: 'h8',
        coords: side === 'white' ? [1, 8] : [8, 1],
        legalMoves:
          side === 'white'
            ? [
                [1, 2, '90'],
                [2, 1, '180'],
              ]
            : [
                [7, 8, '0'],
                [8, 7, '270'],
              ],
      },
    ],
  };
};

export default getInitialMap;
