import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ImageButton from '../components/ImageButton';
import '../components/css/Modal.css';

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
        className="my-modal"
      >
        <Modal.Body>
          <center>
            <div>{heading}</div>
            <br /> <br /> <br /> <br /> <br />
            <h5> {content}</h5>
            <div>
              <ImageButton
                value="Proceed"
                classlist="blue__enterbtn"
                clickMe={handleClose}
              />
            </div>
          </center>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default OverScreen;
