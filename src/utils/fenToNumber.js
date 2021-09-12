const fenToNumber = (data, playerSide) => {
  const reverseCoords = (a) => (4.5 - a) * 2 + a;

  const fenYArray = [data[1] * 1, data[3] * 1];
  const fenXArray = [data[0], data[2]];

  let initial = [];
  let final = [];

  console.log(fenYArray);

  const pushYToCoords = (c, arr) => {
    if (playerSide === 'white') arr.push(reverseCoords(c));
    if (playerSide === 'black') arr.push(c);
  }

  const pushXToCoords = (c, arr) => {
    if (playerSide === 'black') arr.push(reverseCoords(c));
    if (playerSide === 'white') arr.push(c);
  }

  fenYArray.forEach((fenY, i) => {
    if (i === 0) pushYToCoords(fenY, initial);
    if (i === 1) pushYToCoords(fenY, final);
  })

  fenXArray.forEach((fenX, i) => {
    let coord;

    if (fenX === 'a') coord = 1;
    if (fenX === 'b') coord = 2;
    if (fenX === 'c') coord = 3;
    if (fenX === 'd') coord = 4;
    if (fenX === 'e') coord = 5;
    if (fenX === 'f') coord = 6;
    if (fenX === 'g') coord = 7;
    if (fenX === 'h') coord = 8;

    if (i === 0) pushXToCoords(coord, initial);
    if (i === 1) pushXToCoords(coord, final);
  });

  return [initial, final];
}

export default fenToNumber;