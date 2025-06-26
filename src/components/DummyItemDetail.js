// src/components/DummyItemDetail.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dummyProducts from '../data/dummyProducts.json'; // 더미 상품 불러오기
import '../style/ItemDetail.css';

function DummyItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = dummyProducts.find(p => p.id === Number(id));

  if (!item) return <div>해당 상품을 찾을 수 없습니다.</div>;

  const imageUrl = `${process.env.PUBLIC_URL}/images/${item.images[0]}`;

  return (
    <div className='item_detail_wrap'>
      <p className='item_category'>{item.kind}</p>
      <div className='detail_top_wrap'>
        <div className='detailSlide_wrap'>
          <img src={imageUrl} alt={item.title} className='item_detail_img' />
        </div>
        <div className='profile_wrap'>
          <div className='seller_profile'>
            <img src="/images/seller_img.png" alt="판매자" className='seller_profile_img' />
            <div className='seller_info'>
              <p className='seller_id'>판매자: (더미)</p>
              <p className='seller_items'>판매중 - 개</p>
            </div>
          </div>
        </div>
      </div>

      <div className='item_info'>
        <p className='item_name'>{item.title}</p>
        <p className='price'>{item.price.toLocaleString()}원</p>
        <hr className='hr' />
        <ul className='item_status'>
          <li>상품상태: {item.condition}</li>
          <li>배송비: {item.shipping_fee === 0 ? '무료' : `${item.shipping_fee.toLocaleString()}원`}</li>
          <li>거래방식: {item.trade_type}</li>
        </ul>
        <div className='item_btns_wrap'>
          <ul className='item_btns'>
            <li><button onClick={() => navigate(-1)}>뒤로가기</button></li>
          </ul>
        </div>
      </div>

      <div className='item_textbox'>
        <span className='description'>상세설명</span>
        <p>{item.description || '상세 설명 없음'}</p>
      </div>
    </div>
  );
}

export default DummyItemDetail;
