import React, {useEffect} from "react";
import ImageInput from "../components/ImageInput";
import Setting from "../images/settings.svg";
import Timer from "../images/timer.svg";
import PauseTimer from "../images/pause_timer.svg";
import EndGame from "../images/end_game.svg";
import Round from "../images/round.svg";
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

const AdminPoints = () => {
  const pointSend = () => {
    alert("Clue sent...");
  };

  return (
    <div className="point">
      <div className="point__bg"></div>
      <div className="point__controls d-flex justify-content-between">
        <div>
          <div className="point__setting">
            <img src={Setting} alt="settings" />
          </div>
          <div className="point__timer">
            <img src={Timer} alt="timer" />
            <h1>1:30</h1>
          </div>
          <div>
            {" "}
            <img src={PauseTimer} alt="pause timer" />
          </div>
        </div>
        <div>
          <div>
            <img src={EndGame} alt="end game" />
          </div>
          <div className="point__round">
            <img src={Round} alt="round number" />
            <h1>Round 1</h1>
          </div>
          <div>
            <img src={NextRound} alt="next round" />
          </div>
        </div>
      </div>
      <div className="point__board text-center">
        <h3>
          Guess - <span>2</span>
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
        <img src={Send} alt="send" className="point__send" onClick={pointSend} />
      </div>
    </div>
  );
};

export default AdminPoints;
