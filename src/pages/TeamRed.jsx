// Team Red Players will enter their hinst here
import React, { useState, useEffect } from "react";
import ImageButton from "../components/ImageButton";
import ImageInput from "../components/ImageInput";
import Clock from "../images/clock.svg";
import "../css/teamred.css";

const TeamRed = () => {
  const [hint, setHint] = useState("");

  useEffect(() => {
    console.log(hint);
  }, [hint]);

  const sendHint = () => {
    alert("Hint Sent...");
  };
  return (
    <div className="red__bg">
      <div className="red__enterhint text-center">
        <h3>
          Enter a Word simmilar to{" "}
          <span style={{ color: "red" }}>"Random"</span>
        </h3>
        <br />
        <ImageInput
          text="Type your word here..."
          change={(e) => setHint(e.target.value)}
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
        <h3>0:30</h3>
      </div>
   <div className="red__teamranks d-flex justify-content-between px-3">
        <h3 className="my-auto" style={{ color: "#ffffff" }}>
          Team Points
        </h3>
        <h3 className="my-auto" style={{ color: "#603913" }}>
          0
        </h3>
      </div>
    </div>
  );
};

export default TeamRed;
