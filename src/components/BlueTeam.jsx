import React, { useState, useEffect } from "react";
import BlueBlock from "../images/blueteam.svg";
import "./css/blueteam.css";

function BlueTeam({ playername }) {
  // const [player, setPlayer] = useState(playername);
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    setPlayerList([playername]);
  }, [playername]);

  return (
    <div>
      <div className="blueblock">
        <img src={BlueBlock} alt="Team Blue" className="blueblock__block" />
        <div className="blueblock__playerlist">
          {playerList.map((name, key) => {
            return <p key={key}>{name}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

export default BlueTeam;
