import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import "../css/admindestroy.css";
import settingsImg from "../images/settings.svg";
import endGameImg from "../images/end_game.svg";
import pauseTimerImg from "../images/pause_timer.svg";
import nextRoundImg from "../images/next_round.svg";
import destroyButton from "../images/destroy_button.svg";
const axios = require("axios");

const AdminDestroy = ({ socket }) => {
  const [bluearr, setBluearr] = useState([]);
  const [redarr, setRedarr] = useState([]);
  const [gameStatus, setGameStatus] = useState(0);
  const [giveGuest, setGiveGuest] = useState(false);
  const [randomword, setRandomWord] = useState("MainWord");
  const [round, setRound] = useState(1);
  const [roundNumber, setRoundNumber] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  // set array for the team
  const [guessingArr, setGuessingArr] = useState([]);
  // set guessing team
  const [guessingTeam, setGuessingTeam] = useState("blue");
  const history = useHistory();

  var score = 0;
  socket.emit("change-score", score);

  // useEffect(() => {
  //   if (round % 2 === 0) {
  //     // setGuessingArr(redarr);
  //     setGuessingTeam("red");
  //   } else {
  //     // setGuessingArr(bluearr);
  //     setGuessingTeam("blue");
  //   }
  // }, [round]);

  //remove enemy team checkboxes
  const destroyWords = () => {
    let allWords = document.querySelectorAll(".guessingTeam > input");
    allWords.forEach((word) => {
      if (!word.checked) {
        // guessingArr.filter((item) => (word.value === item ? null : item));
        setGuessingArr([...guessingArr, word.value]);
        // console.log("unchecked ", word.value);
      }
    });
    document.querySelector(".destroyButton").style.display = "none";

    alert(
      "Your Selected Words are removed, Click Proceed to send the clues to the Guesser..."
    );
  };

  useEffect(() => {
    // getting the random word
    axios({
      method: "get",
      url: "http://localhost:5000/randomword",
    })
      .then((res) => {
        console.log("axios ", res.data);
        setRandomWord(res.data);
      })
      .catch((err) => console.error(err));

    // getting the round number
    axios({
      method: "get",
      url: "http://localhost:5000/roundNo",
    })
      .then((res) => {
        console.log("axios ", res.data);
        setRoundNumber(res.data.round);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    //  On clicking proceed button
    socket.on("Team-BlueWordList", (bluearr) => {
      console.log(bluearr);
      setBluearr(bluearr);
    });

    socket.on("Team-RedWordList", (redarr) => {
      setRedarr(redarr);
    });
    socket.on("game-ended", (gameValue) => {
      if (gameValue === 1) {
        window.location.href = "/";
      }
    });
    socket.on("timer-counter", ({ minutes, seconds }) => {
      console.log(minutes, seconds);
      setMinutes(minutes);
      setSeconds(seconds);
    });
    socket.on("guessID", (guesserID) => {
      console.log("guesser ID from backend", guesserID);
    });
  }, [socket]);

  socket.on("final-Array", (arr) => {
    console.log("final-array", arr);
    // setFinalArr(arr);
  });

  useEffect(() => {
    socket.emit("showToGuesser", guessingArr);
    if (giveGuest) history.push("/admin/points");
  }, [giveGuest]);

  // const [word, setWord] = useState('');

  // setWord(localStorage.getItem('word'));

  function endGame() {
    socket.emit("game-end-clicked", gameStatus);
    localStorage.clear();
  }

  return (
    <section className="hostWaitingLobby">
      <div className="admindestroy__bg"></div>
      <div className="end_settings">
        <img src={settingsImg} alt="" className="settings" />
        <img src={endGameImg} className="endGame" onClick={endGame} alt="" />
      </div>
      <div className="timer_round">
        <p>
          {minutes}:{seconds}
        </p>
        <p>Round {roundNumber}</p>
      </div>
      <div className="pauseTimer_nextRound">
        <img src={pauseTimerImg} alt="" />
        <img src={nextRoundImg} alt="" />
      </div>
      <div className="players">
        <h2 className="mainWord">{randomword}</h2>
        <div className="join">
          <span className="teamNameBlue">Team Blue</span>
          <div className="seperateBoard">
            <h4>Select the simmilar words and destroy them</h4>
            <div className="team">
              {/* Blue Team Words */}
              <div className="eachTeam">
                {bluearr.map((word) => {
                  return (
                    <div
                      className={`word ${
                        guessingTeam === "blue" ? "guessingTeam" : ""
                      }`}
                    >
                      <label for={word}>{word}</label>
                      <input
                        type="checkbox"
                        name={word}
                        id={word}
                        value={word}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Red Team words*/}
              <div className="eachTeam">
                {redarr.map((word) => {
                  return (
                    <div
                      className={`word ${
                        guessingTeam === "red" ? "guessingTeam" : ""
                      }`}
                    >
                      <label for={word}>{word}</label>
                      <input
                        type="checkbox"
                        name={word}
                        id={word}
                        value={word}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="destroyButton" onClick={() => destroyWords()}>
              <img src={destroyButton} alt="" />
            </div>
          </div>
          <span className="teamNameRed">Team Red</span>
        </div>
      </div>
      <button className="admin__destroy" onClick={() => setGiveGuest(true)}>
        proceed
      </button>
    </section>
  );
};

export default AdminDestroy;
