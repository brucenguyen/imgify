import './Home.scss';
import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { searchPost } from '../services/image';

function Search() {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  
  function findPost(query: string) {
    searchPost(query, (data: any, err: any) => {
      if (err) {
        window.alert(err);
      } else {
        setPosts(data);
      }
    });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get("query")) {
      history.push('/');
      return;
    }

    setQuery(params.get("query") as string);
    findPost(params.get("query") as string);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);

  return (
    <div className="root">
      <p>{ (posts && posts.length) ? posts.length : '0' } results found for "{ query }"</p>
      <div className="posts">
        {
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
        }
      </div>
    </div>
  );
}

export default Search;
