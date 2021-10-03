import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import '../css/admindestroy.css';
const axios = require('axios');

function Animation({ socket }) {
  const [randomword, setRandomWord] = useState('"..."');
  const [bluearr, setBluearr] = useState([]);
  const [redarr, setRedarr] = useState([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [guessingTeam, setGuessingTeam] = useState('blue');
  //  new team names given by the host
  const [bluename, setBluename] = useState('');
  const [redname, setRedname] = useState('');

  const history = useHistory();

  // get the Word
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bobbackend.games.madiee.com/randomword`,
    })
      .then((res) => {
        setRandomWord(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // getting the round number
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bobbackend.games.madiee.com/roundNo`,
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
      url: `https://bobbackend.games.madiee.com/newteamnames`,
    })
      .then((res) => {
        setBluename(res.data.newblueteamname);
        setRedname(res.data.newredteamname);
      })
      .catch((err) => console.error(err));
  }, []);

  //  Routing
  useEffect(() => {
    socket.on('show-previous-screen', (value) => {
      let teamName = localStorage.getItem('team');
      console.log('value from backend:', value);
      if (
        value &&
        window.location.href !==
          'https://battleofbrains.netlify.app/red/guess' &&
        window.location.href !== 'https://battleofbrains.netlify.app/blue/guess'
      ) {
        history.push({
          pathname: `/${teamName}`,
          state: {
            clueGiven: 1,
          },
        });
      }
    });
  });

  useEffect(() => {
    socket.on('Team-BlueWordList', (bluearr) => {
      setBluearr(bluearr);
    });

    socket.on('Team-RedWordList', (redarr) => {
      setRedarr(redarr);
    });
  }, [socket]);

  // when game is ended route everyone to main screen
  socket.on('game-ended', (gameValue) => {
    localStorage.clear();
    if (gameValue === 1) {
      history.push('/endgame');
    }
  });

  return (
    <div style={{ marginTop: '20%' }}>
      <section className="hostWaitingLobby">
        <div className="admindestroy__bg"></div>
        <div className="timer__round"></div>
        <div className="players">
          <h2 className="mainWord">
            #{roundNumber}&nbsp;{randomword}
          </h2>
          <div className="join">
            <span className="teamNameBlue">
              {bluename} {roundNumber % 2 === 0 ? '(E)' : '(G)'}
            </span>
            <div className="seperateBoard">
              {roundNumber % 2 !== 0 ? (
                <h3 className="admin__similar">
                  ‘Helping Clues’
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  ‘Stopping Clues’
                </h3>
              ) : (
                <h3 className="admin__similar">
                  ‘Stopping Clues’
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  ‘Helping Clues’
                </h3>
              )}

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
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <span className="teamNameRed">
              {redname} {roundNumber % 2 !== 0 ? '(E)' : '(G)'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Animation;
