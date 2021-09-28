import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import '../css/admindestroy.css';
import endGameImg from '../images/cross.png';
import destroyButton from '../images/destroy_button.svg';
import MyTimer from '../components/MyTimer';
const axios = require('axios');

const AdminDestroy = ({ socket }) => {
  const [bluearr, setBluearr] = useState([]);
  const [redarr, setRedarr] = useState([]);
  // word
  const [randomword, setRandomWord] = useState('MainWord');
  // const [round, setRound] = useState(1);
  const [roundNumber, setRoundNumber] = useState(1);
  // set array for the team
  const [guessingArr, setGuessingArr] = useState([]);
  // set guessing team
  const [guessingTeam, setGuessingTeam] = useState('blue');
  const [guesserName, setGuesserName] = useState('');
  // Proceed
  const [destroyClicked, setDestroyClicked] = useState(false);
  //  new team names given by the host
  const [bluename, setBluename] = useState('');
  const [redname, setRedname] = useState('');

  const history = useHistory();

  const time = new Date();
  time.setSeconds(time.getSeconds() + 90);

  useEffect(() => {
    if (roundNumber % 2 === 0) {
      setGuessingTeam('red');
    } else {
      setGuessingTeam('blue');
    }
  }, [roundNumber]);

  // getting the guesser name
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/guesserName`,
    })
      .then((res) => {
        // blue gyesser
        if (roundNumber % 2 !== 0 && res.data.guesserNameBlue !== '')
          setGuesserName(res.data);

        // red guesser
        if (roundNumber % 2 === 0 && res.data.guesserNameRed !== '')
          setGuesserName(res.data);
      })
      .catch((err) => console.error(err));
  });

  useEffect(() => {
    // getting the random word
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/randomword`,
    })
      .then((res) => {
        setRandomWord(res.data);
      })
      .catch((err) => console.error(err));

    // getting the round number
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/roundNo`,
    })
      .then((res) => {
        setRoundNumber(res.data.round);
      })
      .catch((err) => console.error(err));
  }, []);

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

  //  On clicking proceed button
  useEffect(() => {
    socket.on('Team-BlueWordList', (bluearr) => {
      setBluearr(bluearr);
      console.log(bluearr);
    });

    socket.on('Team-RedWordList', (redarr) => {
      setRedarr(redarr);
      console.log(redarr);
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

  //remove enemy team checkboxes
  const destroyWords = () => {
    setDestroyClicked(true);

    let allWords = document.querySelectorAll('.guessingTeam input');
    allWords.forEach((word) => {
      if (!word.checked) {
        setGuessingArr([...guessingArr, word.value]);
        document
          .querySelector('.hidedestroyed')
          .classList.add('admindestroy__hide');
      }
    });

    // Show Info that the words have been destroyed sucessfully
    document.querySelector('.destroyButton img').style.display = 'none';
  };

  // send clues to the guesser
  const sendClues = () => {
    if (destroyClicked) {
      if (guessingArr.length === 0)
        socket.emit('showToGuesser', [
          'Alas! The enemy soldiers managed to destroy all your clues...',
        ]);
      else socket.emit('showToGuesser', guessingArr);
    } else {
      if (roundNumber % 2 === 0) socket.emit('showToGuesser', redarr);
      else socket.emit('showToGuesser', bluearr);
    }

    var value = 1;
    socket.emit('team-screen', value);

    history.push({
      pathname: '/admin/points',
      state: {
        arr: guessingArr,
      },
    });
  };

  // push people to score screen when end game is clicked
  const endGame = () => {
    if (window.confirm('Are you sure you want to end the game for everyone?')) {
      socket.emit('game-end-clicked', 0);
      localStorage.clear();
    }
  };

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
          <img
            src={endGameImg}
            className="endGame"
            onClick={endGame}
            alt="End Game Button"
          />
        </div>
      </div>
      <h4
        style={{
          fontFamily: 'PaytoneOne',
          zIndex: '100',
          position: 'absolute',
          marginTop: '7%',
        }}
      >
        {roundNumber % 2 === 0 ? (
          <span style={{ color: 'red' }}>{guesserName.guesserNameRed}</span>
        ) : (
          <span style={{ color: 'blue' }}>{guesserName.guesserNameBlue}</span>
        )}
        &nbsp;is the guesser...
      </h4>
      <div className="players">
        <h2 className="mainWord">
          <span>
            #{roundNumber}&nbsp;{randomword}
          </span>
        </h2>
        <div className="join">
          <span className="teamNameBlue">
            {bluename} {roundNumber % 2 === 0 ? '(E)' : '(G)'}
          </span>
          <div className="seperateBoard">
            <h4 className="admin__similar">
              Select similar clues and destroy them
            </h4>
            <div className="team">
              {/* Blue Team Words */}
              <div className="eachTeam">
                {bluearr.map((word) => {
                  return (
                    <div
                      className={`word hidedestroyed ${
                        guessingTeam === 'blue' ? 'guessingTeam' : ''
                      }`}
                    >
                      <label className="hidedestroyed" for={word}>
                        {word}
                      </label>
                      {roundNumber % 2 !== 0 && (
                        <input
                          type="checkbox"
                          name={word}
                          id={word}
                          value={word}
                          className="hidedestroyed"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Red Team words*/}
              <div className="eachTeam">
                {redarr.map((word) => {
                  return (
                    <div
                      className={`word hidedestroyed ${
                        guessingTeam === 'red' ? 'guessingTeam' : ''
                      }`}
                    >
                      <label className="hidedestroyed" for={word}>
                        {word}
                      </label>
                      {roundNumber % 2 === 0 && (
                        <input
                          type="checkbox"
                          name={word}
                          id={word}
                          value={word}
                          className="hidedestroyed"
                        />
                      )}
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
            {redname} {roundNumber % 2 !== 0 ? '(E)' : '(G)'}
          </span>
        </div>
      </div>
      <div>
        <button className="admin__destroy" onClick={sendClues}>
          Proceed
        </button>
      </div>
    </section>
  );
};

export default AdminDestroy;
