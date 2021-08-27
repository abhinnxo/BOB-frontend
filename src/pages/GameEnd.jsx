import React from "react";
import { useHistory } from "react-router";
import ImageButton from "../components/ImageButton";
import "../css/gameend.css";

const GameEnd = () => {
  const history = useHistory();

  const gotoMainScreen = () => {
    history.push("/");
  };

  return (
    <div className="gameend">
      <div className="gameend__bg"></div>
      <div className="end__text text-center">
        <div>
          Team <span>Red</span> Wins
        </div>
        <div>
          SCORE: <span>500</span>
        </div>
        <div>Thank You for playing...</div>
        <br />
        <br />
        <ImageButton
          value="Go to Main Screen"
          clickMe={gotoMainScreen}
          classlist="end__btn"
        />
      </div>
    </div>
  );
};

export default GameEnd;
