import React, { useEffect, useState } from 'react';
import '../css/waitinglobby.css';
import CopyCode from '../images/copy.svg';
import RedTeam from '../components/RedTeam';
import BlueTeam from '../components/BlueTeam';
import ImageButton from '../components/ImageButton';
import { useHistory, useLocation } from 'react-router-dom';

const axios = require('axios');

const WaitingLobby = ({ socket }) => {
  const [username, setUsername] = useState('');
  const [team, setTeam] = useState('');
  // comming from server
  const [blueplayerlist, setBluePlayerList] = useState([]);
  const [redplayerlist, setRedPlayerList] = useState([]);
  // Guesser id available to gusser only
  const [guesser, setGuesser] = useState('');
  const [code, setCode] = useState('...');

  const location = useLocation();
  const roomid = localStorage.getItem('roomid');

  // fill teams with existing players
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.comlobby`,
    })
      .then((res) => {
        console.log('axios ', res.data);
        setRedPlayerList(res.data.teamredplayer);
        setBluePlayerList(res.data.teamblueplayer);
      })
      .catch((err) => console.error(err));
  }, []);

  // Hide Join Button for Host
  useEffect(() => {
    if (location.state.hostId) {
      document.querySelector('.lobby__redteam').style.display = 'none';
      document.querySelector('.lobby__blueteam').style.display = 'none';
    }
  }, []);

  useEffect(() => {
    setCode(roomid);
  }, []);
  useEffect(() => {
    setUsername(localStorage.getItem('nickname').trim());
  }, []);

  useEffect(() => {
    socket.emit('hostId', location.state.hostId);
    console.log('Host: ', location.state.hostId);
  }, []);

  //  Team red Players
  socket.on('teamredplayernames', function (message) {
    setRedPlayerList(message);
  });
  //  Team blue Players
  socket.on('teamblueplayernames', function (message) {
    setBluePlayerList(message);
  });

  const history = useHistory();
  var count = 0;

  // Start Game when event is emitted
  socket.on('startGameForAll', function (value) {
    socket.emit('timer-start', count);
    if (value) {
      console.log('startGameForAll', value);
      if (socket.id === location.state.hostId) {
        history.push('/admin/destroy');
      } else if (socket.id === guesser) {
        history.push({
          pathname: `/${team}/guess`,
          state: {
            gusserid: guesser,
          },
        });
      } else
        history.push({
          pathname: `/${team}`,
          state: {
            clueGiven: 0,
          },
        });
    }
  });

  useEffect(() => {
    socket.on('guesser', (id) => {
      setGuesser(id);
    });
  });

  // On clicking start button
  const startgame = () => {
    socket.emit('hostStartedGame', true);
  };
  // copy game code
  const copyGameCode = () => {
    navigator.clipboard.writeText(localStorage.getItem('roomid'));
    document.querySelector('.lobby__code').innerHTML = 'copied';
    setTimeout(() => {
      document.querySelector('.lobby__code').innerHTML = `${code}
            <img src=${CopyCode} alt="copy code" />`;
    }, 1000);
  };

  function teamselection(e) {
    if (e === 'red') {
      setTeam('red');
      localStorage.setItem('team', 'red');
      document.querySelector('.lobby__redteam').style.display = 'none';
      document.querySelector('.lobby__blueteam').style.display = 'none';
      socket.emit('joinRoom', { username, room: 'Team Red' });
    }
    if (e === 'blue') {
      setTeam('blue');
      localStorage.setItem('team', 'blue');
      document.querySelector('.lobby__redteam').style.display = 'none';
      document.querySelector('.lobby__blueteam').style.display = 'none';
      socket.emit('joinRoom', { username, room: 'Team Blue' });
    }
  }

  function GenerateCode() {
    socket.emit('Game-Code', roomid);
    localStorage.setItem('GameCode', code);
  }

  return (
    <div className="lobby">
      <div className="lobby__bg"></div>
      <div className="lobby__teamtable">
        <div className="lobby__codediv" onClick={GenerateCode}>
          <div className="lobby__code" onClick={copyGameCode}>
            {code} &nbsp;
            <img src={CopyCode} alt="copy code" />
          </div>
        </div>
        <div className="d-flex lobby__teamcontainer">
          {/* Red Box */}
          <RedTeam playerList={redplayerlist} />
          <input
            type="button"
            name="button"
            className="lobby__blueteam"
            onClick={() => {
              teamselection('blue');
            }}
          />
          {/* Blue Box */}
          <BlueTeam playerListBlue={blueplayerlist} />
          <input
            type="button"
            name="button"
            className="lobby__redteam"
            onClick={() => {
              teamselection('red');
            }}
          />
        </div>
        {/* Start Button */}
        {location.state.xyz > 0 ? (
          <div>
            <ImageButton
              clickMe={startgame}
              classlist="lobby__startbtn mx-auto"
              value="START"
            />
          </div>
        ) : (
          <h3 className="lobby__playermsg">
            Waiting for the host to start the game...
          </h3>
        )}
      </div>
    </div>
  );
};

export default WaitingLobby;
