import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Card, Nav } from "react-bootstrap";
import ImageButton from "../components/ImageButton";
import ImageInput from "../components/ImageInput";
import "../css/newgame.css";
var customId = require("custom-id");

const NewGame = ({ socket }) => {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roomid, setRoomid] = useState("");
  const [hostId, setHosutId] = useState("")

  const history = useHistory();

  useEffect(() => {
    console.log("username", username);
  }, [username]);
  useEffect(() => {
    console.log("password", password);
  }, [password]);

  // change cards for host/player, for joining or creating a new room
  const join = () => {
    document.querySelector("#join").classList.add("d-block");
    document.querySelector("#join").classList.remove("d-none");
    document.querySelector("#host").classList.add("d-none");
    document.querySelector("#host").classList.remove("d-blobk");
  };
  const host = () => {
    document.querySelector("#join").classList.add("d-none");
    document.querySelector("#join").classList.remove("d-block");
    document.querySelector("#host").classList.add("d-block");
    document.querySelector("#host").classList.remove("d-none");
  };

  // set NickName in the localstorage
  useEffect(() => {
    localStorage.setItem("nickname", nickname);
  }, [nickname]);

  // On Click the Join Room Button
  const joinroom = () => {
    if (roomid === "") {
      alert("Enter roomid");
    } else if (nickname === "") {
      alert("Enter Username");
    } else {
      localStorage.setItem("host", false);
      localStorage.setItem("roomid", roomid);
      history.push({
        pathname: "/lobby",
        state: {
          xyz: 0,
        },
      });
    }
  };
  // On Click the Host Room Button
  const hostroom = () => {
    console.log("uname " + username + " pass " + password);

    if (username === "admin" && password === "admin") {
      localStorage.setItem("host", true);
      localStorage.setItem("roomid", customId({}));
      // history.push("/lobby");
      history.push({
        pathname: "/lobby",
        state: {
          xyz: 1,
          hostId: socket.id,
        },
      });
    } else {
      alert("Username / Password is wrong");
    }
  };

  return (
    <div className="newgame__div">
      <div className="newgame__bg"></div>
      <Card className="newgame__card">
        <Card.Header className="newgame__header">
          <Nav
            variant="tabs"
            defaultActiveKey="#first"
            className="newgame__header"
          >
            <Nav.Item className="newgame__header">
              <Nav.Link className="newgame__navlink" onClick={join}>
                Join
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="newgame__navlink" onClick={host}>
                Host
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        {/* JOIN */}
        <Card.Body className="newgame__body" id="join">
          <br />
          <ImageInput
            change={(e) => setNickname(e.target.value)}
            text="Enter Nickname"
          />
          <br />
          <ImageInput
            change={(e) => setRoomid(e.target.value)}
            text="Enter Room Code"
          />
          <br />
          <ImageButton
            clickMe={joinroom}
            classlist="newgame__joinbtn"
            value="JOIN"
          />
          <ImageButton classlist="newgame__instbtn" value="INSTRUCTIONS" />
        </Card.Body>
        {/* HOST */}
        <Card.Body className="d-none newgame__body" id="host">
          <br />
          <ImageInput
            change={(e) => setUsername(e.target.value)}
            text="Enter Username"
          />
          <br />
          <ImageInput
            change={(e) => setPassword(e.target.value)}
            text="Enter Password"
          />
          <br />
          <ImageButton
            clickMe={hostroom}
            classlist="newgame__hostbtn"
            value="LOGIN"
          />
          <ImageButton classlist="newgame__instbtn" value="INSTRUCTIONS" />
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewGame;
