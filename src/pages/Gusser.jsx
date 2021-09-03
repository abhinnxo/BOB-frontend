import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import ImageButton from "../components/ImageButton";
import ImageInput from "../components/ImageInput";
import Clock from "../images/clock.svg";
import "../css/gusser.css";

const Gusser = ({ socket }) => {
  const [guess, setGuess] = useState("");
  const [hintList, setHintList] = useState(["Waiting for Clues..."]);
  const [score, setScore] = useState(0);
  const location = useLocation();
  const [roundfromBackend, setRoundFromBackend] = useState(1);
  const history = useHistory();

  useEffect(() => {
    socket.emit("gusserid", location.state.gusserid);

    socket.on("round-change-from-backend", (round) => {
      setRoundFromBackend(round);
    });

    socket.on("scores", (game) => {
      console.log("game:", game);
      //document.getElementById('scoreTeamRed').innerHTML = game[0].TeamScore;
      if (roundfromBackend % 2 == 0) {
        setScore(game[0].TeamScore);
      } else {
        setScore(game[1].TeamScore);
      }
    });
  }, []);

  useEffect(() => {
    console.log(guess);
  }, [guess]);

  //  On clickong Enter button
  const guessSubmitted = () => {
    socket.emit("guessSubmission", guess);
    console.log(guess);
    alert("Guess Submited...");
  };

  useEffect(() => {
    socket.on("game-ended", (gameValue) => {
      if (gameValue == 1) {
        localStorage.clear();
        window.location.href = "/";
      }
    });
  }, [socket]);

  // final array from host
  socket.on("gusserHints", (arr) => {
    console.log("HINT LIST ", arr);
    setHintList(arr);
  });

  // remove this player from guessing on round change
  // socket.on("change-guesser", (round) => {
  //   socket.on("guesser", (id) => {
  //     if (socket.id !== id) {
  //       if (round % 2 === 0) history.push("/blue");
  //       else history.push("/red");
  //     }
  //   });
  // });

  return (
    <div className="gusser">
      <div className="gusser__bg"></div>
      <div className="gusser__teamranks d-flex justify-content-between px-3">
        <h3 className="my-auto" style={{ color: "#ffffff" }}>
          Team Points
        </h3>
        <h3 className="my-auto" style={{ color: "#603913" }}>
          {score}
        </h3>
      </div>
      <div className="gusser__hints">
        {hintList.map((hint, index) => {
          return <div key={index}>{hint}</div>;
        })}
      </div>
      <div className="gusser__timer d-flex align-items-baseline">
        <img src={Clock} alt="time" />
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
