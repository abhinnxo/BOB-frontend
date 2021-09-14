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
import ScorePresent from './pages/ScorePresent';
// import Admin from "./pages/Admin";
import AdminDestroy from './pages/AdminDestroy';
import HostWaitingLobby from './pages/HostWaitingLobby';
import io from 'socket.io-client';
import PageNotFound from './components/PageNotFound';

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://bob-backend-madiee-h.herokuapp.com/');
    console.log(newSocket);
    newSocket.on('confirmation', function (message) {
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
        path="/admin/lobby"
        render={(props) => <HostWaitingLobby {...props} socket={socket} />}
      />
      {/* <Route
        exact
        path="/admin"
        render={(props) => <Admin {...props} socket={socket} />}
      /> */}

      <Route
        exact
        path="/score-card"
        render={(props) => <ScorePresent {...props} socket={socket} />}
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
        path="/gameend"
        render={(props) => <GameEnd {...props} socket={socket} />}
      />
      {/* <Route exact path='*' component={PageNotFound} /> */}
    </BrowserRouter>
  );
}

export default App;
