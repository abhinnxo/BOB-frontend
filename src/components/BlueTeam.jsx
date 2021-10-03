import React, { useState, useEffect } from 'react';
import BlueBlock from '../images/blueblock.webp';
import './css/blueteam.css';
import axios from 'axios';

const BlueTeam = ({ playerListBlue, hostId, socket }) => {
  const [teamName, setTeamName] = useState('Team  Red');
  const [newTeamName, setNewTeamName] = useState('Team Red');

  // // getting new team name given by the host
  // useEffect(() => {
  //   axios({
  //     method: 'get',
  //     url: `https://bob-backend-madiee-h.herokuapp.com/newteamnames`,
  //   })
  //     .then((res) => {
  //       setNewTeamName(res.data.newblueteamname);
  //     })
  //     .catch((err) => console.error(err));
  // });

  // emit changing team name
  useEffect(() => {
    // if (teamName === '') socket.emit('teambluename', 'Team Red');
    // else
    socket.emit('teambluename', teamName);
  }, [teamName]);

  useEffect(() => {
    socket.on('newTeamRedName', (name) => {
      setNewTeamName(name);
    });
  });

  return (
    <div>
      <div className="blueblock">
        <img src={BlueBlock} alt="Team Blue" className="blueblock__block" />
        {hostId === socket.id ? (
          <input
            type="text"
            name="teambluename"
            id="teambluename"
            value={teamName}
            placeholder="Team Red"
            maxLength="12"
            onChange={(e) => setTeamName(e.target.value)}
          />
        ) : (
          <h5 className="blueblock__teamname">{newTeamName}</h5>
        )}
        <div className="blueblock__playerlist">
          <ul className="blueblock__ul">
            {hostId === socket.id ? (
              <>
                <li>&nbsp;</li> <li>&nbsp;</li>
              </>
            ) : (
              <></>
            )}
            {playerListBlue.map((name, key) => {
              return <li key={key}>{name}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlueTeam;
