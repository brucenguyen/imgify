import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import './Signin.scss';
import { getToken } from '../services/auth';

function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const history = useHistory();

  function login(registration: boolean, e: any) {
    e.preventDefault();
    getToken(username, password, registration, (err: string) => {
      if (err) {
        window.alert(err);
      } else {
        history.push("/");
        window.location.reload();
      }
    })
  }

  return !localStorage.getItem('ACCESS_USERNAME') ? (
    <div id="signin-page" className="root">
      <div id="signin-form">
        <form onSubmit={ (e) => login(false, e) }>
          <h1>Sign in</h1>
          <input type="text" className="form-control rounded" placeholder="Username" onChange={ (e) => setUsername(e.target.value) } />
          <input type="password" className="form-control rounded" placeholder="Password" onChange={ (e) => setPassword(e.target.value) } />
          <button type="submit" className="btn btn-primary">Sign in</button>
        </form>
      </div>
      <div id="register-form">
        <form onSubmit={ (e) => login(true, e) }>
          <h1>Register</h1>
          <input type="text" className="form-control rounded" placeholder="Username" onChange={ (e) => setUsername(e.target.value) } />
          <input type="password" className="form-control rounded" placeholder="Password" onChange={ (e) => setPassword(e.target.value) } />
          <input type="password" className="form-control rounded" placeholder="Confirm Password" onChange={ (e) => setPasswordConfirm(e.target.value) } />
          <button type="submit"className="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  ) : (
    <div className="root">
      <h1>You are signed in as <b>{ localStorage.getItem('ACCESS_USERNAME') }</b>.</h1>
    </div>
  );
}

export default Signin;
