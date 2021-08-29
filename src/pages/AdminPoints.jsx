import React, { useState, useEffect } from 'react';
import ImageInput from '../components/ImageInput';
import Setting from '../images/settings.svg';
import PauseTimer from '../images/pause_timer.svg';
import EndGame from '../images/end_game.svg';
import NextRound from '../images/next_round.svg';
import Send from '../images/send.svg';
import '../css/adminpoints.css';

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
  const [roundNumber, setRoundNumber] = useState(1);
  var count = 0;
  var stopTimer = 0;
  var finalArray = [];
  const pointSend = () => {
    alert('Clue sent...');
  };

  useEffect(() => {
    socket.on('game-ended', (gameValue) => {
      if (gameValue === 1) {
        window.location.href = '/';
      }
    });

    socket.on('random-word-host', (rands) => {
      console.log(rands);
      document.getElementById('randomWord').innerHTML = rands;
    });

    socket.on('final-Array', (myArray) => {
      console.log('final Array:', myArray);

      finalArray = myArray;
      for (var i = 0; i < myArray.length; i++) {
        document.getElementById(`checkbox${i}`).hidden = false;
        document.getElementById(`check${i}`).innerHTML = myArray[i];
      }
    });

    socket.on('timer-counter', ({ minutes, seconds }) => {
      document.getElementById('Timer').innerHTML = minutes + ':' + seconds;
    });

    socket.on('game-ended', (gameValue) => {
      console.log('vbnm');
      if (gameValue == 1) {
        window.location.href = '/';
      }
    });
  }, []);

  function stopTime() {
    document.getElementById('Timer').innerHTML = 0 + ':' + 0;
    socket.emit('stopTimer', stopTimer);
  }

  socket.on('random-word', (word) => {
    console.log('ADMIN POINT', word);
    document.querySelector('.point__mainword').innerHTML = word;
  });

  socket.on('guessToHost', (guessSubmitted) => {
    console.log('guessSubmitted', guessSubmitted);
    document.querySelector('.point__randomword').innerHTML = guessSubmitted;
  });

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
  }

  function score4() {
    setScore(4);
    console.log('4 score button clicked');
    socket.emit('change-score', score);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    socket.emit('timer-start', count);
    document.getElementById('roundNo').innerHTML = roundNumber;
  }

  function score3() {
    setScore(3);
    console.log('3 score button clicked');
    socket.emit('change-score', score);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    socket.emit('timer-start', count);
    document.getElementById('roundNo').innerHTML = roundNumber;
  }

  function score0() {
    setScore(0);
    console.log('0 score button clicked');
    socket.emit('change-score', score);
    setRoundNumber(roundNumber + 1);
    socket.emit('change-round', roundNumber);
    socket.emit('timer-start', count);
    document.getElementById('roundNo').innerHTML = roundNumber;
  }

  function endGame() {
    socket.emit('game-end-clicked', gameStatus);
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
            <span id='Timer'></span>
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
        <h4 className='point__mainword'>Main Word</h4>
        <h3>
          Guess - <span>1</span>
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
          <button className='point_btn wrong'>Wrong</button>
        </div>

        {/* <ImageInput text='Type a clue...' /> */}
        <img
          src={Send}
          alt='send'
          className='point__send'
          onClick={pointSend}
        />
      </div>
    </div>
  );
};

export default AdminPoints;
