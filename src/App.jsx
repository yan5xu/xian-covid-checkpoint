import "./App.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import MapComponent from "./pages/MapContainer";
import PostgraduateHelp from "./pages/PostgraduateHelp";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={MapComponent} />
          <Route exact path="/postgraduate-help" component={PostgraduateHelp} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
