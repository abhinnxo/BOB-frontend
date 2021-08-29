// Team blue. Players will enter their hinst here
import React, { useState, useEffect } from "react";
import ImageButton from "../components/ImageButton";
import ImageInput from "../components/ImageInput";
import Clock from "../images/clock.svg";
import "../css/teamblue.css";

function TeamBlue({socket}) {
  const [hint, setHint] = useState("");

 
    socket.on("random-word", (word) => {
      console.log("randomWord", word);
      document.querySelector(".blue__randomword").innerHTML = `" ${word} "`;
    });

  const sendHint = () => {
    socket.emit("msgListMake", {hint, room: "Team Blue"})
    document.querySelector(".blue__input").value = "";    
  };

  return (
    <div className="blue__bg">
      <div className="blue__enterhint text-center">
        <h3>
          Enter a Word simmilar to{" "}
          <span style={{ color: "red" }}>" ... "</span>
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
        <h3>0:30</h3>
      </div>
      <div className="blue__teamranks d-flex justify-content-between px-3">
        <h3 className="my-auto" style={{ color: "#ffffff" }}>
          Team Points
        </h3>
        <h3 className="my-auto" style={{ color: "#603913" }}>
          0
        </h3>
      </div>
    </div>
  );
}

export default TeamBlue;
