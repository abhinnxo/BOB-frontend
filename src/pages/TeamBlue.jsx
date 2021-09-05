// Team blue. Players will enter their hinst here
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import ImageButton from "../components/ImageButton";
import ImageInput from "../components/ImageInput";
import Clock from "../images/clock.svg";
import "../css/teamblue.css";
const axios = require("axios");

function TeamBlue({ socket }) {
  const [hint, setHint] = useState("");
  const [roundfromBackend, setRoundFromBackend] = useState(1);
  const [chatmsgSent, setchatmsgSent] = useState(0);
  const [redTeamScore, setRedTeamScore] = useState(0);
  const [blueTeamScore, setBlueTeamScore] = useState(0);
  const [randomword, setRandomWord] = useState(" ... ");
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  let seconds = 90;

  // timer function
  useEffect(() => {
    setInterval(() => {
      if (seconds >= 0) {
        setMin(parseInt(seconds / 60, 10));
        setSec(parseInt(seconds % 60, 10));

        console.log(min + ":" + sec);
      } else console.log("Time is up!!!");
      seconds--;
    }, 1000);
  }, []);

  const history = useHistory();

  // getting the random word
  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5000/randomword`,
    })
      .then((res) => {
        console.log("axios ", res.data);
        setRandomWord(res.data);
      })
      .catch((err) => console.error(err));
  });
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/score",
    })
      .then((res) => {
        console.log("guesserID from backend: ", res.data.game);
        setRedTeamScore(res.data.game[0]);
        setBlueTeamScore(res.data.game[1]);
      })
      .catch((err) => console.error(err));
  }, []);

  // score
  // socket.on("scores", (game) => {
  //   setScore(game[0].TeamScore);
  // });

  //  end game button
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

    // socket.on("scores", (game) => {
    //   console.log("game:", game);
    //   //document.getElementById('scoreTeamRed').innerHTML = game[0].TeamScore;
    //   setScore(game[1].TeamScore);
    // });

    // socket.on('timer-counter', ({ minutes, seconds }) => {
    //   document.getElementById('Timer').innerHTML = minutes + ':' + seconds;
    // });

    socket.on("guessed-wrong", (wrong) => {
      alert(`Guesser guessed wrong,Now ${2 - wrong} chances left`);
    });

    socket.on("guessID", (guesserID) => {
      console.log("guesser ID from backend", guesserID);
      if (guesserID == socket.id) {
        if (socket.id === guesserID) {
          history.push({
            pathname: `/blue/guess`,
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
    socket.emit("msgListMake", { hint, room: "Team Blue" });
    document.querySelector(".blue__input").value = "";
  };

  // Change routes for new gusser
  socket.on("change-guesser", (value) => {
    if (value) {
      axios({
        method: "get",
        url: `http://localhost:5000/guesserid`,
      })
        .then((res) => {
          console.log("guesserID from backend: ", res.data);
          if (socket.id === res.data.gusserSocketID) {
            history.push("/blue/guess");
          }
        })
        .catch((err) => console.error(err));
    }
  });

  return (
    <div className="blue__bg">
      <div className="blue__enterhint text-center">
        <h3>
          Enter a Word simmilar to{" "}
          <span className="blue__randomword" style={{ color: "red" }}>
            " {randomword} "
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
          <span id="Timer">
            {min}:{sec}
          </span>
        </h3>
      </div>
      <div className="blue__teamranks d-flex justify-content-between px-3">
        <h3 className="my-auto" style={{ color: "#ffffff" }}>
          Score: {blueTeamScore}
        </h3>
        <h3 className="my-auto" style={{ color: "#603913" }}>
          Round: <span>{roundfromBackend}</span>
        </h3>
      </div>
    </div>
  );
}

export default TeamBlue;
