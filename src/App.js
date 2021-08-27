import React, { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import NewGame from "./pages/NewGame";
import WaitingLobby from "./pages/WaitingLobby";
import Gusser from "./pages/Gusser";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import TeamRed from "./pages/TeamRed";
import TeamBlue from "./pages/TeamBlue";
import GameEnd from "./pages/GameEnd";
import AdminPoints from "./pages/AdminPoints";
import Admin from "./pages/Admin";
<<<<<<< HEAD
import HostWaitingLobby from "./pages/HostWaitingLobby";
=======
import io from "socket.io-client";
>>>>>>> 236367e30b5e9149b01dd0ffb83ca047e00410e4

function App() {
  const [bg, setBg] = "";

  const [socket, setSocket] = useState(null);

  //   // Prompt when the user tries to close/leave the tab
  // window.onbeforeunload = (event) => {
  //   const e = event || window.event;
  //   // Cancel the event
  //   e.preventDefault();
  //   if (e) {
  //     e.returnValue = ""; // Legacy method for cross browser support
  //   }
  //   return ""; // Legacy method for cross browser support
  // };

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:5000`);
    newSocket.on("confirmation", function (message) {
      console.log(message);
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <BrowserRouter>
<<<<<<< HEAD
      <Route exact path="/" component={NewGame} />
      <Route exact path="/lobby" component={WaitingLobby} />
      <Route exact path="/hostlobby" component={HostWaitingLobby} />
      <Route exact path="/admin" component={Admin} />
      <Route exact path="/admin/points" component={AdminPoints} />
      <Route exact path="/red" component={TeamRed} />
      <Route exact path="/red/guess" component={Gusser} />
      <Route exact path="/blue" component={TeamBlue} />
      <Route exact path="/blue/guess" component={Gusser} />
      <Route exact path="/gameend" component={GameEnd} />
=======
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
        path="/admin"
        render={(props) => <Admin {...props} socket={socket} />}
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
>>>>>>> 236367e30b5e9149b01dd0ffb83ca047e00410e4
    </BrowserRouter>
  );
}

export default App;
