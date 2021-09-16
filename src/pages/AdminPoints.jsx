import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import EndGame from '../images/end_game.svg';
import '../css/adminpoints.css';
import MyTimer from '../components/MyTimer';
const axios = require('axios');

const AdminPoints = ({ socket }) => {
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState(0);
  const [guess, setGusser] = useState('" ... "');
  const [wrong, setWrong] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [randomWord, setRandomWord] = useState('Main Word');
  // Show players score
  const [redTeamScore, setRedTeamScore] = useState(0);
  const [blueTeamScore, setBlueTeamScore] = useState(0);

  const time = new Date();
  time.setSeconds(time.getSeconds() + 90);

  const history = useHistory();

  // getting the random word
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/randomword`,
    })
      .then((res) => {
        console.log('axios ', res.data);
        setRandomWord(res.data);
      })
      .catch((err) => console.error(err));

    //  getting round number
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
  // getting the score
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/score`,
    })
      .then((res) => {
        console.log('score from backend: ', res.data);

        setRedTeamScore(res.data[0].TeamScore);
        setBlueTeamScore(res.data[1].TeamScore);
      })
      .catch((err) => console.error(err));
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

  function score5() {
    setScore(5);
    console.log('5 score button clicked....', score);
    socket.emit('change-score', 5);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    history.push('/admin/destroy');
  }

  function score4() {
    setScore(4);
    console.log('4 score button clicked');
    socket.emit('change-score', 4);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    history.push('/admin/destroy');
  }

  function score3() {
    setScore(3);
    console.log('3 score button clicked');
    socket.emit('change-score', 3);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    history.push('/admin/destroy');
  }

  function endGame() {
    socket.emit('game-end-clicked', gameStatus);
    localStorage.clear();
  }

  function wrongFxn() {
    setWrong(wrong + 1);
    socket.emit('wrong-guess', wrong);
    if (wrong == 2) {
      setScore(0);
      socket.emit('change-score', 0);
      setRoundNumber(roundNumber + 1);
      socket.emit('change-round', roundNumber);
      setWrong(1);
      history.push('/admin/destroy');
    }
  }

  return (
    <div className="point">
      <div className="point__bg"></div>
      <div className="point__controls d-flex justify-content-between">
        <div>
          <MyTimer
            expiryTimestamp={time}
            showNextRound={false}
            socket={socket}
          />
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
      <div className="d-flex justify-content-between point__teamscores">
        <div className="point_redteamscore">Red Team Score: {redTeamScore}</div>
        <div className="point_blueteamscore">
          Red Blue Score: {blueTeamScore}
        </div>
      </div>
      <div className="point__board text-center">
        <h4 className="point__mainword">{randomWord}</h4>
        <h3>
          Guess - <span>{wrong + 1}</span>
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
          <button className="point__btn wrong" onClick={wrongFxn}>
            Wrong
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPoints;
