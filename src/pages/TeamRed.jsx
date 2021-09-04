// Team Red Players will enter their hinst here
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import ImageButton from "../components/ImageButton";
import ImageInput from "../components/ImageInput";
import Clock from "../images/clock.svg";
import "../css/teamred.css";
const axios = require("axios");

const TeamRed = ({ socket }) => {
  const [hint, setHint] = useState("");
  const [roundfromBackend, setRoundFromBackend] = useState(0);
  const [chatmsgSent, setchatmsgSent] = useState(0);
  const [score, setScore] = useState(0);
  const [randomword, setRandomWord] = useState(" ... ");
  const history = useHistory();

  // getting the random word
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/randomword",
    })
      .then((res) => {
        console.log("axios ", res.data);
        setRandomWord(res.data);
      })
      .catch((err) => console.error(err));

    axios({
      method: "get",
      url: "http://localhost:5000/guesserid",
    })
      .then((res) => {
        console.log("guesserID from backend: ", res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  //  End Game button
  useEffect(() => {
    socket.on("game-ended", (gameValue) => {
      if (gameValue == 1) {
        localStorage.clear();
        window.location.href = "/";
      }
    });

    socket.on("round-change-from-backend", (round) => {
      setchatmsgSent(1);
      setRoundFromBackend(round);
    });

    //  Set scores
    socket.on("scores", (game) => {
      console.log("game:", game);
      setScore(game[0].TeamScore);
    });

    socket.on("guessed-wrong", (wrong) => {
      alert(`Guesser guessed wrong, Now ${2 - wrong} chances left`);
    });

    socket.on("guessID", (guesserID) => {
      console.log("guesser ID from backend", guesserID);
      if (guesserID == socket.id) {
        if (socket.id === guesserID) {
          history.push({
            pathname: `/red/guess`,
            state: {
              gusserid: guesserID,
            },
          });
        }
      }
    });
  }, [socket]);

  socket.emit("guessingTeam", roundfromBackend);

  const sendHint = () => {
    socket.emit("msgListMake", { hint, room: "Team Red" });
    document.querySelector(".red__input").value = "";
  };

  //  send the new player for guessing when the round is changed
  // socket.on("guesser", (id) => {
  //   if (id === socket.id) {
  //     history.push("/red/guess");
  //   }
  // });

  // Change routes for new gusser
  socket.on("change-guesser", (value) => {
    if (value) {
      axios({
        method: "get",
        url: "http://localhost:5000/guesserid",
      })
        .then((res) => {
          if (socket.id === res.data.gusserSocketID) {
            history.push("/red/guess");
          }
        })
        .catch((err) => console.error(err));
    }
  });
  return (
    <div className="red__bg">
      <div className="red__enterhint text-center">
        <h3>
          Enter a Word simmilar to{" "}
          <span className="red__randomword" style={{ color: "red" }}>
            " {randomword} "
          </span>
        </h3>
        <br />
        <ImageInput
          text="Type your word here..."
          change={(e) => setHint(e.target.value)}
          classList="red__input"
        />
        <br />
        <ImageButton
          value="ENTER"
          classlist="red__enterbtn"
          clickMe={sendHint}
        />
      </div>
      <div className="red__timer d-flex align-items-baseline">
        <img src={Clock} alt="time" />
        <h3>
          <span id="Timer"></span>
        </h3>
      </div>
      <div className="red__teamranks d-flex justify-content-between px-3">
        <h3 className="my-auto" style={{ color: "#ffffff" }}>
          Score: {score}
        </h3>
        <h3 className="my-auto" style={{ color: "#603913" }}>
          Round: <span>{roundfromBackend}</span>
        </h3>
      </div>
    </div>
  );
};

export default TeamRed;
