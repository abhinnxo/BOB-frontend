import React, { useState } from "react";
import { Alert, InputGroup, FormControl, Button, Badge } from "react-bootstrap";
import "../css/gusser.css";

const Gusser = () => {
  const [guess, setGuess] = useState("");
  const [guessList, setGuessList] = useState([]);

  const addGuess = () => {
    if (
      guessList.length <= 3 &&
      guess.trim().split(" ").length == 1 &&
      guess != ""
    ) {
      setGuessList(guessList.concat(guess));
      setGuess("");
    }
  };

  return (
    <div>
      {/* NAVBAR */}
      <div className="jumbotron py-3 px-5 d-flex navbar">
        <h1 className="display-5 text-white">Battle Of Brains</h1>
        <p
          className="d-flex py-1 px-2 rounded-pill border my-auto"
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
      {/* Player Type */}
      <div className="text-center">
        <Alert variant="info">
          You're the Gusser
          <br />
          waiting for the clues...
        </Alert>
      </div>
      <div className="border mx-auto" id="clue-box">
        {/* INPUT BOX */}
        <InputGroup className="mt-auto d-flex">
          <InputGroup.Text id="inputGroup-sizing-default">
            Enter your Gusses
          </InputGroup.Text>
          <FormControl
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <Button variant="outline-primary" onClick={addGuess}>
            Submit
          </Button>
        </InputGroup>
        {/* GUSSES */}
        <h2>
          <Badge bg="secondary">New</Badge>
        </h2>
        {guessList}
      </div>
    </div>
  );
};

export default Gusser;
