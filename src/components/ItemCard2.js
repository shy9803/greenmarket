import React from 'react';
import { Link } from 'react-router-dom';
import '../style/itemcard2.css';
import { getTimeAgo } from '../utils/getTimeAgo';

function ItemCard2({ id, imgSrc, brand, name, price, datetime }) {
  return (
    <li className="itemcard2">
      <Link to={`/products/${id}`}>
        <div className="itemcard2-image-wrapper">
          <img src={imgSrc} alt={name} className="item" />
        </div>
        <span className="brand2">{brand}</span>
        <p className="item_name">{name}</p>
        <p className="price">{price}</p>
        <p className="register_time">{getTimeAgo(datetime)}</p>
      </Link>
    </li>
  );
}

export default ItemCard2;
