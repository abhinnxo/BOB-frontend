// Team Red Players will enter their hinst here
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import ImageButton from '../components/ImageButton';
import ImageInput from '../components/ImageInput';
import Clock from '../images/clock.svg';
import '../css/teamred.css';
import ModalComponent from '../components/Modal';
import { Button, Modal } from 'react-bootstrap';
import { useLocation } from 'react-router';
const axios = require('axios');

const TeamRed = ({ socket }) => {
  const [hint, setHint] = useState('');
  const [roundfromBackend, setRoundFromBackend] = useState(1);
  // const [chatmsgSent, setchatmsgSent] = useState(0);
  const [redTeamScore, setRedTeamScore] = useState(0);
  const [blueTeamScore, setBlueTeamScore] = useState(0);
  const [guesserId, setGueserId] = useState('');
  const [randomword, setRandomWord] = useState(' ... ');
  const [usermsgsent, setUserMagSent] = useState(0);
  const [chance, setChance] = useState('');
  const history = useHistory();
  const [wordError, setWordError] = useState('');
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [guesserName, setGuesserName] = useState('');
  const [guessedWord, setGuessedWord] = useState('"..."');
  const [clue, setClue] = useState(0);
  const [guesserTeam, setGuesserTeam] = useState('');
  const [enemyTeam, setEnemyTeam] = useState('');
  const location = useLocation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  //  new team names given by the host
  const [newredname, setNewredname] = useState('');
  const [newbluename, setNewbluename] = useState('');

  // getting new team name given by the host
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/newteamnames`,
    })
      .then((res) => {
        console.log('<<<new team name>>>', res.data);
        setNewbluename(res.data.newblueteamname);
        setNewredname(res.data.newredteamname);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setClue(location.state.clueGiven);
  }, []);

  // getting the round number
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
  }, [guesserId]);

  //  get random word
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/randomword`,
    })
      .then((res) => {
        setRandomWord(res.data);
      })
      .catch((err) => console.error(err));
  });

  // getting the guesser name
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/guesserName`,
    })
      .then((res) => {
        // blue gyesser
        if (roundfromBackend % 2 !== 0 && res.data.guesserNameBlue !== '') {
          setGuesserName(res.data);
          setGuesserTeam('Blue Spartans');
          setEnemyTeam('Red Gladiators');
        }
        // red guesser
        if (roundfromBackend % 2 === 0 && res.data.guesserNameRed !== '') {
          setGuesserName(res.data);
          setEnemyTeam('Blue Spartans');
          setGuesserTeam('Red Gladiators');
        }
      })
      .catch((err) => console.error(err));
  });

  // setting the round number
  socket.on('current-round', (round) => {
    setRoundFromBackend(round);
  });

  //  end game button
  useEffect(() => {
    socket.on('game-ended', (gameValue) => {
      if (gameValue == 1) {
        localStorage.clear();
        history.push('/endgame');
      }
    });

    // sync-timer-to-frontend
    socket.on('sync-timer-to-frontend', (time) => {
      setMin(time.minutes);
      setSec(time.seconds);
    });

    socket.on('round-change-from-backend', (round) => {
      // setchatmsgSent(1);
      setUserMagSent(0);
      setChance('');
      setRoundFromBackend(round);
      setClue(0);
    });

    socket.on('guessed-wrong', (wrong) => {
      setChance(`Commander guessed wrong, Now ${2 - wrong} chance(s) left`);
    });

    socket.on('guessID', (guesserID) => {
      console.log('guesser ID from backend', guesserID);
      setGueserId(guesserID);
      setShow(true);
    });
  }, [socket]);

  const sendHint = () => {
    var flag = 0;

    var wordArr = hint.split(' ');
    console.log('[<<<<< WORD ARR >>>>> ', wordArr);
    if (wordArr.length > 1) {
      flag = 1;
      setWordError('Please enter a clue with single word only');
      setTimeout(() => {
        setWordError('');
      }, 5000);
    }
    if (flag === 0) {
      setUserMagSent(1);
      socket.emit('msgListMake', { hint, room: 'Team Red' });
      document.querySelector('.red__input').value = '';
      history.push({
        pathname: '/red/animation',
      });
    }
  };

  // Change routes for new gusser
  socket.on('change-guesser', (value) => {
    if (value) {
      axios({
        method: 'get',
        url: `https://bob-backend-madiee-h.herokuapp.com/guesserid`,
      })
        .then((res) => {
          console.log('<<< guesser ID >>> ', res.data);
          if (socket.id === res.data) {
            history.push('/red/guess');
          }
        })
        .catch((err) => console.error(err));

      // getting the random word
      axios({
        method: 'get',
        url: `https://bob-backend-madiee-h.herokuapp.com/randomword`,
      })
        .then((res) => {
          setRandomWord(res.data);
        })
        .catch((err) => console.error(err));
    }
  });

  //  Word submitted by the guesser
  socket.on('guessToHost', (guessSubmitted) => {
    console.log('guessSubmitted', guessSubmitted);
    setGuessedWord(guessSubmitted);
  });

  function changeScreen() {
    if (guesserId === socket.id) {
      if (socket.id === guesserId) {
        history.push({
          pathname: `/red/guess`,
          state: {
            gusserid: guesserId,
          },
        });
      }
    }
    setShow(false);
  }

  return (
    <div className="red__bg">
      {!clue ? (
        <div>
          <ModalComponent
            content={`${guesserTeam} are trapped, and are sending messages to their commander in chief.
        ${enemyTeam} are the enemies, and they are trying their best to stop.`}
            buttonTitle="TeamRed"
            heading={roundfromBackend}
          />
        </div>
      ) : (
        <div></div>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Team Red Gladiators </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Scored points for his team.
          <br></br>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={changeScreen}>
            Understood
          </Button>
        </Modal.Footer>
      </Modal>
      {!clue ? (
        <div className="red__enterhint text-center">
          <h5>{chance}</h5>
          <h3>
            Enter a clue similar to{' '}
            <span className="red__randomword" style={{ color: '#844719' }}>
              "{randomword}"
            </span>
          </h3>
          <br />
          <h4>
            {roundfromBackend % 2 === 0 ? (
              <span style={{ color: 'red' }}>{guesserName.guesserNameRed}</span>
            ) : (
              <span style={{ color: 'blue' }}>
                {guesserName.guesserNameBlue}
              </span>
            )}
            &nbsp;is the Commander...
          </h4>

          {usermsgsent ? (
            <div>Clue submitted</div>
          ) : (
            <div>
              <h6 style={{ color: 'red' }}>{wordError}</h6>
              <ImageInput
                text="Type your clue here..."
                change={(e) => setHint(e.target.value)}
                classList="red__input"
              />
              <br />
              <ImageButton
                value="ENTER"
                classlist="red__enterbtn"
                clickMe={sendHint}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="red__wait text-center">
          <h2>
            Your Clue for the word{' '}
            <span className="red__randomword" style={{ color: 'red' }}>
              "{randomword}"{' '}
            </span>
            has been sent off...
          </h2>
          <h4>Your Commander is trying to dechiper the clues:</h4>
          <h4>{guessedWord}</h4>
          <h6>{chance}</h6>
        </div>
      )}
      <div className="red__timer d-flex align-items-baseline">
        <img src={Clock} alt="time" />
        <h3>
          <span id="Timer">
            {min}:{sec}
          </span>
        </h3>
      </div>
      <div className="red__rank">
        <div className="red__red d-flex justify-content-between px-3">
          <h3 className="my-auto mx-auto" style={{ color: 'white' }}>
            {newredname}: &nbsp;{' '}
            <span style={{ color: 'white' }}>{redTeamScore}</span>
          </h3>
        </div>
        <div className="red__blue d-flex justify-content-between px-3">
          <h3 className="my-auto mx-auto" style={{ color: '#9b5825' }}>
            {newbluename}: &nbsp;{' '}
            <span style={{ color: '#ffffff' }}>{blueTeamScore}</span>
          </h3>
        </div>
      </div>
      <div className="round__number">
        <h3>
          Round: <span>{roundfromBackend}</span>
        </h3>
      </div>
    </div>
  );
};

export default TeamRed;
