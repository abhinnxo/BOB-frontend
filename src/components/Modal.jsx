import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function OverScreen({ content, heading, buttonTitle }) {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Button
        style={{ display: 'none' }}
        variant="primary"
        onClick={handleShow}
      >
        {buttonTitle}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{content}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OverScreen;
