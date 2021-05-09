import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.scss';
import Signin from './pages/Signin';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Post from './pages/Post';
import Home from './pages/Home';
import Search from './pages/Search';

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={ Home }/>
          <Route exact path="/search" component={ Search } />
          <Route exact path="/submission/:submissionID" component={ Post } />
          <Route exact path="/profile/:username" component={ Profile } />
          <Route exact path="/signin" component={ Signin } />
          <Route exact path="/upload" component={ Upload } />
        </Switch>
      </Router>
    </>
  );
}

export default App;
