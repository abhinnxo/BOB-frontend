import React, { useState, useEffect } from 'react';
import RedBlock from '../images/redblock.webp';
import './css/redteam.css';

const RedTeam = ({ playerList, hostId, socket }) => {
  const [teamName, setTeamName] = useState('Team  Blue');
  const [newTeamName, setNewTeamName] = useState('Team Blue');

  // emit changing team name
  useEffect(() => {
    if (teamName === '') socket.emit('teamedname', 'Team Blue');
    else socket.emit('teamredname', teamName);
  }, [teamName]);

  useEffect(() => {
    socket.on('newTeamRedName', (name) => {
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
