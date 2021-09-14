// Team blue. Players will enter their hinst here
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import ImageButton from '../components/ImageButton';
import ImageInput from '../components/ImageInput';
import Clock from '../images/clock.svg';
import '../css/teamblue.css';
const axios = require('axios');

function TeamBlue({ socket }) {
  const [hint, setHint] = useState('');
  const [roundfromBackend, setRoundFromBackend] = useState(1);
  const [chatmsgSent, setchatmsgSent] = useState(0);
  const [redTeamScore, setRedTeamScore] = useState(0);
  const [blueTeamScore, setBlueTeamScore] = useState(0);
  const [guesserId, setGueserId] = useState('');
  const [randomword, setRandomWord] = useState(' ... ');
  const history = useHistory();
  const [chance, setChance] = useState('');
  const [wordError, setWordError] = useState('');
  const [usermsgsent, setUserMagSent] = useState(0);
  const [min, setMin] = useState(1);
  const [sec, setSec] = useState(30);

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

  useEffect(() => {
    // getting the  random word
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

  // setting the round number
  socket.on('current-round', (round) => {
    console.log('xyz round', round);
    setRoundFromBackend(round);
  });

  //  end game button
  useEffect(() => {
    socket.on('game-ended', (gameValue) => {
      if (gameValue == 1) {
        localStorage.clear();
        window.location.href = '/';
      }
    });

    // sync-timer-to-frontend
    socket.on('sync-timer-to-frontend', (time) => {
      console.info('guesser timer', time);
      setMin(time.minutes);
      setSec(time.seconds);
    });

    socket.on('round-change-from-backend', (round) => {
      setchatmsgSent(1);
      setUserMagSent(0);
      setChance('');
      setRoundFromBackend(round);
    });

    socket.on('guessed-wrong', (wrong) => {
      setChance(`Guesser guessed wrong, ${2 - wrong} chances are left...`);
    });

    socket.on('guessID', (guesserID) => {
      console.log('guesser ID from backend', guesserID);
      setGueserId(guesserID);
      if (guesserID == socket.id) {
        if (socket.id === guesserID) {
          history.push({
            pathname: `/blue/guess`,
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
    socket.emit('msgListMake', { hint, room: 'Team Blue' });
    document.querySelector('.blue__input').value = '';
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
      // socket.emit('msgListMake', { hint, room: 'Team Blue' });
      document.querySelector('.blue__input').value = '';
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
          console.log('guesserID from backend: ', res.data);
          if (socket.id === res.data.gusserSocketID) {
            history.push('/blue/guess');
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
    <div className="blue__bg">
      <div className="blue__enterhint text-center">
        <h5>{chance}</h5>
        <h3>
          Enter a Word simmilar to{' '}
          <span className="blue__randomword" style={{ color: 'red' }}>
            " {randomword} "
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
              classList="blue__input"
            />
            <br />
            <ImageButton
              value="ENTER"
              classlist="blue__enterbtn"
              clickMe={sendHint}
            />
          </div>
        )}
      </div>
      <div className="blue__timer d-flex align-items-baseline">
        <img src={Clock} alt="time" />
        <h3>
          <span id="Timer">
            {min}:{sec}
          </span>
        </h3>
      </div>
      <div className="blue__teamranks d-flex justify-content-between px-3">
        <h3 className="my-auto" style={{ color: '#ffffff' }}>
          Score: {blueTeamScore}
        </h3>
        <h3 className="my-auto" style={{ color: '#603913' }}>
          Round: <span>{roundfromBackend}</span>
        </h3>
      </div>
    </div>
  );
}

export default TeamBlue;
