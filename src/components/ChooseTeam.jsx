import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ChooseTeam = () => {
  const [show, setShow] = useState(false);
  const [nickname, setNickname] = useState("");
  const [roomid, setRoomid] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (nickname === "") {
      document.querySelector("#no-nickname").classList.remove("d-none");
      setTimeout(() => {
        document.querySelector("#no-nickname").classList.add("d-none");
      }, 3000);
    } else if (roomid === "") {
      document.querySelector("#no-roomid").classList.remove("d-none");
      setTimeout(() => {
        document.querySelector("#no-roomid").classList.add("d-none");
      }, 3000);
    } else {
      setShow(true);

      localStorage.setItem("roomid", roomid);
      //    history.push({
      //      pathname: "/play",
      //      state: {
      //        nickname,
      //        roomid,
      //        host: false,
      //      },
      //    });
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="mt-2">
        Join
      </Button>
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
          <Button variant="danger" className="my-1">
            Join Team Red
          </Button>
          <Button variant="primary" className="my-1">
            Join Team Blue
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChooseTeam;
