const getFen = (map, playerSide) => {
  const obj = {};

  // IMPLEMENT FUNCTION TO INVERT THE BLACK PLAYER MAP

  for (let i = 1; i <= 8; i++) {
    obj[`${i}`] = {};
    for (let k = 1; k <= 8; k++) {
      obj[`${i}`][`${k}`] = '';
    }
  }

  Object.keys(map).forEach((piece) => {
    const { coords } = map[piece];
    let [y, x] = coords;

    if (y === 0) return;

    let letter = piece[5];
    if (piece.includes('Knight')) letter = 'N';
    if (piece.includes('black')) letter = letter.toLowerCase();

    if (playerSide === 'black') {
      y = (4.5 - y) * 2 + y;
      x = (4.5 - x) * 2 + x;
    }

    obj[y][x] = letter; 
  });

  let str = '';

  for (let i = 1; i <= 8; i++) {
    let isEmpty = true;

    for (let k = 1; k <= 8; k++) {
      str += obj[`${i}`][`${k}`];
      if (obj[`${i}`][`${k}`] !== '') isEmpty = false;
    }

    if (isEmpty) {
      str += '8';
    } else {
      const lineArr = Object.values(obj[`${i}`]);
      const nonEmptySquares = lineArr.join('').length;

      str = str.slice(0, str.length - nonEmptySquares);

      const strArr = [];
      let count = 1;

      Object.values(obj[`${i}`]).forEach((el, i, arr) => {
        if (i === 0) return strArr.push(el);
      
        if (el !== '') {
          if (arr[i - 1] === '') strArr.push(count);
          strArr.push(el);
          
          count = 1;

          return;
        }

        if (el === arr[i - 1]) {
          count += 1;
        }

        if (i === 7) strArr.push(count);
      })

      str += strArr.join('');
    }

    if (i < 8) str += '/';
  }

  return str;
}

export default getFen;