let squares = [];

for (let k = 0; k < 8; k++) {
  for (let i = 0; i < 8; i++) {
    if (k % 2 === 0) {
      if (i % 2 === 0) {
        squares.push(
          <div key={k + 1.22 * i} className="square light">
            <div className="dot"></div>
          </div>
        );
      } else {
        squares.push(
          <div key={k + 3.11 * i} className="square dark">
            <div className="dot"></div>
          </div>
        );
      }
    } else {
      if (i % 2 !== 0) {
        squares.push(
          <div key={k + 3.633 * i} className="square light">
            <div className="dot"></div>
          </div>
        );
      } else {
        squares.push(
          <div key={k + 3.33 * i} className="square dark">
            <div className="dot"></div>
          </div>
        );
      }
    }
  }
}

export default squares;

