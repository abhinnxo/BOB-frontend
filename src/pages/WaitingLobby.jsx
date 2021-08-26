import React, { useEffect, useState } from "react";
import BlueBlock from "../images/blueteam.svg";
import "../css/waitinglobby.css";
import BackButton from "../images/back_button.svg";
import RedBlock from "../images/redteam.svg";
import ImageButton from "../components/ImageButton";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { socket } from "../services/socket";
import { update_team } from "../store/mainstore";

const WaitingLobby = () => {
  const [host, setHost] = useState(false);
  const [team, setTeam] = useState("");

  const history = useHistory();

  const startgame = () => {
    if (host === true) {
      history.push("/admin/points");
    }
    if (team === "red") {
      history.push("/red");
    }
    if (team === "blue") {
      history.push("/blue");
    }
  };

  const goBack = () => {
    history.push("/");
  };
  const copyGameCode = () => {
    navigator.clipboard.writeText(localStorage.getItem("roomid"));
  };

  useEffect(() => {
    // set room id to div
    document.querySelector(".lobby__code").innerHTML =
      localStorage.getItem("roomid");
    // get host status (true/false)
    setHost(localStorage.getItem("host"));
  }, []);
  // setting style of start button
  useEffect(() => {
    console.log(host);
    if (host === true) {
      console.log("got host state");
      document.querySelector(".lobby__startbtn").classList.remove("d-none");
    }
  });

  //store
  const mstore = useSelector((state) => state.mainstore);

  const dispatch = useDispatch();

  console.log(mstore);

  function teamselection(e) {
    socket.emit("guessingTeam", 0);
    dispatch(update_team(e));
    //console.log(location.state)
    if (e === "red") {
      setTeam("red")
    localStorage.setItem("team", "red");
    }
    if (e === "blue") {
      setTeam("blue")
      localStorage.setItem("team", "blue");
    }
  }

  return (
    <div className="lobby">
      <div className="bg"></div>
      <div className="lobby__back">
        <img src={BackButton} alt="back" onClick={goBack} />
      </div>
      <div className="lobby__teamtable">
        <div className="lobby__code" onClick={copyGameCode}></div>
        <input
          type="button"
          name="button"
          className="lobby__blueteam"
          onClick={() => {
            teamselection("blue");
          }}
        />
        <img src={BlueBlock} alt="" />

        <input
          type="button"
          name="button"
          className="lobby__redteam"
          onClick={() => {
            teamselection("red");
          }}
        />
        <img src={RedBlock} alt=""/>

        <ImageButton
          clickMe={startgame}
          classlist="lobby__startbtn mx-auto"
          value="START"
        />
      </div>
    </div>
  );
};

export default WaitingLobby;
