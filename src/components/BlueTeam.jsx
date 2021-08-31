import React, { useState, useEffect } from "react";
import BlueBlock from "../images/blueteam.svg";
import "./css/blueteam.css";

function BlueTeam({ playerListBlue }) {

  return (
    <div>
      <div className="blueblock">
        <img src={BlueBlock} alt="Team Blue" className="blueblock__block" />
        <div className="blueblock__playerlist">
        <ul>
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
