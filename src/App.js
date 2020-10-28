import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Login from './views/Login'
import Manage from './views/Manage'
import "./Mock"
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/manage" component={Manage} />
        <Redirect from='/' to='/login' />
      </Switch>
    </Router>
  );
}

export default App;
