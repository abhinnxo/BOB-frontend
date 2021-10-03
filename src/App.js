import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import NewGame from './pages/NewGame';
import WaitingLobby from './pages/WaitingLobby';
import Gusser from './pages/Gusser';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import TeamRed from './pages/TeamRed';
import TeamBlue from './pages/TeamBlue';
import GameEnd from './pages/GameEnd';
import AdminPoints from './pages/AdminPoints';
// import Admin from "./pages/Admin";
import AdminDestroy from './pages/AdminDestroy';
import io from 'socket.io-client';
import Animation from '../src/pages/Animation';
import Instructions from '../src/pages/Instructions';

function App() {
  const [socket, setSocket] = useState(null);

  // Prompt when the user tries to close/leave the tab
  window.onbeforeunload = (event) => {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();
    if (e) {
      e.returnValue =
        "Leaving this Page will kill all of your game progress and you can't rejoin."; // Legacy method for cross browser support
    }
    return ''; // Legacy method for cross browser support
  };

  useEffect(() => {
    const newSocket = io('https://bobbackend.games.madiee.com');
    console.log(newSocket);
    newSocket.on('confirmation', (message) => {
      console.log(message);
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <BrowserRouter>
      <Route
        exact
        path="/"
        render={(props) => <NewGame {...props} socket={socket} />}
      />
      <Route
        exact
        path="/lobby"
        render={(props) => <WaitingLobby {...props} socket={socket} />}
      />
      <Route
        exact
        path="/admin/destroy"
        render={(props) => <AdminDestroy {...props} socket={socket} />}
      />
      <Route
        exact
        path="/admin/points"
        render={(props) => <AdminPoints {...props} socket={socket} />}
      />
      <Route
        exact
        path="/red"
        render={(props) => <TeamRed {...props} socket={socket} />}
      />
      <Route
        exact
        path="/red/guess"
        render={(props) => <Gusser {...props} socket={socket} />}
      />
      <Route
        exact
        path="/blue"
        render={(props) => <TeamBlue {...props} socket={socket} />}
      />
      <Route
        exact
        path="/blue/guess"
        render={(props) => <Gusser {...props} socket={socket} />}
      />
      <Route
        exact
        path="/endgame"
        render={(props) => <GameEnd {...props} socket={socket} />}
      />
      <Route
        exact
        path="/red/animation"
        render={(props) => <Animation {...props} socket={socket} />}
      />
      <Route
        exact
        path="/blue/animation"
        render={(props) => <Animation {...props} socket={socket} />}
      />
      <Route
        exact
        path="/instructions"
        render={(props) => <Instructions {...props} socket={socket} />}
      />
    </BrowserRouter>
  );
}

export default App;
