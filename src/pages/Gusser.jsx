import React, { useState, useEffect } from "react";
import ImageButton from "../components/ImageButton";
import ImageInput from "../components/ImageInput";
import BackButton from "../images/back_button.svg";
import Clock from "../images/clock.svg";
import "../css/gusser.css";

const Gusser = () => {
  const [guess, setGuess] = useState("");

  useEffect(() => {
    console.log(guess);
  }, [guess]);
  const guessSubmitted = () => {
    alert("Guess Submited...");
  };

  return (
    <div className="gusser">
      <div className="bg"></div>
      <div className="gusser__back">
        <img src={BackButton} alt="back" />
      </div>
      <div className="gusser__teamranks d-flex justify-content-between px-3">
        <h3 className="my-auto" style={{ color: "#ffffff" }}>
          Team Points
        </h3>
        <h3 className="my-auto" style={{ color: "#603913" }}>
          10
        </h3>
      </div>
      <div className="gusser__hints">
        <div className="d-flex justify-content-around row1">
          <div>Hint 1</div>
          <div>Hint 2</div>
          <div>Hint 3</div>
        </div>
        <div className="d-flex justify-content-around row2">
          <div>Hint 4</div>
          <div>Hint 5</div>
          <div>Hint 6</div>
        </div>
      </div>
      <div className="gusser__timer d-flex align-items-baseline">
        <img src={Clock} alt="time"/>
        <h3>0:30</h3>
      </div>
      <div className="gusser__enterdiv">
        <h3 className="fw-bold">Guess the Word</h3>
        <br />
        <ImageInput
          text="Enter your Guess"
          change={(e) => setGuess(e.target.value)}
        />
        <ImageButton
          value="ENTER"
          clickMe={guessSubmitted}
          classlist="mt-3 gusser__enterbtn"
        />
      </div>
    </div>
  );
};

export default Gusser;
