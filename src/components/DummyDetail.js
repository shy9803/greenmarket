import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../style/ItemDetail.css';

import dummyProducts from '../data/dummyProducts.json';
import ItemCard2 from './ItemCard2';

function DummyDetail() {
  const { id } = useParams();
  const numericId = Number(id);

  // id가 1000 이상인 경우만 더미 상품으로 간주
  const dummyId = numericId - 1000;

  const [item, setItem] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    // 현재 상품 찾기
    const product = dummyProducts.find(p => p.id === dummyId);
    if (!product) {
      setItem(null);
      setSellerProducts([]);
      setCategoryProducts([]);
      return;
    }
    setItem(product);

    // 판매자의 다른 상품 (본인 제외)
    const sellerList = dummyProducts.filter(p => p.owner_id === product.owner_id && p.id !== product.id);
    setSellerProducts(sellerList);

    // 같은 카테고리 상품 (본인, 판매자 상품 제외)
    const sellerIds = sellerList.map(p => p.id);
    const categoryList = dummyProducts.filter(p =>
      p.kind === product.kind &&
      p.id !== product.id &&
      !sellerIds.includes(p.id)
    );
    setCategoryProducts(categoryList);

  }, [dummyId]);

  if (!item) return <div>상품을 찾을 수 없습니다.</div>;

  const imageUrls = item.images.map(img => `${process.env.PUBLIC_URL}/images/${img}`);

  return (
    <>
      <div className='item_detail_wrap'>
        <p className='item_category'>
          <Link to='/'>Home</Link>
          <Link to='/productpage'>{item.kind}</Link>
        </p>

        <div className='detail_top_wrap'>
          <div className='detailSlide_wrap'>
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop
              className="detailSlide"
            >
              {imageUrls.map((url, i) => (
                <SwiperSlide key={i}>
                  <img src={url} alt={`상품 이미지 ${i + 1}`} className="item_detail_img" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className='profile_wrap'>
            <div className='seller_profile'>
              <img src="/images/seller_img.png" alt="판매자" className='seller_profile_img' />
              <div className='seller_info'>
                <p className='seller_id'>판매자: 사용자</p>
                <p className='seller_items'>판매중 10개</p>
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
            <li>배송비: 무료</li>
            <li>거래방식: {item.trade_type}</li>
          </ul>
          <div className='item_btns_wrap'>
            <ul className='item_btns'>
              <li><button className='btn_question' disabled>1:1 문의</button></li>
              <li><button className='btn_cart' disabled>장바구니</button></li>
              <li><button className='btn_buy' disabled>구매</button></li>
            </ul>
          </div>
        </div>
      </div>

      <div className='item_textbox'>
        <span className='description'>상세설명</span>
        {item.description || '상세 설명이 없습니다.'}
      </div>

      <div className="seller_products_section">
        <h3>{item.seller_name || '사용자'}님의 다른 상품</h3>
        <div className="product_list_grid">
          {sellerProducts.length > 0 ? sellerProducts.map(p => (
            <ItemCard2
              key={p.id}
              id={p.id + 1000}  // id를 다시 더미 기준으로 조정해서 링크 이동 시 맞게 처리
              imgSrc={`${process.env.PUBLIC_URL}/images/${p.images[0] || ''}`}
              brand={p.brand}
              name={p.title}
              price={`${p.price.toLocaleString()}원`}
              datetime={p.datetime}
            />
          )) : <p>다른 상품이 없습니다.</p>}
        </div>
      </div>


      <div className="category_products_section">
        <h3>카테고리가 같은 다른 상품</h3>
        <div className="product_list_grid">
          {categoryProducts.length > 0 ? categoryProducts.map(p => (
            <ItemCard2
              key={p.id}
              id={p.id + 1000}  // 동일하게 id 조정
              imgSrc={`${process.env.PUBLIC_URL}/images/${p.images[0] || ''}`}
              brand={p.brand}
              name={p.title}
              price={`${p.price.toLocaleString()}원`}
              datetime={p.datetime}
            />
          )) : <p>다른 상품이 없습니다.</p>}
        </div>
      </div>
    </>
  );
}

export default DummyDetail;

// GPT의 도움을 받아 ItemDetail.js 기반으로 수정하여 생성