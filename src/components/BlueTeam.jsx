import React, { useState, useEffect } from "react";
import BlueBlock from "../images/blueteam.svg";
import "./css/blueteam.css";

function BlueTeam({ playerList }) {
  // const [player, setPlayer] = useState(playername);
  // const [playerList, setPlayerList] = useState([]);

  // useEffect(() => {
  //   setPlayerList([playername]);
  // }, [playername]);

  return (
    <div>
      <div className="blueblock">
        <img src={BlueBlock} alt="Team Blue" className="blueblock__block" />
        <div className="blueblock__playerlist">
        <ul>
          {playerList.map((name, key) => {
            return <li key={key}>{name}</li>;
          })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BlueTeam;
