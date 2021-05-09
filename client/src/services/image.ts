export function uploadImages(title: string, keywords: string[], files: File[], cb: Function) {
  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  const formData = new FormData();

  files.forEach(file => {
    if (!validImageTypes.includes(file['type'])) {
      cb(null, "Files must be images.");
      return;
    }
    formData.append("images", file);
  });
  keywords.forEach(keyword => {
    formData.append("keywords", keyword);
  });
  formData.append("title", title);

  fetch(`${process.env.REACT_APP_API_URL}/image/upload`, {
    method: 'POST', 
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` 
    },
    body: formData
  }).then(function(response) {
    response.json().then(function(json) {
      if (response.status !== 200) {
        if (json) cb(null, json.message);
      } else {
        cb(json, null);
      }
    });
  }).catch(function(err: any) {
    console.error(err);
    cb(err);
  });
}

export function getPage(page: number, cb: Function) {
  fetch(`${process.env.REACT_APP_API_URL}/image/submission/all`, {
    method: 'POST', 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ page: page })
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
    console.error(err);
    cb(null, err);
  });
}

export function getPost(postID: number, cb: Function) {
  fetch(`${process.env.REACT_APP_API_URL}/image/submission`, {
    method: 'POST', 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ postID: postID })
  }).then(function(response) {
    response.json().then(function(json) {
      if (response.status !== 200) {
        if (json) cb(null, json.message);
      } else {
        if (json) {
          cb(json.post, null);
        } else {
          cb(null, "Could not receive data from server.")
        }
      }
    });
  }).catch(function(err: any) {
    console.error(err);
    cb(null, err);
  });
}

export function removePost(postID: number, cb: Function) {
  fetch(`${process.env.REACT_APP_API_URL}/image/submission/delete`, {
    method: 'POST', 
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ postID: postID })
  }).then(function(response) {
    response.json().then(function(json) {
      if (response.status !== 200) {
        if (json) cb(json.message);
      } else {
        if (json) {
          cb(null);
        } else {
          cb("Could not remove post.")
        }
      }
    });
  }).catch(function(err: any) {
    console.error(err);
    cb(err);
  });
}
