// Team Red Players will enter their hinst here
import React, { useState, useEffect } from "react";
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
      setScore(game[0].TeamScore);
      //document.getElementById('scoreTeamBlue').innerHTML = game[1].TeamScore;
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
    document.querySelector(".red__randomword").innerHTML = `" ${word} "`;
  });

  const sendHint = () => {
    socket.emit("msgListMake", { hint, room: "Team Red" });
    document.querySelector(".red__input").value = "";
  };

  return (
    <div className="red__bg">
      <div className="red__enterhint text-center">
        <h3>
          Enter a Word simmilar to{" "}
          <span className="red__randomword" style={{ color: "red" }}>
            {randomword}
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
          Round:<span>{roundfromBackend - 1}</span>
        </h3>
      </div>
    </div>
  );
};

export default TeamRed;
