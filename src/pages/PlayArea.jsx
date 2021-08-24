import React, { useState, useEffect } from "react";
import { ListGroup, InputGroup, FormControl, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "../css/playarea.css";
var customId = require("custom-id");

const PlayArea = () => {
  const [nickname, setNickname] = useState("");
  const [team, setTeam] = useState("");
  const [playerList, setPlayerList] = useState([]);
  const [hint, setHint] = useState("");
  const [hintList, setHintList] = useState([]);

  const location = useLocation();

  //  Get credentials from Location State
  useEffect(() => {
    setNickname(location.state.nickname);
    setTeam(location.state.team);
  }, []);

  // Add Player Names in the List on the Left
  useEffect(() => {
    setPlayerList(
      playerList.concat(
        <ListGroup.Item key={customId({})}>{nickname}</ListGroup.Item>
      )
    );
  }, [nickname]);

  // Send Hint to socket
  const sendHint = () => {
    // TODO: Send hint to socket (broadcast/emit)

    if (hint.trim().split(" ").length == 1 && hint != "") {
      setHintList(
        hintList.concat(
          <ListGroup.Item
            key={customId({})}
            style={{ width: "200x", wordWrap: "break-word" }}
          >
            {hint}
          </ListGroup.Item>
        )
      );
      document
        .querySelector("#hint-info")
        .scrollTo(0, document.querySelector("#hint-info").scrollHeight);
      setHint("");
    } else console.log("WRONG!");
  };

  return (
    <div className="playingarea">
      {/* Navbar */}
      <div className="jumbotron py-3 px-5 d-flex navbar">
        <h1 className="display-5 text-white">Battle Of Brains</h1>
        {team === "red" ? (
          <p
            className="my-auto ml-3 py-1 px-2 rounded"
            style={{ color: "white", background: "#D53343" }}
          >
            Team Red
          </p>
        ) : (
          <p
            className="my-auto m-3 py-1 px-2 rounded"
            style={{ color: "white", background: "#0D6FFC" }}
          >
            Team Blue
          </p>
        )}
        <p
          className="d-flex rounded-pill px-2 py-1 border my-auto"
          style={{ background: "white" }}
          id="room-id"
        >
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
      <div className="d-flex justify-content-center mt-2" id="team-table">
        {/* Player Name */}
        <div id="player-names">
          <ListGroup.Item active>Player Names</ListGroup.Item>
          <ListGroup>{playerList}</ListGroup>
        </div>
        {/* Hints Input */}
        <div className="" id="hints-block">
          <div id="hint-info">
            <ListGroup.Item>Welcome to the team room!</ListGroup.Item>
            {hintList}
          </div>
          <div id="hint-input">
            <InputGroup className="mt-auto d-flex">
              <InputGroup.Text id="inputGroup-sizing-default">
                Enter your Hints
              </InputGroup.Text>
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
              />
              <Button variant="outline-primary" onClick={sendHint}>
                Submit
              </Button>
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayArea;
