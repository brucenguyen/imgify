import './Home.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getPage } from '../services/image';

function Home() {
  const pageSize = 100;
  
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [posts, setPosts] = useState<any[]>([]);
  
  function loadPage() {
    getPage(page, (data: any, err: any) => {
      if (err) {
        window.alert(err);
      } else {
        setPosts(data.posts);
        setMaxPage(Math.ceil(data.numPosts / pageSize));
      }
    });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("page")) {
      setPage(parseInt(params.get("page") as string));
    }

    loadPage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="root">
      {
        posts.length > 0 &&
          <h1>Latest posts</h1>
      }
      <div className="posts">
        {
          posts.length ? (
            posts.map(post => {
              return post.images && (
                <Link key={ post.dateCreated } to={ `/submission/${post.postID}` }>
                  <div className="card">
                    {
                      post.images.length > 1 &&
                        <div className="album" />
                    }
                    <img alt={ post.title } src={ `${process.env.REACT_APP_API_URL}/image/upload/${post.images[0]}` } />
                  </div>
                </Link>
              );
            })
          ) : (
            <p>There's nothing here... :(</p>
          )
        }
      </div>
      <div className="page-control">
        <p>Page { page }</p>
        {
          page > 1 &&
            <Link to={ `?page=${page-1}` }><button className="btn btn-primary" onClick={ (e) => setPage(page - 1) }>Prev</button></Link>
        }
        {
          page < maxPage &&
            <Link to={ `?page=${page+1}` }><button className="btn btn-primary" onClick={ (e) => setPage(page + 1) }>Next</button></Link>
        }
      </div>
    </div>
  );
}

export default Home;
