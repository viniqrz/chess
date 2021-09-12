import React, { useState } from 'react';

import './Game.scss';

import Board from '../../components/Board/Board';

const Game = () => {
  return (
    <div className="game-page">
      <Board side="white"/>
    </div>
  );
}

export default Game;