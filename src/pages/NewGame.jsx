import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Card, Alert, Nav, Button, Modal } from "react-bootstrap";
import ImageButton from "../components/ImageButton";
import ImageInput from "../components/ImageInput";
import "../css/newgame.css";
var customId = require("custom-id");

const NewGame = () => {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roomid, setRoomid] = useState("");
  const [show, setShow] = useState(false);

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
  // set Roomk ID in the localstorage
  useEffect(() => {
    localStorage.setItem("roomid", customId({}));
  }, []);

  // On Click the Join Room Button
  const joinroom = () => {
    if (roomid === "") {
      document.querySelector("#no-roomid").classList.remove("d-none");
      setTimeout(() => {
        document.querySelector("#no-roomid").classList.add("d-none");
      }, 3000);
    } else {
      setShow(true);
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
  // Close Buton in the Modal
  const handleClose = () => setShow(false);

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
        <Card.Body className="newgame__body" id="join">
          <br />
          <ImageInput
            change={(e) => setRoomid(e.target.value)}
            text="Enter Room Code"
          />
          <br />
          <ImageButton
            clickMe={joinroom}
            classlist="newgame__joinbtn  mt-3"
            value="JOIN"
          />
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Select Your Team</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex flex-column">
              <Button variant="danger" className="my-1" onClick={joinTeamRed}>
                Join Team Red
              </Button>
              <Button variant="primary" className="my-1" onClick={joinTeamBlue}>
                Join Team Blue
              </Button>
            </Modal.Body>
          </Modal>
        </Card.Body>
        <Card.Body className="d-none newgame__body" id="host">
          <form>
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
          </form>
        </Card.Body>
        <Alert variant="danger" className="d-none" id="no-nickname">
          Nickname can't be Empty!
        </Alert>
        <Alert variant="danger" className="d-none" id="no-roomid">
          Enter Room ID!
        </Alert>
        <Alert variant="danger" className="d-none" id="wrong-alert">
          Wrong Username or Password entered!
        </Alert>
      </Card>
      <ImageButton classlist="newgame__instbtn" value="INSTRUCTIONS" />
    </div>
  );
};

export default NewGame;
