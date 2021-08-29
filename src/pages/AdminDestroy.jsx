import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import '../css/admindestroy.css';
import settingsImg from '../images/settings.svg';
import endGameImg from '../images/end_game.svg';
import pauseTimerImg from '../images/pause_timer.svg';
import nextRoundImg from '../images/next_round.svg';
import destroyButton from '../images/destroy_button.svg';

const AdminDestroy = ({ socket }) => {
  const [bluearr, setBluearr] = useState([]);
  const [redarr, setRedarr] = useState([]);
  const [gameStatus, setGameStatus] = useState(0);
  const history = useHistory();

  var score = 0;
  socket.emit('change-score', score);

  useEffect(() => {
    socket.on('game-ended', (gameValue) => {
      if (gameValue === 1) {
        window.location.href = '/';
      }
    });

    // On clicking proceed button
    socket.on('Team-BlueWordList', (bluearr) => {
      console.log(bluearr);
      setBluearr(bluearr);
    });

    socket.on('Team-RedWordList', (redarr) => {
      setRedarr(redarr);
    });
  }, [socket]);

  const [word, setWord] = useState('');

  setWord(localStorage.getItem('word'));

  function endGame() {
    socket.emit('game-end-clicked', gameStatus);
  }

  return (
    <section className='hostWaitingLobby'>
      <div className='admindestroy__bg'></div>
      <div className='end_settings'>
        <img src={settingsImg} alt='' className='settings' />
        <img src={endGameImg} onClick={endGame} className='endGame' alt='' />
      </div>
      {/* <div className="timer_round">
        <p>01:30</p>
        <p>Round 2</p>
      </div> */}
      <div className='pauseTimer_nextRound'>
        {/* <img src={pauseTimerImg} alt='' /> */}
        {/* <img src={nextRoundImg} alt='' /> */}
      </div>
      <div className='players'>
        <h2 className='mainWord'>{word}</h2>
        <div className='join'>
          <span className='teamNameBlue'>Team Blue</span>
          <div className='seperateBoard'>
            <h4>Select the similar word and destroy them</h4>
            <div className='team'>
              {/* Blue Team Words */}
              <div className='eachTeam'>
                {bluearr.map((word) => {
                  return (
                    <div className='word'>
                      <span>{word}</span> <span></span>
                    </div>
                  );
                })}
              </div>
              {/* Red Team words*/}
              <div className='eachTeam'>
                {redarr.map((word) => {
                  return (
                    <div className='word'>
                      <span>{word}</span> <span></span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className='destroyButton'>
              <img src={destroyButton} alt='' />
            </div>
          </div>
          <span className='teamNameRed'>Team Red</span>
        </div>
      </div>
    </section>
  );
};

export default AdminDestroy;
