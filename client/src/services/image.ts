import { reduceEachTrailingCommentRange } from "typescript";

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
    cb(err);
  });
}