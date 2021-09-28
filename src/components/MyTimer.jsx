import React, { useState, useEffect } from 'react';
import ClockImg from '../images/clock.svg';
import { useTimer } from 'react-timer-hook';
const axios = require('axios');

const style = {
  background: '#C27129',
  color: 'white',
  fonFamily: 'caesar',
  fontSize: '20px',
  fontWeight: 'bold',
  width: '161px',
  height: '40px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '20px',
};

const clockStyle = {
  cursor: 'pointer',
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
  transform: 'translate(17px, -73px)',
  cursor: 'pointer',
};

const MyTimer = ({ expiryTimestamp, socket, showNextRound }) => {
  const [paused, setPaused] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);

  useEffect(() => {
    console.log('timer rno. ', roundNumber);
  }, [roundNumber]);

  useEffect(() => {
    // getting the round number
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/roundNo`,
    })
      .then((res) => {
        console.log('axios ', res.data);
        setRoundNumber(res.data.round);
      })
      .catch((err) => console.error(err));
  }, []);

  let { seconds, minutes, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn('onExpire called'),
  });

  if (seconds < 10) seconds = seconds < 10 ? '0' + seconds : seconds;

  const togglePauseResume = () => {
    if (!paused) {
      // pause
      pause();
      setPaused(true);
    } else {
      // resume
      resume();
      setPaused(false);
    }
  };

  const nextRound = () => {
    alert('Skipped to the Next Round...');

    const time = new Date();
    time.setSeconds(time.getSeconds() + 90);
    restart(time);

    socket.emit('change-score', 0);
    socket.emit('change-round', roundNumber + 1);
    setRoundNumber(roundNumber + 1);
    var count = 0;
    socket.emit('timer-start', count);
  };

  useEffect(() => {
    socket.emit('sync-timer-to-backend', { minutes, seconds });
  }, [minutes, seconds]);

  return (
    <div>
      <div>
        <img
          src={ClockImg}
          onClick={togglePauseResume}
          style={clockStyle}
          width="90px"
          alt="clock_image"
        />
        <p style={timeStyle} onClick={togglePauseResume}>
          {minutes}:{seconds}
        </p>
      </div>
      {showNextRound ? (
        <div>
          <input
            type="button"
            name="button"
            value="Skip Round >"
            style={style}
            onClick={nextRound}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default MyTimer;
