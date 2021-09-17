import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import '../css/admindestroy.css';
import endGameImg from '../images/end_game.svg';
import destroyButton from '../images/destroy_button.svg';
import MyTimer from '../components/MyTimer';
const axios = require('axios');

const AdminDestroy = ({ socket }) => {
  const [bluearr, setBluearr] = useState([]);
  const [redarr, setRedarr] = useState([]);
  const [randomword, setRandomWord] = useState('MainWord');
  const [round, setRound] = useState(1);
  const [roundNumber, setRoundNumber] = useState(1);
  // set array for the team
  const [guessingArr, setGuessingArr] = useState([]);
  const [finalArr, setFinalArr] = useState([]);
  // set guessing team
  const [guessingTeam, setGuessingTeam] = useState('blue');
  const history = useHistory();

  const time = new Date();
  time.setSeconds(time.getSeconds() + 90);

  useEffect(() => {
    if (round % 2 === 0) {
      setGuessingTeam('red');
    } else {
      setGuessingTeam('blue');
    }
  }, [round]);

  //remove enemy team checkboxes
  const destroyWords = () => {
    let allWords = document.querySelectorAll('.guessingTeam > input');
    allWords.forEach((word) => {
      if (!word.checked) {
        setGuessingArr([...guessingArr, word.value]);
        document.querySelector('.word').classList.add('admindestroy__hide');
      }
    });
    document.querySelector('.destroyButton').style.display = 'none';

    alert(
      'Your Selected Words are removed, Click Proceed to send the clues to the Guesser...'
    );
  };

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

    // getting the round number
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/roundNo`,
    })
      .then((res) => {
        console.log('axios ', res.data);
        console.log('ad des,  ', res.data.round);
        setRoundNumber(res.data.round);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    //  On clicking proceed button
    socket.on('Team-BlueWordList', (bluearr) => {
      console.log('blue word array', bluearr);
      setBluearr(bluearr);
    });

    socket.on('Team-RedWordList', (redarr) => {
      setRedarr(redarr);
      console.log(('red word array', redarr));
    });
    socket.on('game-ended', (gameValue) => {
      if (gameValue === 1) {
        history.push('/endgame');
      }
    });
    socket.on('guessID', (guesserID) => {
      console.log('guesser ID from backend', guesserID);
    });
    socket.on('current-round', (round) => {
      setRoundNumber(round);
    });

    socket.on('random-word', (word) => {
      setRandomWord(word);
    });
  }, [socket]);

  socket.on('final-Array', (arr) => {
    console.log('final-array', arr);
    setFinalArr(arr);
  });

  // send clues to the guesser
  const sendClues = () => {
    if (guessingArr.length === 0) socket.emit('showToGuesser', finalArr);
    else socket.emit('showToGuesser', guessingArr);
    var value = 1;
    socket.emit('team-screen', value);
    console.log('<<<GYES ARR>>>', guessingArr);

    history.push('/admin/points');
  };

  function endGame() {
    socket.emit('game-end-clicked', 0);
    localStorage.clear();
  }

  return (
    <section className="hostWaitingLobby">
      <div className="admindestroy__bg"></div>
      <div className="timer__round">
        {
          <MyTimer
            expiryTimestamp={time}
            showNextRound={true}
            socket={socket}
          />
        }
        <div>
          {/* <img src={settingsImg} alt="" className="settings" /> */}
          <img
            src={endGameImg}
            className="endGame"
            onClick={endGame}
            alt="End Game Button"
          />
          <p className="admin__round">Round {roundNumber}</p>
        </div>
      </div>
      <div className="players">
        <h2 className="mainWord">{randomword}</h2>
        <div className="join">
          <span className="teamNameBlue">
            Team Blue {roundNumber % 2 === 0 ? '(E)' : '(G)'}
          </span>
          <div className="seperateBoard">
            <h4 className="admin__similar">
              Select similar words and destroy them
            </h4>
            <div className="team">
              {/* Blue Team Words */}
              <div className="eachTeam">
                {bluearr.map((word) => {
                  return (
                    <div
                      className={`word ${
                        guessingTeam === 'blue' ? 'guessingTeam' : ''
                      }`}
                    >
                      <label for={word}>{word}</label>
                      <input
                        type="checkbox"
                        name={word}
                        id={word}
                        value={word}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Red Team words*/}
              <div className="eachTeam">
                {redarr.map((word) => {
                  return (
                    <div
                      className={`word ${
                        guessingTeam === 'red' ? 'guessingTeam' : ''
                      }`}
                    >
                      <label for={word}>{word}</label>
                      <input
                        type="checkbox"
                        name={word}
                        id={word}
                        value={word}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="destroyButton" onClick={() => destroyWords()}>
              <img src={destroyButton} alt="" />
            </div>
          </div>
          <span className="teamNameRed">
            Team Red {roundNumber % 2 !== 0 ? '(E)' : '(G)'}
          </span>
        </div>
      </div>
      <button className="admin__destroy" onClick={sendClues}>
        Proceed
      </button>
    </section>
  );
};

export default AdminDestroy;
