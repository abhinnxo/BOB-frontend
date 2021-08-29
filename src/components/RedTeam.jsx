import React, { useEffect, useState } from "react";
import RedBlock from "../images/redteam.svg";
import "./css/redteam.css";

const RedTeam = ({ playerList }) => {

  return (
    <div>
      <div className="redblock">
        <img src={RedBlock} alt="Team Red"  
        className="redblock__block"
        />
        <div className="redblock__playerlist">
          <ul>
          {playerList.map((name, key) => {
            return <li key={key}>{name}</li>;
          })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RedTeam;
