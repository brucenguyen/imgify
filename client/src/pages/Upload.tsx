import './Upload.scss';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { verifyToken } from '../services/auth';
import { uploadImages } from '../services/image';

function Upload() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  function removeFile(e: any, file: File) {
    e.preventDefault();
    const values = [...files];
    const index = files.indexOf(file);
    if (index >= 0) {
      values.splice(index, 1);
    }
    setFiles(values);
  }

  function removeKeyword(e: any, keyword: string) {
    e.preventDefault();
    const values = [...keywords];
    const index = values.indexOf(keyword);
    if (index >= 0) {
      values.splice(index, 1);
    }
    setKeywords(values);
  }

  function addKeyword(e: any, keyword: string) {
    e.preventDefault();
    if (!keyword || keyword.length > 250) {
      window.alert("Invalid keyword.")
    } else if (keywords.includes(keyword)) {
      window.alert("Keyword already exists.");
    } else {
      setKeywords([...keywords, keyword])
    }
  }

  function uploadFiles() {
    if (!files.length) {
      window.alert("No images selected.");
    } else if (!title) {
      window.alert("No title specified.");
    } else {
      uploadImages(title, keywords, files, (json: any, err: any) => {
        if (err) {
          window.alert(err);
        } else if (json) {
          history.push(`/submission/${json.submissionID}`)
        }
      });
    }
  }

  useEffect(() => {
    verifyToken((err: any) => {
      if (err) {
        window.alert(err);
        history.push('/signin');
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    
  return (
    <div id="image-upload" className="root">
      <h1>Upload some images</h1>
      <input type="text" className="form-control rounded" placeholder="Title" required onChange={ (e: any) => setTitle(e.target.value) } />
      <div className="list">
        <h2>Images</h2>
        <div className="custom-file">
          <input type="file" className="custom-file-input" accept="image/*" multiple onChange={ (e: any) => setFiles(Array.from(e.target.files)) } required />
          <label className="custom-file-label">Choose images...</label>
        </div>
        {
          files.length > 0 &&
            <table>
              <tbody>
                {
                  files.map(file => {
                    return (
                      <tr key={ (file as File).name }>
                        <td>{ (file as File).name }</td>
                        <td><button className="btn btn-primary" onClick={(e) => removeFile(e, file as File) }>Delete</button></td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
        }
      </div>
      <div className="list">
        <h2>Keywords</h2>
        <table>
          <tbody>
            <tr>
              <td className="row-header">
                <input type="text" className="form-control rounded" placeholder="Keyword" onClick={ (e) => document.execCommand("selectall", false, undefined) } onChange={ (e) => setKeyword(e.target.value) } />
              </td>
              <td className="row-header"><button className="btn btn-primary" onClick={(e) => addKeyword(e, keyword) }>Add</button></td>
            </tr>
            {
              keywords.map(keyword => {
                return (
                  <tr key={ keywords.indexOf(keyword) }>
                    <td>{ keyword }</td>
                    <td><button className="btn btn-primary" onClick={(e) => removeKeyword(e, keyword) }>Delete</button></td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
      <button className="btn btn-primary" onClick={ (e: any) => uploadFiles() } >Upload</button>
    </div>
  );
}

export default Upload;
