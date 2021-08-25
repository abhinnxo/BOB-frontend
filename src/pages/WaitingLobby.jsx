import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Team from "../components/Team";
import { Alert, Button } from "react-bootstrap";
import RedBlock from "../images/redteam.svg"
import BlueBlock from "../images/blueteam.svg"
import "../css/waitinglobby.css";
import JoinButton from "../components/JoinButton";

const WaitingLobby = () => {
  const location = useLocation();

  

  return (
    <div className="lobby">
      <JoinButton classlist="lobby__joinbtn" />
    <div className="lobby__teamtable">
      <img src={RedBlock} alt="" srcset="" />
      <img src={BlueBlock} alt="" srcset="" />
    </div>
    </div>
  );
};

export default WaitingLobby;