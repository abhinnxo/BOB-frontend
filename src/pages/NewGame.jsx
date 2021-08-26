import {update_nickname,update_host,update_roomid} from "../store/mainstore"
import { useSelector, useDispatch } from 'react-redux'
import { socket,createconnection } from "../services/socket";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Card, Nav } from "react-bootstrap";
import ImageButton from "../components/ImageButton";
import ImageInput from "../components/ImageInput";
import "../css/newgame.css";
var customId = require("custom-id");

const NewGame = () => {

   //creating socket connection
   useEffect(() => {
    createconnection()
   }, [])

 //redux managements
 const mstore = useSelector((state) => state.mainstore)
 const dispatch = useDispatch()
 //console.log(mstore)

  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roomid, setRoomid] = useState("");

  const history = useHistory();

  const login = (e) => {
    e.preventDefault();

    // Login
    if (username === "admin" && password === "admin") {
      history.push({
        pathname: "/newgame",
      });
    } else {
      document.querySelector("#wrong-alert").classList.remove("d-none");
    }
  };

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
  // set Room ID in the localstorage
  useEffect(() => {
    localStorage.setItem("roomid", customId({}));
  }, [roomid]);

  // On Click the Join Room Button
  const joinroom = () => {
    if (roomid === "") {
      alert("Enter roomid")

    } else if(nickname === "") {
      alert("Enter Username")

    } 
    else {
      socket.emit('joinRoom', { nickname, roomid });
      dispatch(update_nickname(nickname))
      dispatch(update_roomid(roomid))
      dispatch(update_host(true))
      history.push({
        pathname: "/lobby",
        state: {
          nickname,
          roomid,
          host: true,
        },
      });
    }
  };
  // On Click the Host Room Button
  const hostroom = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin") {
      history.push({
        pathname: "/admin",
        state: {
          nickname,
          roomid,
          host: true,
        },
      });
    } else {
      document.querySelector("#wrong-alert").classList.remove("d-none");
    }
  };
  
  // Modal: Join Team red
  const joinTeamRed = () => {
    history.push({
      pathname: "/play",
      state: {
        nickname,
        roomid,
        team: "red",
        host: false,
      },
    });
  };
  // Modal: Join Team blue
  const joinTeamBlue = () => {
    history.push({
      pathname: "/play",
      state: {
        nickname,
        roomid,
        team: "blue",
        host: false,
      },
    });
  };
  return (
    <div className="newgame__div">
      <Card style={{ width: "40rem" }} className="newgame__card">
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
          <ImageButton
            clickMe={joinroom}
            classlist="newgame__joinbtn  mt-3"
            value="JOIN"
          />
        </Card.Body>
        {/* HOST */}
        <Card.Body className="d-none newgame__body" id="host">
          <br />
          <ImageInput
            change={(e) => setUsername(e.target.value)}
            text="Enter Username"
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <ImageButton
            clickMe={hostroom}
            classlist="newgame__hostbtn  mt-3"
            value="LOGIN"
          />
        </Card.Body>
      </Card>
      <ImageButton classlist="newgame__instbtn" value="INSTRUCTIONS" />
    </div>
  );
};

export default NewGame;
