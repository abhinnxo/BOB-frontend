import React from 'react';
import '../css/finalscore.css';
import '../images/bluescore.webp';

const FinalScore = () => {
  return (
    <div>
      <div className="score__bg"></div>
      <div className="score__main">
        <div className="score__roundno">Round 1</div>
        <div className="score__teamcards">
          <div className="score__teamred"></div>
          <div className="score__teamblue"></div>
        </div>
        <button className="score__nextround"></button>
      </div>
    </div>
  );
};

export default FinalScore;
