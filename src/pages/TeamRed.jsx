// Team Red Players will enter their hinst here
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import ImageButton from '../components/ImageButton';
import ImageInput from '../components/ImageInput';
import Clock from '../images/clock.svg';
import '../css/teamred.css';
import { useLocation } from 'react-router';
const axios = require('axios');

const TeamRed = ({ socket }) => {
  const [hint, setHint] = useState('');
  const [roundfromBackend, setRoundFromBackend] = useState(1);
  const [chatmsgSent, setchatmsgSent] = useState(0);
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

  const location = useLocation();

  useEffect(() => {
    // getting the round number
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/roundNo`,
    })
      .then((res) => {
        console.log('axios ', res.data);
        console.log('ad des,  ', res.data.round);
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
        console.log('score from backend: ', res.data);

        setRedTeamScore(res.data[0].TeamScore);
        setBlueTeamScore(res.data[1].TeamScore);
      })
      .catch((err) => console.error(err));
  }, [guesserId]);

  //  get random word
  useEffect(() => {
    // getting the random word
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/randomword`,
    })
      .then((res) => {
        console.log('axios ', res.data);
        setRandomWord(res.data);
      })
      .catch((err) => console.error(err));
  });

  // // getting the guesser name
  // socket.on('guesserName', (name) => {
  //   setGuesserName(name);
  //   console.log('<<<GUESSER NAME>>>', name);
  // });
  // setting the round number
  socket.on('current-round', (round) => {
    console.log('xyz round', round);
    setRoundFromBackend(round);
  });

  useEffect(() => {
    socket.on('game-ended', (gameValue) => {
      if (gameValue == 1) {
        localStorage.clear();
        history.push('/endgame');
      }
    });

    // sync-timer-to-frontend
    socket.on('sync-timer-to-frontend', (time) => {
      console.info('guesser timer', time);
      setMin(time.minutes);
      setSec(time.seconds);
    });

    socket.on('round-change-from-backend', (round) => {
      setUserMagSent(0);
      setchatmsgSent(1);
      setChance('');
      setRoundFromBackend(round);
      location.state.clueGiven = 0;
    });

    socket.on('guessed-wrong', (wrong) => {
      setChance(`Guesser guessed wrong, Now ${2 - wrong} chance(s) left`);
    });

    socket.on('guessID', (guesserID) => {
      console.log('guesser ID from backend', guesserID);
      setGueserId(guesserID);
      if (guesserID == socket.id) {
        if (socket.id === guesserID) {
          history.push({
            pathname: `/red/guess`,
            state: {
              gusserid: guesserID,
            },
          });
        }
      }
    });
  }, [socket]);

  socket.emit('guessingTeam', roundfromBackend);

  const sendHint = () => {
    setUserMagSent(1);
    socket.emit('msgListMake', { hint, room: 'Team Red' });
    document.querySelector('.red__input').value = '';
    let len = hint.length;
    var flag = 0;
    for (var i = 0; i < len; i++) {
      if (hint[i] === ' ') {
        setWordError('Please enter a clue with single word only');
        flag = 1;
        break;
      }
    }
    if (flag == 0) {
      setUserMagSent(1);
      // socket.emit('msgListMake', { hint, room: 'Team Red' });
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
          if (socket.id === res.data.gusserSocketID) {
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
          console.log('axios ', res.data);
          setRandomWord(res.data);
        })
        .catch((err) => console.error(err));
    }
  });

  return (
    <div className="red__bg">
      {!location.state.clueGiven ? (
        <div className="red__enterhint text-center">
          <h5>{chance}</h5>
          <h3>
            Enter a Word similar to{' '}
            <span className="red__randomword" style={{ color: 'red' }}>
              "{randomword}"
            </span>
          </h3>
          <br />
          {usermsgsent ? (
            <div>Word submitted</div>
          ) : (
            <div>
              <h6 style={{ color: 'red' }}>{wordError}</h6>
              <ImageInput
                text="Type your word here..."
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
          <h4>
            Your Clue for the word{' '}
            <span className="red__randomword" style={{ color: 'red' }}>
              "{randomword}"{' '}
            </span>
            has been submitted
          </h4>
          <h4>Guesser is currently submitting thier guesses</h4>
          <h4>{chance}</h4>
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
          <h3 className="my-auto mx-auto" style={{ color: '#9b5825' }}>
            Team Red: &nbsp;{' '}
            <span style={{ color: '#ffffff' }}>{redTeamScore}</span>
          </h3>
        </div>
        <div className="red__blue d-flex justify-content-between px-3">
          <h3 className="my-auto mx-auto" style={{ color: '#9b5825' }}>
            Team Blue: &nbsp;{' '}
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
