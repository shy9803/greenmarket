// components/ItemCard.js
import React from 'react';
import {Link} from 'react-router-dom';

function ItemCard({ imgSrc, brand, name, price, datetime }) {
  return (
    <Link to='/ItemDetail'>
    <li>
      <img src={imgSrc} alt={name} className='item' />
      <span className='brand'>{brand}</span>
      <p className='item_name'>{name}</p>
      <p className='price'>{price}</p>
      <p className='register_time'>{datetime}</p>
    </li>
    </Link>
  );
}

export default ItemCard;
