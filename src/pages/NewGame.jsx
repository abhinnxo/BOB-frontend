import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Nav } from 'react-bootstrap';
import ImageButton from '../components/ImageButton';
import ImageInput from '../components/ImageInput';
import '../css/newgame.css';
import axios from 'axios';
var customId = require('custom-id');

const NewGame = ({ socket }) => {
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [sameUsername, setSameUsername] = useState(false);
  const [roomid, setRoomid] = useState('');

  const history = useHistory();

  // username/password check
  useEffect(() => {
    console.log('username', username);
  }, [username]);
  useEffect(() => {
    console.log('password', password);
  }, [password]);

  // get usernames for comparing
  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_LOCALHOST}/usernames`,
    }).then((res) => {
      console.log(res.data);
      setUsernames(res.data);
    });
  }, []);

  // change cards for host/player, for joining or creating a new room
  const join = () => {
    document.querySelector('#join').classList.add('d-block');
    document.querySelector('#join').classList.remove('d-none');
    document.querySelector('#host').classList.add('d-none');
    document.querySelector('#host').classList.remove('d-blobk');
  };
  const host = () => {
    document.querySelector('#join').classList.add('d-none');
    document.querySelector('#join').classList.remove('d-block');
    document.querySelector('#host').classList.add('d-block');
    document.querySelector('#host').classList.remove('d-none');
  };

  // set NickName in the localstorage
  useEffect(() => {
    localStorage.setItem('nickname', nickname);
  }, [nickname]);

  // On Click the Join Room Button
  const joinroom = () => {
    // checking for duplicate username
    usernames.forEach((e) => {
      console.log(e);
      if (e === username) setSameUsername(true);
    });
    if (roomid === '') {
      alert('Enter Game Code');
    } else if (nickname === '') {
      alert('Enter Nickrname');
    } else if (sameUsername) {
      alert(
        'A Player with same Nickname has already joined, try a different one...'
      );
    } else {
      axios({
        method: 'get',
        url: `${process.env.REACT_APP_LOCALHOST}/code`,
      })
        .then((res) => {
          console.log('axios ', res.data);
          if (roomid == res.data && res.data != 0) {
            localStorage.setItem('host', false);
            localStorage.setItem('roomid', roomid);
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
      // history.push("/lobby");
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
      <Card className="newgame__card">
        <Card.Header className="newgame__header">
          <Nav
            variant="tabs"
            defaultActiveKey="#first"
            className="newgame__header"
          >
            <Nav.Item className="newgame__header">
              <Nav.Link className="newgame__navlink" onClick={join}>
                Join
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="newgame__navlink" onClick={host}>
                Host
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        {/* JOIN */}
        <Card.Body className="newgame__body" id="join">
          <br />
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
          <ImageButton classlist="newgame__instbtn" value="INSTRUCTIONS" />
        </Card.Body>
        {/* HOST */}
        <Card.Body className="d-none newgame__body" id="host">
          <br />
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
          <ImageButton classlist="newgame__instbtn" value="INSTRUCTIONS" />
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewGame;
