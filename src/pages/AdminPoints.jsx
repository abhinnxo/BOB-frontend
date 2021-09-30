import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import EndGame from '../images/close.png';
import '../css/adminpoints.css';
import MyTimer from '../components/MyTimer';
import { Button, Modal } from 'react-bootstrap';
const axios = require('axios');

const AdminPoints = ({ socket }) => {
  const [score, setScore] = useState(0);
  const [guess, setGusser] = useState('"..."');
  const [wrong, setWrong] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [randomWord, setRandomWord] = useState('"..."');
  const [guesserName, setGuesserName] = useState('');
  // Show players score
  const [redTeamScore, setRedTeamScore] = useState(0);
  const [blueTeamScore, setBlueTeamScore] = useState(0);
  const [show, setShow] = useState(false);
  // const [guesserTeam, setGuesserTeam] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const time = new Date();
  time.setSeconds(time.getSeconds() + 90);
  const [guessingArr, setGuessingArray] = useState([]);
  const history = useHistory();
  const location = useLocation();
  //  new team names given by the host
  const [bluename, setBluename] = useState('');
  const [redname, setRedname] = useState('');

  // getting new team name given by the host
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/newteamnames`,
    })
      .then((res) => {
        setBluename(res.data.newblueteamname);
        setRedname(res.data.newredteamname);
      })
      .catch((err) => console.error(err));
  }, []);

  // getting the random word
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/randomword`,
    })
      .then((res) => {
        setRandomWord(res.data);
      })
      .catch((err) => console.error(err));

    //  getting round number
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/roundNo`,
    })
      .then((res) => {
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
        setRedTeamScore(res.data[0].TeamScore);
        setBlueTeamScore(res.data[1].TeamScore);
      })
      .catch((err) => console.error(err));
  }, []);

  // setting final gueser array
  useEffect(() => {
    console.log('guess array  ', guessingArr);
    setGuessingArray(location.state.arr);
  }, []);

  // when game is ended route everyone to main screen
  socket.on('game-ended', (gameValue) => {
    localStorage.clear();
    if (gameValue === 1) {
      history.push('/endgame');
    }
  });

  socket.on('guessToHost', (guessSubmitted) => {
    setGusser(guessSubmitted);
  });

  function score5() {
    setScore(5);
    setShow(true);
    socket.emit('change-score', 5);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
  }

  function score4() {
    setScore(4);
    setShow(true);
    socket.emit('change-score', 4);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
  }

  function score3() {
    setScore(3);
    setShow(true);
    socket.emit('change-score', 3);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
  }

  function endGame() {
    if (window.confirm('Are you sure you want to end the game for everyone?')) {
      socket.emit('game-end-clicked', 0);
      localStorage.clear();
    }
  }

  function wrongFxn() {
    setWrong(wrong + 1);
    socket.emit('wrong-guess', wrong);
    setGusser('"..."');
    if (wrong == 2) {
      setScore(0);
      setShow(true);
      socket.emit('change-score', 0);
      setRoundNumber(roundNumber + 1);
      socket.emit('change-round', roundNumber);
      setWrong(1);
    }
  }
  // getting the guesser name
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/guesserName`,
    })
      .then((res) => {
        console.log('guessername', res.data);
        if (res.data.guesserNameRed !== '' && res.data.guesserNameBlue !== '')
          setGuesserName(res.data);
      })
      .catch((err) => console.error(err));
  });

  function changeScreen() {
    history.push('/admin/destroy');
  }

  return (
    <div className="point">
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Round {roundNumber - 1} Scorecard</Modal.Title>
        </Modal.Header>
        <Modal.Body>Scored {score} points for his team.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={changeScreen}>
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
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
        </div>
      </div>
      <div className="d-flex justify-content-between point__teamscores">
        <div className="point__redteamscore">
          {redname} Score: {redTeamScore}
        </div>
        <div className="point__blueteamscore">
          {bluename} Score: {blueTeamScore}
        </div>
      </div>
      <br />
      <h4>
        <center>
          Words that reached the Commander in Chief of
          {roundNumber % 2 === 0 ? <h4>{redname}</h4> : <h4>{bluename}</h4>}
        </center>
      </h4>
      <div className="gusserhints">
        {guessingArr.map(function (index, item) {
          return <p key={index}>{item}</p>;
        })}
      </div>
      <div className="point__board text-center">
        <div className="point__mainword">
          #{roundNumber}&nbsp;Secret Word:&nbsp;<h3>{randomWord}</h3>
        </div>
        <h3>
          Guess - <span>{wrong + 1}</span>
        </h3>
        <h5 style={{ fontFamily: 'PaytoneOne' }}>
          The Answer submitted by &nbsp;
          {roundNumber % 2 === 0 ? (
            <span style={{ color: 'red' }}>{guesserName.guesserNameRed}</span>
          ) : (
            <span style={{ color: 'blue' }}>{guesserName.guesserNameBlue}</span>
          )}
          &nbsp; is...
        </h5>
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
