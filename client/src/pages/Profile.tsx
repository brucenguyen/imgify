import './Profile.scss';
import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { verifyToken } from '../services/auth';
import { getUser } from '../services/user';
import { removePost } from '../services/image';

function Profile(props: any) {
  const pageSize = 100;

  const history = useHistory();
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [username, setUsername] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

  function loadUser(page: number) {
    getUser(props.match.params.username, page, (data: any, err: any) => {
      if (err) {
        window.alert(err);
        history.push("/");
      } else {
        setUsername(data.username);
        setDateCreated(data.dateCreated);
        setPosts(data.posts);
        setMaxPage(Math.ceil(data.numPosts / pageSize));
      }
    });
  }

  function deletePosts(e: any) {
    e.preventDefault();
    
    removePost(selectedPosts, (err: any) => {
      if (err) {
        window.alert(err);
      } else {
        window.alert("Posts successfully deleted");
        loadUser(page);
      }
    });
  }

  function modifySelectedPosts(e: any, postID: number) {
    if (e.target.checked) {
      setSelectedPosts([...selectedPosts, postID]);
    } else {
      const values = [...selectedPosts];
      const index = values.indexOf(postID);
      if (index >= 0) {
        values.splice(index, 1);
      }
      setSelectedPosts(values);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("page")) {
      setPage(parseInt(params.get("page") as string));
    }

    if (!props.match.params.username) {
      history.push("/");
    }
    
    verifyToken((err: any) => {});

    loadUser(page);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  
  return username ? (
    <div className="root">
      <h1>{ username }</h1>
      <p>joined { dateCreated }</p>
      {
        localStorage.getItem('ACCESS_USERNAME') === props.match.params.username &&
          <div className="actions">
            <Link to="/upload"><button className="btn btn-primary">Upload</button></Link>
            {
              selectedPosts.length > 0 &&
                <button className="btn btn-primary" onClick={ (e) => deletePosts(e) }>Delete Selected</button>
            }
          </div>
      }
      <div className="posts">
        {
          posts.length ? (
            posts.map(post => {
              return post.images && (
                <div key={ post.dateCreated } className="card">
                  {
                    localStorage.getItem('ACCESS_USERNAME') === props.match.params.username &&
                      <input className="image-select" type="checkbox" onChange={ (e) => modifySelectedPosts(e, post.postID) } />
                  }
                  <Link  to={ `/submission/${post.postID}` }>
                    {
                      post.images.length > 1 &&
                        <div className="album" />
                    }
                    <img alt={ post.title } src={ `${process.env.REACT_APP_API_URL}/image/upload/${post.images[0]}` } />
                  </Link>
                </div>
              );
            })
          ) : (
            <p>There's nothing here :(</p>
          )
        }
      </div>
      <div className="page-control">
        <p>Page { page }</p>
        {
          page > 1 &&
            <Link to={ `/profile/${username}?page=${page-1}` }><button className="btn btn-primary" onClick={ (e) => setPage(page - 1) }>Prev</button></Link>
        }
        {
          page < maxPage &&
            <Link to={ `/profile/${username}?page=${page+1}` }><button className="btn btn-primary" onClick={ (e) => setPage(page + 1) }>Next</button></Link>
        }
      </div>
    </div>
  ) : (
    <div className="root">
      <h1>Loading...</h1>
    </div>
  );
}

export default Profile;
