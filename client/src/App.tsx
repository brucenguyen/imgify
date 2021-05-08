import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.scss';
import Signin from './pages/Signin';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Upload from './pages/Upload';

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" />
          <Route exact path="/search" />
          <Route exact path="/submission/:submissionID" />
          <Route exact path="/profile/:username" component={ Profile } />
          <Route exact path="/signin" component={ Signin } />
          <Route exact path="/upload" component={ Upload } />
        </Switch>
      </Router>
    </>
  );
}

export default App;
