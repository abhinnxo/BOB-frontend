import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import '../css/admindestroy.css';
const axios = require('axios');

function Animation({ socket }) {
  const history = useHistory();

  const [team, setTeam] = useState('');
  const [randomword, setRandomWord] = useState('MainWord');
  const [bluearr, setBluearr] = useState([]);
  const [redarr, setRedarr] = useState([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [guessingTeam, setGuessingTeam] = useState('blue');

  var v = 0;

  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/randomword`,
    })
      .then((res) => {
        console.log('axios ', res.data);
        setRandomWord(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    socket.on('show-previous-screen', (value) => {
      let teamName = localStorage.getItem('team');
      console.log('value from backend:', value);
      if (value) {
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
      console.log('blue word array', bluearr);
      setBluearr(bluearr);
    });

    socket.on('Team-RedWordList', (redarr) => {
      setRedarr(redarr);
      console.log(('red word array', redarr));
    });
  }, [socket]);

  return (
    <div style={{ marginTop: '20%' }}>
      <section className="hostWaitingLobby">
        <div className="admindestroy__bg"></div>
        <div className="timer__round"></div>
        <div className="players">
          <h2 className="mainWord">{randomword}</h2>
          <div className="join">
            <span className="teamNameBlue">
              Team Blue {roundNumber % 2 === 0 ? '(E)' : '(G)'}
            </span>
            <div className="seperateBoard">
              <h4>Select the simmilar words and destroy them</h4>
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
              Team Red {roundNumber % 2 !== 0 ? '(E)' : '(G)'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Animation;
