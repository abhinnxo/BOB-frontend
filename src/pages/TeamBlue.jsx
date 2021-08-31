// Team blue. Players will enter their hinst here
import React, { useState, useEffect } from "react";
import ImageButton from "../components/ImageButton";
import ImageInput from "../components/ImageInput";
import Clock from "../images/clock.svg";
import "../css/teamblue.css";
const axios = require("axios");

function TeamBlue({ socket }) {
  const [hint, setHint] = useState("");
  const [roundfromBackend, setRoundFromBackend] = useState(1);
  const [chatmsgSent, setchatmsgSent] = useState(0);
  const [score, setScore] = useState(0);
  const [randomword, setRandomWord] = useState(" ... ");

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
  }, []);

  useEffect(() => {
    socket.on("game-ended", (gameValue) => {
      if (gameValue == 1) {
        window.location.href = "/";
      }
    });

    socket.on("round-change-from-backend", (round) => {
      setchatmsgSent(1);
      setRoundFromBackend(round);
    });

    socket.on("scores", (game) => {
      console.log("game:", game);
      //document.getElementById('scoreTeamRed').innerHTML = game[0].TeamScore;
      setScore(game[1].TeamScore);
    });

    // socket.on('timer-counter', ({ minutes, seconds }) => {
    //   document.getElementById('Timer').innerHTML = minutes + ':' + seconds;
    // });

    socket.on("guessed-wrong", (wrong) => {
      alert(`Guesser guessed wrong,Now ${2 - wrong} chances left`);
    });
  }, [socket]);

  socket.emit("guessingTeam", roundfromBackend);

  socket.on("random-word", (word) => {
    console.log("randomWord", word);
    var x = document.querySelector(".blue__randomword");
    if (x != null) x.innerHTML = word;
  });

  const sendHint = () => {
    socket.emit("msgListMake", { hint, room: "Team Blue" });
    document.querySelector(".blue__input").value = "";
  };

  return (
    <div className="blue__bg">
      <div className="blue__enterhint text-center">
        <h3>
          Enter a Word simmilar to{" "}
          <span className="blue__randomword" style={{ color: "red" }}>
            {randomword}
          </span>
        </h3>
        <br />
        <ImageInput
          text="Type your word here..."
          change={(e) => setHint(e.target.value)}
          classList="blue__input"
        />
        <br />
        <ImageButton
          value="ENTER"
          classlist="blue__enterbtn"
          clickMe={sendHint}
        />
      </div>
      <div className="blue__timer d-flex align-items-baseline">
        <img src={Clock} alt="time" />
        <h3>
          <span id="Timer"></span>
        </h3>
      </div>
      <div className="blue__teamranks d-flex justify-content-between px-3">
        <h3 className="my-auto" style={{ color: "#ffffff" }}>
          Score: {score}
        </h3>
        <h3 className="my-auto" style={{ color: "#603913" }}>
          Round:<span>{roundfromBackend - 1}</span>
        </h3>
      </div>
    </div>
  );
}

export default TeamBlue;
