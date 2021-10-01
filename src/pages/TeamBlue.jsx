// Team blue. Players will enter their hinst here
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import ImageButton from '../components/ImageButton';
import ImageInput from '../components/ImageInput';
import Clock from '../images/clock.svg';
import '../css/teamblue.css';
import ModalComponent from '../components/Modal';
import { useLocation } from 'react-router';
import { Button, Modal } from 'react-bootstrap';
import blue_team_lost from '../images/Popover/blue/blue_team_lost.webp';
import blue_team_win from '../images/Popover/blue/blue_team_win.webp';
const axios = require('axios');

function TeamBlue({ socket }) {
  const [hint, setHint] = useState('');
  const [roundfromBackend, setRoundFromBackend] = useState(1);
  // const [chatmsgSent, setchatmsgSent] = useState(0);
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
  const [guesserName, setGuesserName] = useState({});
  const [guessedWord, setGuessedWord] = useState('"..."');
  const location = useLocation();
  const [guesserTeam, setGuesserTeam] = useState('');
  const [enemyTeam, setEnemyTeam] = useState('');
  const [show, setShow] = useState(false);
  const [clue, setClue] = useState(0);
  const handleClose = () => setShow(false);
  //  new team names given by the host
  const [newredname, setNewredname] = useState('');
  const [newbluename, setNewbluename] = useState('');
  const [hintList, setHintList] = useState([]);
  const [scoreChange, setScoreChange] = useState(0);

  // getting new team name given by the host
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/newteamnames`,
    })
      .then((res) => {
        setNewbluename(res.data.newblueteamname);
        setNewredname(res.data.newredteamname);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setClue(location.state.clueGiven);
    console.log('clueeeee ', location.state.clueGiven);

    socket.on('score-change', (score) => {
      setScoreChange(score);
    });
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

  // getting the  random word
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
        console.log('<<< guesser name >>>', res.data.guesserNameBlue);
        console.log('<<< guesser name >>>', res.data.guesserNameRed);
        setGuesserName(res.data);

        // blue guesser
        if (
          roundfromBackend % 2 !==
          0
          // res.data.guesserName.guesserNameBlue !== ''
        ) {
          setGuesserTeam('Blue Spartans');
          setEnemyTeam('Red Gladiators');
          // setGuesserName(res.data);
        }

        // red guesser
        if (
          roundfromBackend % 2 ===
          0
          // res.data.guesserName.guesserNameRed !== ''
        ) {
          setGuesserTeam('Red Gladiators');
          setEnemyTeam('Blue Spartans');
        }
        // setGuesserName(res.data);
      })
      .catch((err) => console.error(err));
  });

  useEffect(() => {
    //  getting approved hint list from admkin
    socket.on('hintList', (list) => {
      setHintList(list);
    });
  });

  // setting the round number
  socket.on('current-round', (round) => {
    setRoundFromBackend(round);
  });

  //  end game button
  useEffect(() => {
    // socket.on('gusserHints', (arr) => {
    //   setHintList(arr);
    // });

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
      setChance(`Commander guessed wrong, Now ${2 - wrong} chance(s) left...`);
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
      socket.emit('msgListMake', { hint, room: 'Team Blue' });
      document.querySelector('.blue__input').value = '';
      history.push({
        pathname: '/blue/animation',
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
          console.log('guesserID from backend: ', res.data);
          if (socket.id === res.data) {
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
    if (guesserId == socket.id) {
      if (socket.id === guesserId) {
        history.push({
          pathname: `/blue/guess`,
          state: {
            gusserid: guesserId,
          },
        });
      }
    }
    setShow(false);
  }

  return (
    <div className="blue__bg">
      {!clue ? (
        <div>
          {roundfromBackend % 2 === 0 ? (
            <div>
              <ModalComponent
                content={`Our enemies, the ${newredname} are trapped, and
                are sending coded location via a secret 
                message to their Commander in Chief ‘${guesserName.guesserNameRed}’.
                We, the ‘${newbluename}’ have to stop them.
                `}
                buttonTitle="TeamRed"
                heading={roundfromBackend}
              />
            </div>
          ) : (
            <div>
              <ModalComponent
                content={`You, the ‘${newbluename}’ are trapped, and have 
                to send your coded location via a secret 
                message to your Commander in Chief ‘${guesserName.guesserNameBlue}’.
                ‘${newredname}’ are your enemies, and 
                they are trying their best to stop you.`}
                buttonTitle="TeamRed"
                heading={roundfromBackend}
              />
            </div>
          )}
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
        <Modal.Body>
          <div style={{ color: 'blue', fontSize: '28px' }}>{newbluename}</div>
          <h5>
            {roundfromBackend % 2 !== 0 ? (
              <div>
                {' '}
                {scoreChange > 0 ? (
                  <div>
                    <img height="280px" src={blue_team_win} alt="" />
                    <br />
                    Congratulations! Your commander in chief has successfully
                    located your team and rescued you. You, the ‘{newbluename}’
                    score {scoreChange} victory points.
                  </div>
                ) : (
                  <div>
                    <img src={blue_team_lost} alt="" />
                    <br />
                    Sorry! Your commander was unable to identity the secret
                    word, and hence wasn’t able to locate you!
                  </div>
                )}
              </div>
            ) : (
              <div>
                {' '}
                {scoreChange > 0 ? (
                  <div>
                    <img src={blue_team_lost} alt="" />
                    <br />
                    The commander-in-chief of ‘{newredname}’ was able to guess
                    the secret location successfully and free their soldiers.
                    Your team loses this round and {newredname} score
                    {scoreChange} victory points.
                  </div>
                ) : (
                  <div>
                    <img height="280px" src={blue_team_win} alt="" />
                    <br />
                    Congratulations! The commander in chief of ‘{newredname}’
                    was not able to identify the secret word. Your team ‘
                    {newbluename}’ wins the round.
                  </div>
                )}
              </div>
            )}
          </h5>
          <div>
            <ImageButton
              value="Proceed"
              classlist="blue__enterbtn"
              clickMe={changeScreen}
            />
          </div>
        </Modal.Body>
      </Modal>
      {!clue ? (
        <div className="blue__enterhint text-center">
          <h5>{chance}</h5>
          <h1>
            Hello Soldier,
            <br />
            The secret word is&nbsp;
            <span className="blue__randomword" style={{ color: '#844719' }}>
              "{randomword}"
            </span>
          </h1>
          <br />
          <h3>
            {roundfromBackend % 2 !== 0 ? (
              <p>
                Type your one word clue similar to
                <br />
                the secret word to help your commander ‘
                <span style={{ color: 'blue' }}>
                  {guesserName.guesserNameBlue}
                </span>
                ’ locate you.
              </p>
            ) : (
              <p>
                {' '}
                Type your one word clue similar to the secret word to stop{' '}
                <br />
                <span style={{ color: 'red' }}>
                  {guesserName.guesserNameRed}
                </span>
              </p>
            )}
          </h3>

          {usermsgsent ? (
            <div>Clue submitted</div>
          ) : (
            <div>
              <h6 style={{ color: 'red' }}>{wordError}</h6>
              <ImageInput
                text="Type your clue here..."
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
      ) : (
        <div className="blue__wait text-center">
          <h1>
            Secret Word:&nbsp;
            <span className="red__randomword" style={{ color: '#9b5825' }}>
              "{randomword}"{' '}
            </span>
          </h1>
          {roundfromBackend % 2 === 0 ? (
            <>
              <h3>
                {roundfromBackend % 2 === 0 ? (
                  <h3>
                    {' '}
                    Clues that reached the Commander in chief of "
                    {guesserName.guesserNameRed}"
                  </h3>
                ) : (
                  <h3>
                    {' '}
                    Clues that reached the Commander in chief of "
                    {guesserName.guesserNameBlue}"
                  </h3>
                )}
              </h3>
              <div>
                {hintList.map((item, i) => (
                  <h3 key={i}>{item}</h3>
                ))}
              </div>
              <h4>{chance}</h4>
            </>
          ) : (
            <>
              {roundfromBackend % 2 !== 0 ? (
                <h3>
                  These are the Clues that reached your Commander in Chief "
                  {guesserName.guesserNameRed} ":
                </h3>
              ) : (
                <h3>
                  These are the Clues that reached their Commander in
                  Chief&nbsp;"
                  {guesserName.guesserNameBlue} ":
                </h3>
              )}
              <div>
                {hintList.map((e) => (
                  <h3 key={e.toString()}>{e}</h3>
                ))}
              </div>
              <h4>{chance}</h4>
            </>
          )}
        </div>
      )}
      <div className="blue__timer d-flex align-items-baseline">
        <img src={Clock} alt="time" />
        <h3>
          <span id="Timer">
            {min}:{sec}
          </span>
        </h3>
      </div>
      <div className="blue__rank">
        <div className="blue__blue d-flex justify-content-between px-3 bg">
          <h3 className="my-auto mx-auto" style={{ color: 'white' }}>
            {newbluename}: &nbsp;{' '}
            <span style={{ color: 'white' }}>{blueTeamScore}</span>
          </h3>
        </div>
        <div className="blue__red d-flex justify-content-between px-3">
          <h3 className="my-auto mx-auto" style={{ color: '#9b5825' }}>
            {newredname}: &nbsp;{' '}
            <span style={{ color: '#ffffff' }}>{redTeamScore}</span>
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
}

export default TeamBlue;
