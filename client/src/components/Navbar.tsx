import { useState, useEffect } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';

import './Navbar.scss';

function Navbar() {
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');
  const history = useHistory();

  function logout(e: any) {
    localStorage.clear();
    window.location.reload();
  }

  function searchPost(e: any) {
    e.preventDefault();
    if (query) {
      history.push({
        pathname: '/search',
        search: `?query=${encodeURIComponent(query)}`
      });
    }
  }

  useEffect(() => {
    if (localStorage.getItem('ACCESS_USERNAME')) {
      setUsername(localStorage.getItem('ACCESS_USERNAME') as string);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <header>
        <nav className="navbar">
          <Link id="logo" to="/">imgify</Link>
          <form id="search-bar" onSubmit={ searchPost }>
            <input type="text" className="form-control rounded" id="search-input" placeholder="Search..." onChange={ (e) => setQuery(e.target.value) } />
            <button type="submit" id="search-button" className="btn btn-primary"><img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Magnifying_glass_icon.svg" alt="Search" /></button>
          </form>
          <div className="navbar-links">
            {
              localStorage.getItem('ACCESS_USERNAME') ? (
                <div className="dropdown show">
                  <button className="btn btn-secondary dropdown-toggle" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    { username }
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <button className="dropdown-item"><Link to={ "/profile/" + username }>Profile</Link></button>
                    <button className="dropdown-item" onClick={ logout }>Sign out</button>
                  </div>
                </div>
              ) : (
                <NavLink activeClassName="active" to="/signin">Sign in</NavLink>
              )
            }
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
