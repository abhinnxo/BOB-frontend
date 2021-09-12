import React, { useState, useEffect } from 'react';
import ClockImg from '../images/clock.svg';
import { useTimer } from 'react-timer-hook';
const axios = require('axios');

const style = {
  background: '#C27129',
  color: 'white',
  fonFamily: 'caesar',
  fontSize: '15px',
  width: '161px',
  height: '40px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '20px',
};
const timeStyle = {
  zIndex: '3',
  color: 'white',
  fontFamily: 'PaytoneOne',
  fontSize: '24px',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '50px',
  letterSpacing: '0.05em',
  transform: 'translate(17px, -68px)',
};
const controlStyle = {
  transform: 'translateY(-50px)',
};

const MyTimer = ({ expiryTimestamp, socket }) => {
  const [paused, setPaused] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);

  useEffect(() => {
    console.log('timer rno. ', roundNumber);
  }, [roundNumber]);

  useEffect(() => {
    // getting the round number
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_LOCALHOST}/roundNo`,
    })
      .then((res) => {
        console.log('axios ', res.data);
        setRoundNumber(res.data.round);
      })
      .catch((err) => console.error(err));
  }, []);

  const { seconds, minutes, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn('onExpire called'),
  });

  const pausedfn = () => {
    pause();
    setPaused(true);
  };

  const resumedfn = () => {
    resume();
    setPaused(false);
  };

  const nextRound = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 90);
    restart(time);

    socket.emit('change-score', 0);
    socket.emit('change-round', roundNumber + 1);
    setRoundNumber(roundNumber + 1);
    var count = 0;
    socket.emit('timer-start', count);
    alert('Round Changed');
  };

  useEffect(() => {
    socket.emit('sync-timer-to-backend', { minutes, seconds });
  }, [minutes, seconds]);

  return (
    <div>
      <div>
        <img src={ClockImg} width="80px" alt="clock_image" />
        <p style={timeStyle}>
          {minutes}:{seconds}
        </p>
      </div>
      <div style={controlStyle}>
        {!paused ? (
          <input
            type="button"
            name="button"
            value="Pause"
            style={style}
            onClick={pausedfn}
          />
        ) : (
          <input
            type="button"
            name="button"
            value="Resume"
            style={style}
            onClick={resumedfn}
          />
        )}
      </div>
      <div>
        <input
          type="button"
          name="button"
          value="Next Round"
          style={style}
          onClick={nextRound}
        />
      </div>
    </div>
  );
};
export default MyTimer;
