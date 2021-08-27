import React, { useEffect, useState } from "react";
import RedBlock from "../images/redteam.svg";
import "./css/redteam.css";

const RedTeam = ({ playername }) => {
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
      console.log("red", playername);
    setPlayerList([playername]);
  }, [playername]);

  return (
    <div>
      <div className="redblock">
        <img src={RedBlock} alt="Team Red"  
        className="redblock__block"
        />
        <div className="redblock__playerlist">
          {playerList.map((name, key) => {
            return <p key={key}>{name}</p>;
          })}
        </div>
      </div>
    </div>
  );
};

export default RedTeam;
