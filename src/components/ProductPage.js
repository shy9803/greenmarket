// components/ProductPage.js
import React, { useState, useMemo, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // 검색기능
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faSearch } from '@fortawesome/free-solid-svg-icons';

import '../style/productpage.css';

import Slide from './Slide';
import ItemCard2 from './ItemCard2';
import dummyProducts from '../data/dummyProducts.json'; // 더미 상품

// URL 주소 (유지보수성 탁월)
const BASE_URL = 'https://port-0-backend-mbiobig1cd0dc4c0.sel4.cloudtype.app';

/* ▸ 필터용 상수 (원본 그대로) */
const CATEGORY = ['여성의류', '남성의류', '가방', '신발', '패션잡화', '키즈', '라이프', '전자기기', '반려동물','기타'];
const BRAND = ['NoBrand', '나이키', '아디다스', '자라', '유니클로', '폴로 랄프 로렌', '타미힐피거', '리바이스', '타미힐피거','리바이스', '삼성', '애플', '다이소'];
const CONDITION = ['새상품(미개봉)', '거의 새상품(상)', '사용감 있는 깨끗한 상품(중)', '사용 흔적이 많이 있는 상품(하)'];
const SALESTATE = ['판매중', '판매완료'];

export default function ProductPage() {
  const navigate = useNavigate();
  const { search } = useLocation();

  /* ── 기존 상태 (필터/검색) ── */
  const [openKey, setOpenKey]       = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands]         = useState([]);
  const [conditions, setConditions] = useState([]);
  const [states, setStates]         = useState([]);
  const [priceMin, setPriceMin]     = useState('');
  const [priceMax, setPriceMax]     = useState('');
  /* ── 검색어 상태 ── */
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm]   = useState('');
  /* ── 가격 입력 상태 (적용 전) ── */
  const [tempPriceMin, setTempPriceMin] = useState('');
  const [tempPriceMax, setTempPriceMax] = useState('');

  // ── 상품 데이터 ──
  const [apiItems, setApiItems]     = useState([]);
  const [dummyItems, setDummyItems] = useState([]); 
  /* ── DB 연동 상태 ── */
  // const [productItems, setProductItems] = useState([]);  // API 로 받은 상품 리스트

  /* ── 배열 토글 헬퍼 ── */
  const toggleArray = (v, setter) => setter(prev => prev.includes(v) ? prev.filter(i => i !== v) : [...prev, v]);

  /* ── URL 파라미터(keyword) 처리 ── */
  useEffect(() => {
    const qp = new URLSearchParams(search);
    const kw = qp.get('keyword') || '';
    // if (kw) {
      setSearchInput(kw);
      setSearchTerm(kw);
    // }
  }, [search]);

  /* ── 컴포넌트 마운트 시 DB 에서 상품 불러오기 ── */
  // 데이터 로드: API + 더미
  useEffect(() => {
    axios.get(`${BASE_URL}/products`)
      .then(res => {
        setApiItems(res.data.map(p => ({
          id:        p.id,
          imageUrl:  `${BASE_URL}/uploads/${p.images[0] || ''}`,
          brand:     p.brand,
          name:      p.title,
          price:     p.price,
          datetime:  p.datetime,
          category:  p.kind,
          condition: p.condition,
          state:     '판매중'
        })));
      })
      .catch(console.error);

    setDummyItems(dummyProducts.map(d => ({
      id:        d.id + 1000,
      imageUrl:  `${process.env.PUBLIC_URL}/images/${d.images[0]}`,
      brand:     d.brand,
      name:      d.title,
      price:     d.price,
      datetime:  new Date().toISOString(),
      category:  d.kind,
      condition: d.condition,
      state:     d.trade_type === '직거래' ? '판매중' : '판매완료'
    })));
  }, []);

  /* ── 검색 입력 핸들러 ── */
    /* ── 검색창 onChange → 공백이면 검색어 초기화 ── */
    const handleSearchChange = e => {
      const v = e.target.value;
      setSearchInput(v);
      if (!v.trim()) {
        setSearchTerm('');
        navigate('/productpage');
      }
    };
  
    /* ── 검색창 Enter → URL 히스토리 & searchTerm 세팅 ── */
    const handleSearchKey = e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const v = e.target.value.trim();
        setSearchInput(v);
        setSearchTerm(v);
        navigate(v ? `/productpage?keyword=${encodeURIComponent(v)}` : '/productpage');
      }
    };
  
    /* ── 필터 & 검색 적용 ── */
    // 공통 필터 로직
    // const filtered = useMemo(() => {return productItems.filter(it => {
    
    // 기존 공유분에서 const applyFilter = list => list.filter(it => { 가
    // 'React의 useMemo 훅에서 applyFilter가 종속성 배열에 없기 때문에 생기는 경고'로 인해 수정
    const applyFilter = useCallback((list) => {
      return list.filter(it => {
        if (categories.length && !categories.includes(it.category)) return false;
        if (brands.length && !brands.includes(it.brand)) return false;
        if (conditions.length && !conditions.includes(it.condition)) return false;
        if (states.length && !states.includes(it.state)) return false;
        // if (priceMin && it.price < Number(priceMin)) return false;
        // if (priceMax && it.price > Number(priceMax)) return false;
        if (priceMin && it.price < +priceMin) return false;
        if (priceMax && it.price > +priceMax) return false;

        // ★ 여기부터 검색어 체크: title(name), brand, category 모두 검사
        if (searchTerm) {
          const kw = searchTerm.toLowerCase();
          // const inName = it.name.toLowerCase().includes(kw);
          // const inBrand = it.brand?.toLowerCase().includes(kw);
          // const inKind = it.category?.toLowerCase().includes(kw);
          // if (! (inName || inBrand || inKind) ) return false;
          if (![it.name, it.brand, it.category].some(f => f?.toLowerCase().includes(kw))) return false;
        }
        return true;
      });
    }, [categories, brands, conditions, states, priceMin, priceMax, searchTerm]);

    // }, [productItems, categories, brands, conditions, states, priceMin, priceMax, searchTerm]);
    const filteredApi   = useMemo(() => applyFilter(apiItems), [apiItems,   applyFilter]);
    const filteredDummy = useMemo(() => applyFilter(dummyItems), [dummyItems, applyFilter]);

    //const combinedItems = useMemo(() => [...filteredApi, ...filteredDummy], [filteredApi, filteredDummy]); // 합치기

  return (
    <>
      <Slide />

      <div className="productpage_wrap">
        {/* ─── 상단 4대 탭 ─── */}
        <ul className="productpage_tab-list">
          {['category','brand','price','etc'].map((key, idx) => {
            const titles = ['카테고리','브랜드','가격','기타'];
            let badge = 0;
            if (key === 'category') badge = categories.length;
            else if (key === 'brand') badge = brands.length;
            else if (key === 'price' && (priceMin || priceMax)) badge = 1;
            else if (key === 'etc') badge = conditions.length + states.length;
            return (
              <li
                key={key}
                className={`productpage_tab-item ${openKey === key ? 'active' : ''}`}
                onClick={() => setOpenKey(openKey === key ? null : key)}
              >
                {titles[idx]}
                <FontAwesomeIcon icon={openKey === key ? faChevronUp : faChevronDown} />
                {badge > 0 && <em>{badge}</em>}
              </li>
            );
          })}
        </ul>

        {/* ── 패널: 카테고리 ── */}
        {openKey === 'category' && (
          <div className="productpage_panel">
            <ul className="productpage_grid">
              {CATEGORY.map(c => (
                <li
                  key={c}
                  className={categories.includes(c) ? 'on' : ''}
                  onClick={() => toggleArray(c, setCategories)}
                >{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ── 패널: 브랜드 ── */}
        {openKey==='brand' && (
          <div className="productpage_panel">
            <ul className="productpage_grid">
              {BRAND.map(b => (
                <li
                  key={b}
                  className={brands.includes(b) ? 'on' : ''}
                  onClick={() => toggleArray(b, setBrands)}
                >{b}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ── 패널: 가격 ── */}
        {openKey === 'price' && (
          <div className="productpage_panel productpage_price">
            <div className="price-inputs">
              <input
                type="number" placeholder="최소"
                value={tempPriceMin}
                onChange={e => setTempPriceMin(e.target.value)}
                maxLength='10'
              />
              <span>&#126;</span>
              <input
                type="number" placeholder="최대"
                value={tempPriceMax}
                onChange={e => setTempPriceMax(e.target.value)}
                maxLength='10'
              />
              <button
                className={(tempPriceMin && tempPriceMax) ? 'active' : ''}
                onClick={() => {
                  setPriceMin(tempPriceMin);
                  setPriceMax(tempPriceMax);
                  setOpenKey(null);
                }}
              >적용하기</button>
            </div>
          </div>
        )}

        {/* ── 패널: 기타(컨디션·판매상태) ── */}
        {openKey === 'etc' && (
          <div className="productpage_panel productpage_panel--etc">
            <div className="etc_group">
              <span className="etc_title">제품 컨디션</span>
              <ul className="etc_list">
                {CONDITION.map(c => (
                  <li
                    key={c}
                    className={conditions.includes(c) ? 'on' : ''}
                    onClick={() => toggleArray(c, setConditions)}
                  >{c}</li>
                ))}
              </ul>
            </div>

            <hr />

            <div className="etc_group">
              <span className="etc_title">판매상태</span>
              <ul className="etc_list">
                {SALESTATE.map(s => (
                  <li
                    key={s}
                    className={states.includes(s) ? 'on' : ''}
                    onClick={() => toggleArray(s, setStates)}
                  >{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── 선택된 필터 토큰 & 초기화 ── */}
        {(categories.length || brands.length || conditions.length || states.length || priceMin || priceMax) && (
          <div className="productpage_filter-bar">
            <button onClick={() => {
              setCategories([]); setBrands([]); setConditions([]); setStates([]);
              setPriceMin(''); setPriceMax('');
            }}>초기화 ↺</button>
            {[...categories, ...brands, ...conditions, ...states].map(t => (
              <span key={t}>
                {t} <b onClick={() => {
                  if (categories.includes(t)) toggleArray(t, setCategories);
                  else if (brands.includes(t)) toggleArray(t, setBrands);
                  else if (conditions.includes(t)) toggleArray(t, setConditions);
                  else toggleArray(t, setStates);
                }}>&#88;</b> {/* × */}
              </span>
            ))}
            {(priceMin || priceMax) && (
              <span>
                {priceMin || 0}원 &#126; {priceMax || '∞'}원
                <b onClick={() => { setPriceMin(''); setPriceMax(''); }}>&#88;</b> {/* × */}
              </span>
            )}
          </div>
        )}

        {/* ── 검색창 ── */}
        <div className="productpage_search" style={{marginTop:30}}>
          <FontAwesomeIcon icon={faSearch}/>
          <input
            placeholder="상품명을 입력하고 Enter"
            value={searchInput}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKey}
          />
        </div>

        {/* ── 상품 리스트 ── */}
        {/* 내가 등록한 상품 (DB) + 더미 상품 */}
        {/* <ul className="productpage_items_list">
          {combinedItems.map(it=>(
            <ItemCard2
              key={it.id}
              id={it.id}
              imgSrc={it.imageUrl}
              brand={it.brand}
              name={it.name}
              price={`${it.price.toLocaleString()}원`}
              time={it.datetime}
            />
          ))}
        </ul> */}
        
        {/* 내가 등록한 상품 (DB) */}
        <ul className="productpage_items_list">
          {filteredApi.map(it=>(
            <ItemCard2
              key={it.id}
              id={it.id}
              imgSrc={it.imageUrl}
              brand={it.brand}
              name={it.name}
              price={`${it.price.toLocaleString()}원`}
              datetime={it.datetime}
            />
          ))}
        </ul>

        {/* 더미 상품 */}
        <ul className="productpage_items_list">
          {filteredDummy.map(it=>(
            <ItemCard2
              key={it.id}
              id={it.id}
              imgSrc={it.imageUrl}
              brand={it.brand}
              name={it.name}
              price={`${it.price.toLocaleString()}원`}
              datetime={it.datetime}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

// GPT를 통해 useMemo 종속성 연결, 상품 등록 후 미갱신으로 인한 미출력 해결