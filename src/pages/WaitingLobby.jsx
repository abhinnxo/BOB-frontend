import React, { useEffect, useState } from "react";
import BlueBlock from "../images/blueteam.svg";
import "../css/waitinglobby.css";
import BackButton from "../images/back_button.svg";
import RedTeam from "../components/RedTeam";
import BlueTeam from "../components/BlueTeam";
import ImageButton from "../components/ImageButton";
import { useHistory, useLocation } from "react-router-dom";

const WaitingLobby = ({ socket }) => {
  const [username, setUsername] = useState("");
  const [host, setHost] = useState(false);
  const [team, setTeam] = useState("");
  // comming from server
  const [blueplayerlist, setBluePlayerList] = useState([]);
  const [redplayerlist, setRedPlayerList] = useState([]);
  const [redplayer, setRedPlayer] = useState("");
  const [blueplayer, setBluePlayer] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("nickname"));
  }, []);

  //  Team red Players
  socket.on("teamredpayernames", function (message) {
    setRedPlayerList(message);
  });
  //  Team blue Players
  socket.on("teambluepayernames", function (message) {
    setBluePlayerList(message);
  });

  useEffect(() => {
    console.log("blueplayer", blueplayer);
  }, [blueplayer]);

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

  function teamselection(e) {
    if (e === "red") {
      setTeam("red");
      localStorage.setItem("team", "red");
      setRedPlayer(localStorage.getItem("nickname"));
      document.querySelector(".lobby__redteam").style.display = "none";
      document.querySelector(".lobby__blueteam").style.display = "none";
      socket.emit("joinRoom", { username, room: "Team Red" });
    }
    if (e === "blue") {
      setTeam("blue");
      localStorage.setItem("team", "blue");
      setBluePlayer(localStorage.getItem("nickname"));
      document.querySelector(".lobby__redteam").style.display = "none";
      document.querySelector(".lobby__blueteam").style.display = "none";
      socket.emit("joinRoom", { username, room: "Team Blue" });
    }
  }

  return (
    <div className="lobby">
      <div className="lobby__bg"></div>
      <div className="lobby__back">
        <img src={BackButton} alt="back" onClick={goBack} />
      </div>
      <div className="lobby__teamtable">
        <div className="lobby__codediv" onClick={copyGameCode}>
          <div className="lobby__code"></div>
        </div>
        <div className="d-flex">
          {/* Red Box */}
          <RedTeam playerList={redplayerlist} />
          <input
            type="button"
            name="button"
            className="lobby__blueteam"
            onClick={() => {
              teamselection("blue");
            }}
          />
          {/* Blue Box */}
          <BlueTeam playerList={blueplayerlist} />
          <input
            type="button"
            name="button"
            className="lobby__redteam"
            onClick={() => {
              teamselection("red");
            }}
          />
        </div>
        {/* Start Button */}
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
