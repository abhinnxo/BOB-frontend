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
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [wordError, setWordError] = useState('');
  const [guessSend, setGuessSend] = useState(0);
  const [chance, setChance] = useState('');
  let seconds = 90;

  // timer function
  useEffect(() => {
    setInterval(() => {
      if (seconds >= 0) {
        setMin(parseInt(seconds / 60, 10));
        setSec(parseInt(seconds % 60, 10));

        console.log(min + ':' + sec);
      }
      seconds--;
    }, 1000);
  }, []);
  let v = 0;

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

      // socket.on("scores", (game) => {
      //   console.log("game:", game);
      //   //document.getElementById('scoreTeamRed').innerHTML = game[0].TeamScore;
      //   if (round % 2 == 0) {
      //     setScore(game[0].TeamScore);
      //   } else {
      //     setScore(game[1].TeamScore);
      //   }
      // });

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
            },
          });
        } else {
          console.log('History', history);
          if (teamName === 'blue') {
            history.push({ pathname: '/blue' });
          } else history.push({ pathname: '/red' });
        }
      });
    });

    axios({
      method: 'get',
      url: 'http://localhost:5000/score',
    })
      .then((res) => {
        console.log('guesserID from backend: ', res.data.game);
        setRedTeamScore(res.data.game[0]);
        setBlueTeamScore(res.data.game[1]);
      })
      .catch((err) => console.error(err));
  }, []);

  //  On clickong Enter button
  const guessSubmitted = () => {
    let len = guess.length;
    var flag = 0;
    for (var i = 0; i < len; i++) {
      if (guess[i] === ' ') {
        setWordError('Please enter a guess with single word only');
        flag = 1;
        break;
      }
    }
    if (flag == 0) {
      socket.emit('guessSubmission', guess);
      console.log(guess);
      setGuessSend(1);
    }
  };

  useEffect(() => {
    socket.on('game-ended', (gameValue) => {
      if (gameValue == 1) {
        localStorage.clear();
        window.location.href = '/';
      }
    });

    socket.on('guessed-wrong', (wrong) => {
      setGuessSend(0);
      setChance(`You guessed wrong,Now you have ${2 - wrong} chances left`);
    });
  }, [socket]);

  // final array from host
  socket.on('gusserHints', (arr) => {
    console.log('HINT LIST ', arr);
    setHintList(arr);
  });

  return (
    <div className='gusser'>
      <div className='gusser__bg'></div>
      <div className='gusser__teamranks d-flex justify-content-between px-3'>
        <h3 className='my-auto' style={{ color: '#ffffff' }}>
          Team Points:
        </h3>
        <h3 className='my-auto' style={{ color: '#603913' }}>
          {team === 'red' ? redTeamScore : blueTeamScore}
        </h3>
      </div>
      <div className='gusser__hints'>
        {hintList.map((hint, index) => {
          return <div key={index}>{hint}</div>;
        })}
      </div>
      <div className='gusser__timer d-flex align-items-baseline'>
        <img src={Clock} alt='time' />
        <h3>
          {min}:{sec}
        </h3>
      </div>
      <div className='gusser__enterdiv'>
        <h3 className='fw-bold'>Guess the Word</h3>
        <br />
        <h5>{chance}</h5>
        <br />
        {guessSend ? (
          <div>
            <h5>Guess send</h5>
          </div>
        ) : (
          <div>
            <h6 style={{ color: 'red' }}>{wordError}</h6>
            <ImageInput
              text='Enter your Guess'
              change={(e) => setGuess(e.target.value)}
            />
            <ImageButton
              value='ENTER'
              clickMe={guessSubmitted}
              classlist='mt-3 gusser__enterbtn'
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gusser;
