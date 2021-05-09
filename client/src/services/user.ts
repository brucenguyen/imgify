export function getUser(username: string, page: number, cb: Function) {
    fetch(`${process.env.REACT_APP_API_URL}/user`, {
      method: 'POST', 
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, page: page })
    }).then(function(response) {
      response.json().then(function(json) {
        if (response.status !== 200) {
          if (json) cb(null, json.message);
        } else {
          if (json) {
            cb(json, null);
          } else {
            cb(null, "Could not receive data from server.")
          }
        }
      });
    }).catch(function(err: any) {
      cb(null, err);
    });
  }