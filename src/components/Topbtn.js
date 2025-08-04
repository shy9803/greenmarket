import React from 'react';
import { Link } from 'react-router-dom';

function Topbtn(props) {
  return (
    <div>
      <Link to='/' alt='상단으로'>
        Top
      </Link>
    </div>
  );
}

export default Topbtn;