import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Login from './views/Login'
import Manage from './views/Manage'
// import "./Mock"
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/manage" component={Manage} />
        <Redirect from='/' to='/login' />
        <Route component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
