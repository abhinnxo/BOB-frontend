import React, { useState, useEffect } from 'react';
import RedBlock from '../images/redblock.webp';
import './css/redteam.css';
import axios from 'axios';

const RedTeam = ({ playerList, hostId, socket }) => {
  const [teamName, setTeamName] = useState('Team  Blue');
  const [newTeamName, setNewTeamName] = useState('Team Blue');

  // getting new team name given by the host
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://bob-backend-madiee-h.herokuapp.com/newteamnames`,
    })
      .then((res) => {
        setNewTeamName(res.data.newredteamname);
      })
      .catch((err) => console.error(err));
  });

  // emit changing team name
  useEffect(() => {
    socket.emit('teamredname', teamName);
  }, [teamName]);

  useEffect(() => {
    socket.on('newTeamBlueName', (name) => {
      setNewTeamName(name);
    });
  });

  return (
    <div>
      <div className="redblock">
        <img src={RedBlock} alt="Team Red" className="redblock__block" />
        {hostId === socket.id ? (
          <input
            type="text"
            name="teambluename"
            id="teamredname"
            value={teamName}
            placeholder="Team Blue"
            maxLength="12"
            onChange={(e) => setTeamName(e.target.value)}
          />
        ) : (
          <h5 className="redblock__teamname">{newTeamName}</h5>
        )}
        <div className="redblock__playerlist">
          <ul className="redblock__ul">
            {hostId === socket.id ? (
              <>
                <li>&nbsp;</li> <li>&nbsp;</li>
              </>
            ) : (
              <></>
            )}
            {playerList.map((name, key) => {
              return <li key={key}>{name}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RedTeam;
