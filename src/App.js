import { BrowserRouter as Router, Route, Redirect  } from "react-router-dom";
import Login from './views/Login'
import Manage from './views/Manage'
import './App.css';

function App() {
  return (
    <Router>
      <Route path="/login" exact component={Login} />
      <Route path="/manage" component={Manage} />
      <Redirect from='/' to='/login' />
    </Router>
  );
}

export default App;
