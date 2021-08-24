import { BrowserRouter, Route } from "react-router-dom";
import NewGame from "./pages/NewGame";
import PlayArea from "./pages/PlayArea";
import Admin from "./pages/Admin";
import Gusser from "./pages/Gusser";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

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
      <Route exact path="/play" component={PlayArea} />
      <Route exact path="/admin" component={Admin} />
      <Route exact path="/guess" component={Gusser} />
    </BrowserRouter>
  );
}

export default App;
