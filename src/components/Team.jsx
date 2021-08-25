import React, { useState } from "react";
import { Card, ListGroup, Button } from "react-bootstrap";
var customId = require("custom-id");

const Team = ({ host, nickname, teamname }) => {
  const [playerList, setPlayerList] = useState([]);
  // const [teamname, setTeamname] = useState("Team Name");

  const addPlayer = () => {
    // document.querySelector("#join-button").style.display = "none";
    setPlayerList(
      playerList.concat(
        <ListGroup.Item key={customId({})}> {nickname}</ListGroup.Item>
      )
    );
  };

  return (
    <Card
      bg={teamname === "Team Red" ? "danger" : "primary"}
      style={{ width: "18rem" }}
    >
      <Card.Header className="d-flex justify-content-between">
        <h4 className="my-auto text-white">{teamname}</h4>

        {!host && (
          <Button
            variant="warning"
            className=""
            onClick={addPlayer}
            id="join-button"
          >
            + Join
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">{playerList}</ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Team;
