import React, { useEffect, useState } from 'react';
import '../css/waitinglobby.css';
import BackButton from '../images/back_button.svg';
import RedTeam from '../components/RedTeam';
import BlueTeam from '../components/BlueTeam';
import ImageButton from '../components/ImageButton';
import { useHistory, useLocation } from 'react-router-dom';

const axios = require('axios');

const WaitingLobby = ({ socket }) => {
  const [username, setUsername] = useState('');
  const [team, setTeam] = useState('');
  // Current Player name
  const [redPlayer, setRedPlayer] = useState('');
  const [bluePlayer, setBluePlayer] = useState('');
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
      url: `${process.env.REACT_APP_LOCALHOST}/lobby`,
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
      } else history.push(`/${team}`);
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
  const copyGameCode = () => {
    navigator.clipboard.writeText(localStorage.getItem('roomid'));
  };

  function teamselection(e) {
    if (e === 'red') {
      setTeam('red');
      localStorage.setItem('team', 'red');
      setRedPlayer(localStorage.getItem('nickname'));
      document.querySelector('.lobby__redteam').style.display = 'none';
      document.querySelector('.lobby__blueteam').style.display = 'none';
      socket.emit('joinRoom', { username, room: 'Team Red' });
    }
    if (e === 'blue') {
      setTeam('blue');
      localStorage.setItem('team', 'blue');
      setBluePlayer(localStorage.getItem('nickname'));
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
            {code}
          </div>
        </div>
        <div className="d-flex">
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
            {' '}
            <ImageButton
              clickMe={startgame}
              classlist="lobby__startbtn mx-auto"
              value="START"
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default WaitingLobby;
