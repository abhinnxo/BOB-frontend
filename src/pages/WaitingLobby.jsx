import React from "react";
import BlueBlock from "../images/blueteam.svg";
import "../css/waitinglobby.css";
import BackButton from "../images/back_button.svg";
import RedBlock from "../images/redteam.svg";
import ImageButton from "../components/ImageButton";

const WaitingLobby = () => {
  const startgame = () => {
    alert("game started...");
  };

  return (
    <div className="lobby">
      <div className="bg"></div>
      <div className="lobby__back">
        <img src={BackButton} alt="back" />
      </div>
      <div className="lobby__teamtable">
        <div className="lobby__code">212121</div>
        <input type="button" name="button" className="lobby__redteam" />
        <img src={RedBlock} alt="" srcset="" />
        <input type="button" name="button" className="lobby__blueteam" />
        <img src={BlueBlock} alt="" srcset="" />
        <ImageButton
          clickMe={startgame}
          classlist="lobby__startbtn mx-auto"
          value="START"
        />
      </div>
    </div>
  );
};

export default WaitingLobby;
