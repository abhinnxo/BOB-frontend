import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import ImageButton from '../components/ImageButton';
import axios from 'axios';
import '../css/gameend.css';

const GameEnd = () => {
  const [redTeamScore, setRedTeamScore] = useState(0);
  const [blueTeamScore, setBlueTeamScore] = useState(0);
  const [winningStatus, setWiningStatus] = useState('');
  //  new team names given by the host
  const [bluename, setBluename] = useState('');
  const [redname, setRedname] = useState('');
  const history = useHistory();

  // getting the score
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/score`,
    })
      .then((res) => {
        console.log('score from backend: ', res.data);

        setRedTeamScore(res.data[0].TeamScore);
        setBlueTeamScore(res.data[1].TeamScore);
      })
      .catch((err) => console.error(err));
  });

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

  // show winning status
  useEffect(() => {
    if (redTeamScore > blueTeamScore) setWiningStatus(`${redname} Wins`);
    if (blueTeamScore > redTeamScore) setWiningStatus(`${bluename} Wins`);
    if (redTeamScore === blueTeamScore) setWiningStatus('Draw');
  }, [redTeamScore, blueTeamScore]);

  const gotoMainScreen = () => {
    history.push('/');
  };

  return (
    <div className="gameend">
      <div className="gameend__bg"></div>
      <div className="end__text text-center">
        <div>
          <h1 className="end__thanks">Thank You for playing...</h1>
          <br />
          <div>
            <h3>{winningStatus}</h3>
          </div>
        </div>
        <br />
        <div className="d-flex">
          <h3 className="end__score" style={{ color: '#9b5825' }}>
            {redname}: &nbsp;{' '}
            <span style={{ color: '#ffffff' }}>{redTeamScore}</span>
          </h3>
          <h3 className="end__score" style={{ color: '#9b5825' }}>
            {bluename}: &nbsp;{' '}
            <span style={{ color: '#ffffff' }}>{blueTeamScore}</span>
          </h3>
        </div>
        <br />
        <ImageButton
          value="Go to Main Screen"
          clickMe={gotoMainScreen}
          classlist="end__btn"
        />
      </div>
    </div>
  );
};

export default GameEnd;
