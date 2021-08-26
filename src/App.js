import { BrowserRouter, Route } from "react-router-dom";
import NewGame from "./pages/NewGame";
import WaitingLobby from "./pages/WaitingLobby"
import PlayArea from "./pages/PlayArea";
import Admin from "./pages/Admin";
import Gusser from "./pages/Gusser";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import TeamRed from "./pages/TeamRed";
import TeamBlue from "./pages/TeamBlue";

function App() {
  window.onbeforeunload = (event) => {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();
    if (e) {
      e.returnValue = ""; // Legacy method for cross browser support
    }
    return ""; // Legacy method for cross browser support
  };
  return (
    <BrowserRouter>
      <Route exact path="/" component={NewGame} />
      <Route exact path="/lobby" component={WaitingLobby} />
      <Route exact path="/play" component={PlayArea} />
      <Route exact path="/admin" component={Admin} />
      <Route exact path="/guess" component={Gusser} />
      <Route exact path="/red" component={TeamRed} />
      <Route exact path="/blue" component={TeamBlue} />
    </BrowserRouter>
  );
}

export default App;
