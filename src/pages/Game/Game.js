import React, { useState } from 'react';

import './Game.scss';

import Board from '../../components/Board/Board';

const Game = () => {
  const [up, setUp] = useState(false);

  const setUpTrue = () => setUp(true);
  const setUpFalse = () => setUp(false);

  return (
    <div onMouseUp={ setUpTrue } className="game-page">
      <Board side="white" up={ up } switchUp={ setUpFalse } />
    </div>
  );
}

export default Game;