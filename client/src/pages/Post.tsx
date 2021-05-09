import './Post.scss';
import { useState, useEffect } from 'react';
import { useHistory, } from 'react-router';
import { Link } from 'react-router-dom';

import { getPost, removePost } from '../services/image';
import { verifyToken } from '../services/auth';

function Post(props: any) {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  function loadPost() {
    getPost(props.match.params.submissionID, (data: any, err: any) => {
      if (err) {
        window.alert(err);
        history.push("/");
      } else {
        setTitle(data.title);
        setUsername(data.username);
        setDateCreated(data.dateCreated);
        setImages(data.images);
        setKeywords(data.keywords);
      }
    });
  }

  function deletePost(e: any) {
    e.preventDefault();

    removePost(props.match.params.submissionID, (err: any) => {
      if (err) {
        window.alert(err);
      } else {
        window.alert("Post successfully deleted");
        history.push('/')
      }
    });
  }

  useEffect(() => {
    if (!props.match.params.submissionID) {
      history.push("/");
    }
    
    verifyToken((err: any) => {});

    loadPost();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return title ? (
    <div className="root">
      <h1>{ title }</h1>
      <p>by <Link to={`/profile/${username}`}>{ username }</Link> on { dateCreated }</p>
      {
        localStorage.getItem('ACCESS_USERNAME') === username &&
          <div>
            <button className="btn btn-primary" onClick={ (e) => deletePost(e) }>Delete</button>
          </div>
      }
      <div className="images">
        {
          images.map(image => {
            return <img key={ image } alt={ image } src={`${process.env.REACT_APP_API_URL}/image/upload/${image}`} />;
          })
        }
      </div>
      {
        keywords.length > 0 &&
          <div className="keywords">
            <h2>Keywords:</h2>
            <p>
              {
                keywords.map((keyword, index) => {
                  return (keyword + ((index < keywords.length - 1) ? ", " : ""));
                })
              }
            </p>
          </div>
      }
    </div>
  ) : (
    <div className="root">
      <h1>Loading...</h1>
    </div>
  );
}

export default Post;
