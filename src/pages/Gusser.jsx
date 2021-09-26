import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import ImageButton from '../components/ImageButton';
import ImageInput from '../components/ImageInput';
import Clock from '../images/clock.svg';
import '../css/gusser.css';
const axios = require('axios');

const Gusser = ({ socket }) => {
  const [guess, setGuess] = useState('');
  const [hintList, setHintList] = useState(['Waiting for Clues...']);
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

  var v = 0;

  useEffect(() => {
    socket.on('show-previous-screen', (value) => {
      setGuesserbtn(true);
    });
  });

  socket.on('guessID', (guesserID) => {
    console.log('guesser ID from backend', guesserID);
    setTeam(localStorage.getItem('team'));
    let teamName = localStorage.getItem('team');

    if (socket.id === guesserID) {
      v = 1;

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

  return (
    <div className="gusser">
      <div className="gusser__bg"></div>
      <h3 className="guesser__title">Team {team === 'red' ? 'Red' : 'Blue'}</h3>
      <div className="gusser__teamranks d-flex justify-content-between px-3">
        <h3 className="my-auto" style={{ color: '#ffffff' }}>
          Team Points:
        </h3>
        <h3 className="my-auto" style={{ color: '#603913' }}>
          {team === 'red' ? redTeamScore : blueTeamScore}
        </h3>
      </div>
      <div className="gusser__hints">
        {hintList.map((hint, index) => {
          return <div key={index}>{hint}</div>;
        })}
      </div>
      <div className="gusser__timer d-flex align-items-baseline">
        <img src={Clock} alt="time" />
        <h3>
          {min}:{sec}
        </h3>
      </div>
      <div className="gusser__enterdiv">
        <h3 className="fw-bold">You're the Guesser now</h3>
        <br />
        <h6>{chance}</h6>
        {guessSend ? (
          <div className="text-center">
            <h5>
              <span style={{ color: 'red' }}>Guess sent</span>, waiting for
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
