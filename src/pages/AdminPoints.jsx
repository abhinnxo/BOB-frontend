import React, { useState, useEffect } from "react";
import ImageInput from "../components/ImageInput";
import Setting from "../images/settings.svg";
import PauseTimer from "../images/pause_timer.svg";
import EndGame from "../images/end_game.svg";
import NextRound from "../images/next_round.svg";
import Send from "../images/send.svg";
import "../css/adminpoints.css";

const style = {
  color: "white",
  fontSize: "25px",
  width: "400px",
  height: "110px",
  cursor: "pointer",
  border: "none",
};

const AdminPoints = ({ socket }) => {
  // const [word, setWord] = useState("")

  const pointSend = () => {
    alert("Clue sent...");
  };

  socket.on("random-word", (word) => {
    console.log("ADMIN POINT", word);
    document.querySelector(".point__mainword").innerHTML = word;
  });
  socket.on("guessSubmitted", word => {
    document.querySelector(".point__randomword").innerHTML = word;
  })

  return (
    <div className="point">
      <div className="point__bg"></div>
      <div className="point__controls d-flex justify-content-between">
        <div>
          <div className="point__setting">
            <img src={Setting} alt="settings" />
          </div>
          <p className="point__timer">1:30</p>
          <div className="pauseTimer">
            {" "}
            <img src={PauseTimer} alt="pause timer" />
          </div>
        </div>
        <div>
          <div>
            <img src={EndGame} alt="end game" />
          </div>
          <p className="point__round">Round 1</p>
          <div className="nextRound">
            <img src={NextRound} alt="next round" />
          </div>
        </div>
      </div>
      <div className="point__board text-center">
        <h4 className="point__mainword">Main Word</h4>
        <h3>
          Guess - <span>1</span>
        </h3>
        <h6>The Answer submitted is</h6>
        <h1 className="point__randomword">"Random"</h1>
        <div className="d-flex justify-content-evenly text-center my-3">
          <button className="point_btn plus_five">+ 5</button>
          <button className="point_btn plus_four">+ 4</button>
          <button className="point_btn plus_three">+ 3</button>
          <button className="point_btn plus_zero">+ 0</button>
          <button className="point_btn wrong">Wrong</button>
        </div>

        <ImageInput text="Type a clue..." />
        <img
          src={Send}
          alt="send"
          className="point__send"
          onClick={pointSend}
        />
      </div>
    </div>
  );
};

export default AdminPoints;
