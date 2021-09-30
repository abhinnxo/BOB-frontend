import React from 'react';
import inst1 from '../images/i1.png';
import O3 from '../images/i3.png';
import O2 from '../images/i2.png';
import bg from '../images/background.webp';
import nextIcon from '../images/arrowright.png';
import prevIcon from '../images/arrowright.png';
import { useHistory, useLocation } from 'react-router';
import { Carousel } from 'react-bootstrap';
import '../css/inst.css';

const bgstyle = {
  position: 'absolute',
  zIndex: '-19',
  left: '0px',
  top: '0px',
  background: `url('${bg}')`,
  height: '100%',
  width: '100%',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};
const img = {
  textAlign: 'center',
  marginLeft: 'auto !important',
  marginRight: 'auto !important',
};
const img1 = {
  width: 'fit-content',
  textAlign: 'center',
};
const caro = {
  textAlign: 'center',
};

function Instructions({ socket }) {
  const history = useHistory();
  const location = useLocation();

  const joinLobby = () => {
    if (location.state.xyz) {
      history.push({
        pathname: '/lobby',
        state: {
          xyz: 1,
          hostId: socket.id,
        },
      });
    } else {
      history.push({
        pathname: '/lobby',
        state: {
          xyz: 0,
        },
      });
    }
  };

  return (
    <div>
      <div className="inst__bg" style={bgstyle}>
        <div style={caro} className="caro">
          <Carousel
            style={img}
            // nextIcon={nextIcon} prevIcon={prevIcon}
          >
            <Carousel.Item style={img1}>
              <img className="d-block instimg" src={inst1} alt="First slide" />
            </Carousel.Item>
            <Carousel.Item style={img1}>
              <img className="d-block instimg" src={O2} alt="Second slide" />
            </Carousel.Item>
            <Carousel.Item style={img1}>
              <img className="d-block instimg" src={O3} alt="Third slide" />
            </Carousel.Item>
          </Carousel>
        </div>
        <div className="inst__skip_div">
          <h6 className="inst__skip" onClick={joinLobby}>
            SKIP
          </h6>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
