import React, { useState, useEffect } from 'react';
import ImageInput from '../components/ImageInput';
import Setting from '../images/settings.svg';
import PauseTimer from '../images/pause_timer.svg';
import EndGame from '../images/end_game.svg';
import NextRound from '../images/next_round.svg';
import Send from '../images/send.svg';
import '../css/adminpoints.css';
import { useHistory } from 'react-router';

const style = {
  color: 'white',
  fontSize: '25px',
  width: '400px',
  height: '110px',
  cursor: 'pointer',
  border: 'none',
};

const AdminPoints = ({ socket }) => {
  // const [word, setWord] = useState("")
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState(0);
  const [giveGuest, setGiveGuest] = useState(false);
  const [wrong, setWrong] = useState(0);
  const [word, setword] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [arr, setArr] = useState([]);
  var count = 0;
  var stopTimer = 0;
  var finalArray = [];
  const pointSend = () => {
    alert('Clue sent...');
  };
  const history = useHistory();

  const [roundNumber, setRoundNumber] = useState(1);

  useEffect(() => {
    socket.on('random-word', (rands) => {
      console.log(rands);
      document.getElementById('randomWord').innerHTML = rands;
    });

    socket.on('game-ended', (gameValue) => {
      if (gameValue === 1) {
        window.location.href = '/';
      }
    });

    socket.on('game-ended', (gameValue) => {
      console.log('vbnm');
      if (gameValue === 1) {
        window.location.href = '/';
      }
    });

    socket.on('random-word', (word) => {
      console.log('ADMIN POINT', word);
      setword(word);
      localStorage.setItem('word', word);
    });

    socket.on('guessToHost', (guessSubmitted) => {
      console.log('guessSubmitted', guessSubmitted);
      document.querySelector('.point__randomword').innerHTML = guessSubmitted;
    });

    // socket.on('final-Array', (myArray) => {
    //   console.log('final Array:', myArray);

    //   finalArray = myArray;
    //   for (var i = 0; i < myArray.length; i++) {
    //     document.getElementById(`checkbox${i}`).hidden = false;
    //     document.getElementById(`check${i}`).innerHTML = myArray[i];
    //   }
    // });
  }, [socket]);

  socket.on('All-Words', (arr) => {
    console.log('All words log 2');
    setArr(arr);
  });

  useEffect(() => {
    socket.emit('showToGuesser', arr);
    if (giveGuest)
      history.push({
        pathname: '/admindestroy',
      });
  }, [giveGuest]);

  // useEffect(() => {
  //   socket.on('timer-counter', ({ minutes, seconds }) => {
  //     setMinutes(minutes);
  //     setSeconds(seconds);
  //   });
  // }, []);

  socket.on('guessed-wrong', (wrong) => {
    if (wrong > 2) {
      setScore(0);
      socket.emit('change-score', score);
      setRoundNumber(roundNumber + 1);
      socket.emit('change-round', roundNumber);
      socket.emit('timer-start', count);
      document.getElementById('roundNo').innerHTML = roundNumber;
      setWrong(1);
      history.push('/admindestroy');
    }
  });

  function stopTime() {
    socket.emit('stopTimer', stopTimer);
  }

  count = 0;
  socket.emit('timer-start', count);

  function score5() {
    setScore(5);
    console.log('5 score button clicked');
    socket.emit('change-score', score);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    count = 0;
    socket.emit('timer-start', count);
    document.getElementById('roundNo').innerHTML = roundNumber;
    //history.push('/admindestroy');
  }

  function score4() {
    setScore(4);
    console.log('4 score button clicked');
    socket.emit('change-score', score);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    socket.emit('timer-start', count);
    document.getElementById('roundNo').innerHTML = roundNumber;
    //history.push('/admindestroy');
  }

  function score3() {
    setScore(3);
    console.log('3 score button clicked');
    socket.emit('change-score', score);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    socket.emit('timer-start', count);
    document.getElementById('roundNo').innerHTML = roundNumber;
    //history.push('/admindestroy');
  }

  function score0() {
    setScore(0);
    console.log('0 score button clicked');
    socket.emit('change-score', score);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    socket.emit('timer-start', count);
    document.getElementById('roundNo').innerHTML = roundNumber;
    //history.push('/admindestroy');
  }

  function endGame() {
    socket.emit('game-end-clicked', gameStatus);
  }

  function wrongFxn() {
    setWrong(wrong + 1);
    socket.emit('wrong-guess', wrong);
  }

  return (
    <div className='point'>
      <div className='point__bg'></div>
      <div className='point__controls d-flex justify-content-between'>
        <div>
          <div className='point__setting'>
            <img src={Setting} alt='settings' />
          </div>
          <p className='point__timer'>
            <span>
              {minutes}:{seconds}
            </span>
          </p>
          <div className='pauseTimer'>
            {' '}
            <img src={PauseTimer} alt='pause timer' onClick={stopTime} />
          </div>
        </div>
        <div>
          <div>
            <img src={EndGame} alt='end game' onClick={endGame} />
          </div>
          <p className='point__round'>
            <div>
              Round <span id='roundNo'>1</span>
            </div>
          </p>
          {/* <div className='nextRound'>
            <img src={NextRound} alt='next round' />
          </div> */}
        </div>
      </div>
      <div className='point__board text-center'>
        <h4 className='point__mainword'>{word}</h4>
        <h3>
          Guess - <span>{wrong}</span>
        </h3>
        <h6>The Answer submitted is</h6>
        <h1 className='point__randomword' id='randomWord'>
          "Random"
        </h1>
        <div className='d-flex justify-content-evenly text-center my-3'>
          <button className='point_btn plus_five' onClick={score5}>
            + 5
          </button>
          <button className='point_btn plus_four' onClick={score4}>
            + 4
          </button>
          <button className='point_btn plus_three' onClick={score3}>
            + 3
          </button>
          <button className='point_btn plus_zero' onClick={score0}>
            + 0
          </button>
          <button className='point_btn wrong' onClick={wrongFxn}>
            Wrong
          </button>
        </div>

        {/* <ImageInput text='Type a clue...' /> */}
        {/* <img
          src={Send}
          alt='send'
          className='point__send'
          onClick={pointSend}
        /> */}
        <button className='admin__destroy' onClick={() => setGiveGuest(true)}>
          proceed
        </button>
      </div>
    </div>
  );
};

export default AdminPoints;
