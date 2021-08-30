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
  const clickHandler = (e) => {
    props.onSelect(e.target.alt);
  };

  return (
    <div className="promotion-overlay">
      <div className="promotion-menu">
        {props.side === 'white' && (
          <>
            <img onClick={clickHandler} src={whiteQueen} alt="whiteQueen" />
            <img onClick={clickHandler} src={whiteRook} alt="whiteRook" />
            <img onClick={clickHandler} src={whiteKnight} alt="whiteKnight" />
            <img onClick={clickHandler} src={whiteBishop} alt="whiteBishop" />
          </>
        )}

        {props.side === 'black' && (
          <>
            <img onClick={clickHandler} src={blackQueen} alt="blackQueen" />
            <img onClick={clickHandler} src={blackRook} alt="blackRook" />
            <img onClick={clickHandler} src={blackKnight} alt="blackKnight" />
            <img onClick={clickHandler} src={blackBishop} alt="blackBishop" />
          </>
        )}
      </div>
    </div>
  );
};

export default PromotionMenu;
