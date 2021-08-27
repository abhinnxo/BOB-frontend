import React, {useState} from "react"
import { BrowserRouter, Route } from "react-router-dom";
import NewGame from "./pages/NewGame";
import WaitingLobby from "./pages/WaitingLobby"
import Gusser from "./pages/Gusser";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import TeamRed from "./pages/TeamRed";
import TeamBlue from "./pages/TeamBlue";
import GameEnd from "./pages/GameEnd";
import AdminPoints from "./pages/AdminPoints";
import Admin from "./pages/Admin";

function App() {
  const [bg, setBg] = ("")

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
  return (
    <BrowserRouter>
      <Route exact path="/" component={NewGame} />
      <Route exact path="/lobby" component={WaitingLobby} />
      <Route exact path="/admin" component={Admin} />
      <Route exact path="/admin/points" component={AdminPoints} />
      <Route exact path="/red" component={TeamRed} />
      <Route exact path="/red/guess" component={Gusser} />
      <Route exact path="/blue" component={TeamBlue} />
      <Route exact path="/blue/guess" component={Gusser} />
      <Route exact path="/gameend" component={GameEnd} />
    </BrowserRouter>
  );
}

export default App;
