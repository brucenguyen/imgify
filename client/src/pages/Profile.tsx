import './Profile.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Profile(props: any) {
  return (
    <div className="root">
        {
            localStorage.getItem('ACCESS_USERNAME') === props.match.params.username &&
                <div>
                    <Link to="/upload"><button className="btn btn-primary">Upload</button></Link>
                </div>
        }
    </div>
  );
}

export default Profile;
