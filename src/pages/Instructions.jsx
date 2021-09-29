import React from 'react';
import inst1 from '../images/Overlay.png';
import O3 from '../images/Overlay3.png';
import O2 from '../images/Overlay2.png';
import bg from '../images/background.webp';
import ImageButton from '../components/ImageButton';
import { useHistory } from 'react-router';
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

function Instructions() {
  const history = useHistory();

  const joinLobby = () => {
    history.push({
      pathname: '/lobby',
      state: {
        xyz: 0,
      },
    });
  };

  return (
    <div>
      <div className="inst__bg" style={bgstyle}>
        <div style={caro} className="caro">
          <Carousel style={img}>
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
          <ImageButton
            clickMe={joinLobby}
            classlist="newgame__hostbtn"
            value="Proceed"
          />
        </div>
      </div>
      {/* <div className="inst__bg" style={bgstyle}>
        <div style={imgstyle}>
          <img src={inst1}  alt="Instruction" />
          <img src={O2} alt="Instruction" />
          <img src={O3} alt="Instruction" />
          <ImageButton
            clickMe={joinLobby}
            classlist="newgame__hostbtn"
            value="Proceed"
          />
        </div>
      </div> */}
    </div>
  );
}

export default Instructions;
