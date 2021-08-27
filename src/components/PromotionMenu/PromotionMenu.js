import React from 'react';

import './PromotionMenu.scss';

import whiteQueen from './../../img/whiteQueen.svg';
import blackQueen from './../../img/blackQueen.svg';
import whiteRook from './../../img/whiteRook.svg';
import blackRook from './../../img/blackRook.svg';
import whiteKnight from './../../img/whiteKnight.svg';
import blackKnight from './../../img/blackKnight.svg';
import whiteBishop from './../../img/whiteBishop.svg';
import blackBishop from './../../img/blackBishop.svg';

const PromotionMenu = (props) => {
  return (
    <div className="promotion-overlay">
      <div className="promotion-menu">
        { props.side === 'white' &&  (
          <>
            <img src={whiteQueen} alt="whiteQueen" />
            <img src={whiteRook} alt="whiteRook" />
            <img src={whiteKnight} alt="whiteKnight" />
            <img src={whiteBishop} alt="whiteBishop" />
          </>
        )}

        { props.side === 'black' &&  (
          <>
            <img src={blackQueen} alt="blackQueen" />
            <img src={blackRook} alt="blackRook" />
            <img src={blackKnight} alt="blackKnight" />
            <img src={blackBishop} alt="blackBishop" />
          </>
        )}
      </div>
    </div>
  );
}

export default PromotionMenu;