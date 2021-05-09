export function getToken(username: string, password: string, registration: boolean, cb: Function) {
  const url = (registration) ? `${process.env.REACT_APP_API_URL}/user/register` : `${process.env.REACT_APP_API_URL}/auth/signin`;
  const validUsername = username.match(/^\w+$/g);
  if (registration && !validUsername) {
    cb("Username can only include letters, numbers, and underscores.");
  }

  fetch(url, {
    method: 'POST', 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: username, password: password })
  }).then(function(response) {
    response.json().then(function(json) {
      if (response.status !== 200) {
        if (json) cb(json.message);
      } else {
        localStorage.setItem('ACCESS_TOKEN', json.token);
        localStorage.setItem('ACCESS_USERNAME', json.username);
        cb(null);
      }
    });
  }).catch(function(err: any) {
    cb(err);
  });
}

export function verifyToken(cb: Function) {
  fetch(`${process.env.REACT_APP_API_URL}/auth`, {
    method: 'GET', 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` 
    }
  }).then(function(response) {
    response.json().then(function(json) {
      if (response.status !== 200) {
        localStorage.clear();
        if (json) cb(json.message);
      } else {
        localStorage.setItem('ACCESS_USERNAME', json.username);
        cb(null);
      }
    });
  }).catch(function(err: any) {
    cb(err);
  });
}
