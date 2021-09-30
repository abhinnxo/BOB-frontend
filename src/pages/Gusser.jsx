import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import ImageButton from '../components/ImageButton';
import ImageInput from '../components/ImageInput';
import Clock from '../images/clock.svg';
import '../css/gusser.css';
import { Button, Modal } from 'react-bootstrap';
import ModalComponent from '../components/Modal';
const axios = require('axios');

const Gusser = ({ socket }) => {
  const [guess, setGuess] = useState('');
  const [hintList, setHintList] = useState([
    'Waiting for pigeons with the clues to arrive...',
  ]);
  const [redTeamScore, setRedTeamScore] = useState(0);
  const [blueTeamScore, setBlueTeamScore] = useState(0);
  const location = useLocation();
  const [roundfromBackend, setRoundFromBackend] = useState(1);
  const [team, setTeam] = useState('');
  const history = useHistory();
  const [min, setMin] = useState(1);
  const [sec, setSec] = useState(30);
  const [wordError, setWordError] = useState('');
  const [guessSend, setGuessSend] = useState(0);
  const [chance, setChance] = useState('');
  const [showGuesserbtn, setGuesserbtn] = useState(false);
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState('');
  const [guesserID, setGuesserID] = useState(0);
  //  new team names given by the host
  const [bluename, setBluename] = useState('');
  const [redname, setRedname] = useState('');
  const [scoreChange, setScoreChange] = useState(0);

  const handleClose = () => setShow(false);

  useEffect(() => {
    socket.on('show-previous-screen', (value) => {
      setGuesserbtn(true);
    });

    socket.on('score-change', (score) => {
      setScoreChange(score);
    });
  });

  socket.on('guessID', (guesserID) => {
    setTeam(localStorage.getItem('team'));
    setGuesserID(guesserID);
    setShow(true);
  });

  useEffect(() => {
    socket.emit('gusserid', location.state.gusserid);

    socket.on('round-change-from-backend', (round) => {
      setRoundFromBackend(round);
      setGuessSend(0);
      if (round % 2 === 0) {
        setTeam('red');
      } else {
        setTeam('blue');
      }
    });

    // sync-timer-to-frontend
    socket.on('sync-timer-to-frontend', (time) => {
      setMin(time.minutes);
      setSec(time.seconds);
    });

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

  //  Round from axios
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/roundNo`,
    })
      .then((res) => {
        setRoundFromBackend(res.data.round);
      })
      .catch((err) => console.error(err));
  }, []);

  //  On clickong Enter button
  const guessSubmitted = () => {
    var flag = 0;

    // TODO: if the input is empty then don't send

    // more than one word
    var guessCheck = guess.split(' ');
    if (guessCheck.length > 1) {
      flag = 1;
      setWordError('Please enter a guess with single word only');
      setTimeout(() => {
        setWordError('');
      }, 5000);
    }

    if (flag === 0) {
      socket.emit('guessSubmission', guess);
      console.log(guess);
      setGuessSend(1);
      document.querySelector('#chance-msg').style.display = 'none';
    }
  };

  // game end
  useEffect(() => {
    socket.on('game-ended', (gameValue) => {
      if (gameValue == 1) {
        localStorage.clear();
        history.push('/endgame');
      }
    });

    socket.on('guessed-wrong', (wrong) => {
      setGuessSend(0);
      setChance(`You guessed wrong, you have ${2 - wrong} chance(s) left`);
    });
  }, [socket]);

  // send guesserid to backend
  socket.emit('guesserid-from-frontend', socket.id);

  // final array from host
  socket.on('gusserHints', (arr) => {
    setHintList(arr);
  });

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

  function changeScreen() {
    console.log('This function called');
    setTimeout(() => {
      setModalText('You will automatically redirected in 5s');
      console.log('timeout');
    }, 5000);

    let teamName = localStorage.getItem('team');
    if (socket.id === guesserID) {
      history.push({
        pathname: `/${teamName}/guess`,
        state: {
          gusserid: guesserID,
          clueGiven: 0,
        },
      });
    } else {
      console.log('History', history);
      if (teamName === 'blue') {
        history.push({
          pathname: '/blue',
          state: {
            clueGiven: 0,
          },
        });
      } else
        history.push({
          pathname: '/red',
          state: {
            clueGiven: 0,
          },
        });
    }
  }

  return (
    <div className="gusser">
      {roundfromBackend % 2 == 0 ? (
        <div>
          {' '}
          <ModalComponent
            content={`Congrats you are the commander in cheif of Team Red Gladiators.Try to decipher the clues sent by your soilders. `}
            heading={roundfromBackend}
          />
        </div>
      ) : (
        <div>
          {' '}
          <ModalComponent
            content={`Congrats you are the commander in cheif of Team Blue Spartans.Try to decipher the clues sent by your soilders.`}
            heading={roundfromBackend}
          />
        </div>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Your Scorecard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {scoreChange > 0 ? (
            <div>
              Congrats!! you scored {scoreChange} points for Team {team}.
            </div>
          ) : (
            <div>
              Sorry, you were not able to identify the secret word to locate
              your soldiers. They are trapped forever in enemy premises.
            </div>
          )}
          <br></br>
          <h3>{modalText}</h3>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={changeScreen}>
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="gusser__bg"></div>
      <div className="gusser__teamranks d-flex justify-content-between px-3">
        <h3 className="my-auto" style={{ color: '#ffffff' }}>
          Team {team === 'red' ? redname : bluename}:
        </h3>
        <h3 className="my-auto" style={{ color: '#603913' }}>
          {team === 'red' ? redTeamScore : blueTeamScore}
        </h3>
      </div>
      <div className="gusser__hints">
        <h5>
          {hintList.map((hint, index) => {
            return <div key={index}>{hint}</div>;
          })}
        </h5>
      </div>
      <div className="gusser__timer d-flex align-items-baseline">
        <img src={Clock} alt="time" />
        <h3>
          {min}:{sec}
        </h3>
      </div>
      <div className="gusser__enterdiv">
        <h3 className="fw-bold">You're the Commander in Cheif now</h3>
        <br />
        <h5 id="chance-msg" style={{ color: 'red' }}>
          {chance}
        </h5>
        {guessSend ? (
          <div className="text-center">
            <h5>
              <span style={{ color: 'red' }}>Guess sent</span>, waiting for the
              host's response...
            </h5>
          </div>
        ) : (
          <div>
            <h6 style={{ color: 'red' }}>{wordError}</h6>
            <ImageInput
              text="Enter your Guess"
              change={(e) => setGuess(e.target.value)}
            />
            {showGuesserbtn ? (
              <ImageButton
                value="SEND"
                clickMe={guessSubmitted}
                classlist="mt-3 gusser__enterbtn"
              />
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
      <div className="round__number">
        <h3>
          Round: <span>{roundfromBackend}</span>
        </h3>
      </div>
    </div>
  );
};

export default Gusser;
