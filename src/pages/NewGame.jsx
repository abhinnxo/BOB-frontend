import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ImageButton from '../components/ImageButton';
import ImageInput from '../components/ImageInput';
import '../css/newgame.css';
import axios from 'axios';
var customId = require('custom-id');

const NewGame = ({ socket }) => {
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [playersInLobby, setPlayersInLobby] = useState([]);
  // const [sameNickname, setSameNickname] = useState(false);
  let sameNickname = false;
  const [roomid, setRoomid] = useState('');

  const history = useHistory();

  // username/password check
  useEffect(() => {
    console.log('username', username);
  }, [username]);
  useEffect(() => {
    console.log('password', password);
  }, [password]);
  useEffect(() => {
    console.log('nickname', nickname);
  }, [nickname]);
  useEffect(() => {
    console.log('roomid', roomid);
  }, [roomid]);

  //  Get Nanmes of Joined Players
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/usernames`,
    })
      .then((res) => {
        setPlayersInLobby(res.data);
      })
      .catch((err) => console.error(err));
  });

  // check for duplicate usernames
  useEffect(() => {
    playersInLobby.forEach((name) => {
      if (name === nickname) {
        sameNickname = true;
      }
    });
  }, [playersInLobby]);

  // change cards for host/player, for joining or creating a new room
  const join = () => {
    document.querySelector('#join').classList.add('d-block');
    document.querySelector('#join').classList.remove('d-none');
    document.querySelector('#joinbtn').style.backgroundColor = '#9b5825';
    document.querySelector('#host').classList.add('d-none');
    document.querySelector('#host').classList.remove('d-blobk');
    document.querySelector('#hostbtn').style.backgroundColor = '#c6905b';
  };
  const host = () => {
    document.querySelector('#join').classList.add('d-none');
    document.querySelector('#join').classList.remove('d-block');
    document.querySelector('#joinbtn').style.backgroundColor = '#c6905b';
    document.querySelector('#host').classList.add('d-block');
    document.querySelector('#host').classList.remove('d-none');
    document.querySelector('#hostbtn').style.backgroundColor = '#9b5825';
  };

  // set NickName in the localstorage
  useEffect(() => {
    localStorage.setItem('nickname', nickname);
  }, [nickname]);

  // On Click the Join Room Button
  const joinroom = () => {
    if (roomid === '') {
      alert('Enter Game Code');
    } else if (nickname === '') {
      alert('Enter Nickrname');
    } else if (nickname.length > 8) {
      alert("Nickname can't be more then 8 characters");
    } else if (sameNickname) {
      sameNickname = false;
      alert('A Player with same Nick has already joined...');
    } else {
      axios({
        method: 'get',
        url: `https://bob-backend-madiee-h.herokuapp.com/code`,
      })
        .then((res) => {
          console.log('axios ', res.data);
          if (roomid == res.data && res.data != 0) {
            localStorage.setItem('host', false);
            localStorage.setItem('roomid', roomid);
            socket.emit('joining-players-to-backend', nickname.trim());
            history.push({
              pathname: '/lobby',
              state: {
                xyz: 0,
              },
            });
          } else {
            alert('Enter Correct Room Code');
          }
        })
        .catch((err) => console.error(err));
    }
  };
  // On Click the Host Room Button
  const hostroom = () => {
    console.log('uname ' + username + ' pass ' + password);

    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('host', true);
      localStorage.setItem('roomid', customId({}));
      history.push({
        pathname: '/lobby',
        state: {
          xyz: 1,
          hostId: socket.id,
        },
      });
    } else {
      alert('Username / Password is wrong');
    }
  };

  return (
    <div className="newgame__div">
      <div className="newgame__bg"></div>
      <div className="newgame__box">
        <div className="newgame__linkbtn">
          <button id="joinbtn" onClick={join}>
            JOIN
          </button>
          <button id="hostbtn" onClick={host}>
            HOST
          </button>
        </div>
        <div className="newgame__join" id="join">
          <br /> <br />
          <ImageInput
            change={(e) => setNickname(e.target.value)}
            text="Enter Nickname"
          />
          <br />
          <ImageInput
            change={(e) => setRoomid(e.target.value)}
            text="Enter Room Code"
          />
          <br />
          <ImageButton
            clickMe={joinroom}
            classlist="newgame__joinbtn"
            value="JOIN"
          />
        </div>
        <div className="newgame__host" id="host">
          <br /> <br />
          <ImageInput
            change={(e) => setUsername(e.target.value)}
            text="Enter Username"
          />
          <br />
          <input
            type="Password"
            placeholder="Enter Password"
            style={{
              fontFamily: 'PaytoneOne',
              width: '29.1rem',
              height: '3.75rem',
              padding: ' 5px 50px',
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <ImageButton
            clickMe={hostroom}
            classlist="newgame__hostbtn"
            value="LOGIN"
          />
        </div>
      </div>
    </div>
  );
};

export default NewGame;
