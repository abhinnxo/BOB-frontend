import React from 'react';
import BlueBlock from '../images/blueblock.webp';
import './css/blueteam.css';

function BlueTeam({ playerListBlue }) {
  return (
    <div>
      <div className="blueblock">
        <img src={BlueBlock} alt="Team Blue" className="blueblock__block" />
        <div className="blueblock__playerlist">
          <ul className="blueblock__ul">
            {playerListBlue.map((name, key) => {
              return <li key={key}>{name}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BlueTeam;
