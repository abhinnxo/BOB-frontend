import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import Setting from '../images/settings.svg';
import PauseTimer from '../images/pause_timer.svg';
import EndGame from '../images/end_game.svg';
import '../css/adminpoints.css';
const axios = require('axios');

const AdminPoints = ({ socket }) => {
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState(0);
  const [guess, setGusser] = useState('" ... "');
  const [wrong, setWrong] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [randomWord, setRandomWord] = useState('Main Word');
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  let seconds = 90;

  // timer function
  useEffect(() => {
    setInterval(() => {
      if (seconds >= 0) {
        setMin(parseInt(seconds / 60, 10));
        setSec(parseInt(seconds % 60, 10));
      }
      seconds--;
    }, 1000);
  }, []);

  var count = 0;
  var stopTimer = 0;
  // var finalArray = [];

  const history = useHistory();

  // getting the random word
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com//randomword`,
    })
      .then((res) => {
        console.log('axios ', res.data);
        setRandomWord(res.data);
      })
      .catch((err) => console.error(err));

    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com//roundNo`,
    })
      .then((res) => {
        console.log('axios ', res.data);
        setRoundNumber(res.data.round);
      })
      .catch((err) => console.error(err));

    socket.on('guessed-wrong', (wrong) => {
      if (wrong > 1) {
        setScore(0);
        socket.emit('change-score', 0);
        socket.emit('change-round', roundNumber + 1);
        setRoundNumber(roundNumber + 1);
        socket.emit('timer-start', count);
        setWrong(1);
        history.push('/admin/destroy');
      }
    });
  }, []);

  // when game is ended route everyone to main screen
  socket.on('game-ended', (gameValue) => {
    localStorage.clear();
    if (gameValue === 1) {
      window.location.href = '/';
    }
  });

  socket.on('random-word', (value) => {
    console.log('Hey ReachedPOINT', value);
    setRandomWord(value);
  });

  socket.on('guessToHost', (guessSubmitted) => {
    console.log('guessSubmitted', guessSubmitted);
    setGusser(guessSubmitted);
  });

  function stopTime() {
    socket.emit('stopTimer', stopTimer);
  }

  count = 0;
  socket.emit('timer-start', count);

  function score5() {
    setScore(5);
    console.log('5 score button clicked....', score);
    socket.emit('change-score', 5);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    count = 0;
    socket.emit('timer-start', count);
    history.push('/admin/destroy');
  }

  function score4() {
    setScore(4);
    console.log('4 score button clicked');
    socket.emit('change-score', 4);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    socket.emit('timer-start', count);
    history.push('/admin/destroy');
  }

  function score3() {
    setScore(3);
    console.log('3 score button clicked');
    socket.emit('change-score', 3);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    socket.emit('timer-start', count);
    history.push('/admin/destroy');
  }

  // function score0() {
  //   setScore(0);
  //   console.log('0 score button clicked');
  //   socket.emit('change-score', 0);
  //   setRoundNumber(roundNumber + 1);
  //   socket.emit('change-round', roundNumber);
  //   socket.emit('timer-start', count);
  //   history.push('/admin/destroy');
  // }

  function endGame() {
    socket.emit('game-end-clicked', gameStatus);
    localStorage.clear();
  }

  function wrongFxn() {
    setWrong(wrong + 1);
    socket.emit('wrong-guess', wrong);
  }

  return (
    <div className="point">
      <div className="point__bg"></div>
      <div className="point__controls d-flex justify-content-between">
        <div>
          <div className="point__setting">
            <img src={Setting} alt="settings" />
          </div>
          <p className="point__timer">
            <span>
              {min}:{sec}
            </span>
          </p>
          <div className="pauseTimer">
            {' '}
            <img src={PauseTimer} alt="pause timer" onClick={stopTime} />
          </div>
        </div>
        <div>
          <div>
            <img
              src={EndGame}
              alt="end game"
              onClick={endGame}
              style={{ cursor: 'pointer' }}
              className="point__endgame"
            />
          </div>
          <div className="point__round">
            <div>Round {roundNumber}</div>
          </div>
        </div>
      </div>
      <div className="point__board text-center">
        <h4 className="point__mainword">{randomWord}</h4>
        <h3>
          Guess - <span>{wrong}</span>
        </h3>
        <h6>The Answer submitted is</h6>
        <h1 className="point__randomword" id="randomWord">
          {guess}
        </h1>
        <div className="d-flex justify-content-evenly text-center my-3">
          <button className="point__btn plus_five" onClick={score5}>
            + 5
          </button>
          <button className="point__btn plus_four" onClick={score4}>
            + 4
          </button>
          <button className="point__btn plus_three" onClick={score3}>
            + 3
          </button>
          {/* <button className="point__btn plus_zero" onClick={score0}>
            + 0
          </button> */}
          <button className="point__btn wrong" onClick={wrongFxn}>
            Wrong
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPoints;
