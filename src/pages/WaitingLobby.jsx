import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Team from "../components/Team";
import { Alert, Button } from "react-bootstrap";

import "../css/waitinglobby.css";

const WaitingLobby = () => {
  const location = useLocation();

  useEffect(() => {
    // const host = localStorage.getItem("host");
    console.log(location.state.host);

    if (location.state.host == true) {
      document.querySelector("#host").style.display = "block";
    }
  }, []);

  return (
    <div>
      <div className="text-center py-5 jumbotron">
        <h1 className="display-5 mb-3">Waiting Lobby</h1>
        <p className="d-flex rounded-pill border" id="room-id">
          {localStorage.getItem("roomid")}
          <i
            className="bi bi-clipboard"
            onClick={() => {
              navigator.clipboard.writeText(localStorage.getItem("roomid"));
              document.querySelector(".bi-clipboard-check").style.display =
                "block";
              document.querySelector(".bi-clipboard").style.display = "none";
              setTimeout(() => {
                document.querySelector(".bi-clipboard-check").style.display =
                  "none";
                document.querySelector(".bi-clipboard").style.display = "block";
              }, 1000);
            }}
          ></i>
          <i className="bi bi-clipboard-check" style={{ display: "none" }}></i>
        </p>
      </div>

      <Alert
        variant="warning"
        className="py-3"
        style={{ display: "none" }}
        id="host"
      >
        You're the Room Host!
      </Alert>
      {/* Team Cards */}
      <div className="parent">
        <Team
          teamname={"Team Red"}
          host={location.state.host}
          nickname={location.state.nickname}
        />
        <Team
          teamname={"Team Blue"}
          host={location.state.host}
          nickname={location.state.nickname}
        />
      </div>
      <Button variant="outline-warning">Start</Button>
    </div>
  );
};

export default WaitingLobby;