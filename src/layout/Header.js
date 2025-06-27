import React, { useState, useEffect, useRef } from 'react';
import '../style/common.css'
import { Link, useNavigate, useLocation } from 'react-router-dom';   
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faUser,
  faUserPlus,
  faHeadset,
  faShoppingCart,
  faSignOut,
  faBars,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null); // (회원정보 수정을 위함)
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchOpen, setSearchOpen] = useState(false); // 검색창 열림 상태

  // 검색 input ref (PC용)
  const pcSearchRef = useRef(null);
  // 모바일 검색 input ref
  const mbSearchRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    const storedId = localStorage.getItem('id'); // 사용자 ID (회원정보 수정을 위함)
    setUsername(storedName);
    setId(storedId); // (회원정보 수정을 위함)
    // 로그인 체크 및 강제 이동은 여기서 하지 마세요!
  }, []);

  // 윈도우 리사이즈 감지 (반응형 처리)
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false); // 모바일 메뉴 숨기기
      }
      if (window.innerWidth >= 768 && searchOpen) {
        setSearchOpen(false); // 모바일 검색창 숨기기
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen, searchOpen]);

  // 페이지 이동 또는 검색 키워드 변경 시 검색창 초기화
  useEffect(() => {
    if (pcSearchRef.current) pcSearchRef.current.value = '';
    if (mbSearchRef.current) mbSearchRef.current.value = '';
    setSearchOpen(false);
  }, [location]);

  // 로그아웃을 할 때
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('id'); // (회원정보 수정을 위함)
    setUsername(null);
    setId(null); // (회원정보 수정을 위함)
    navigate('/');
  };

  // 모바일 검색창 submit 처리
  const handleMbSearchSubmit = e => {
    e.preventDefault();
    const kw = e.target.keyword.value.trim();
    if (kw) {
      navigate(`/productpage?keyword=${encodeURIComponent(kw)}`);
      setSearchOpen(false); // 검색 후 닫기
    }
  };

  // PC 검색창 submit 처리
  const handlePcSearchSubmit = e => {
    e.preventDefault();
    const kw = e.target.keyword.value.trim();
    if (kw) {
      navigate(`/productpage?keyword=${encodeURIComponent(kw)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header>
      <div className='header_wrap'>
        {/* 로고 */}
        <div className='header_logo'>
          <Link to="/">
            <img src={`${process.env.PUBLIC_URL}/images/header_logo.png`} alt="Green Market" />
          </Link>
        </div>

        {/* 로그인 사용자 정보 - LNB 메뉴 위에 분리 */}
        {username && windowWidth >= 768 && (
          <div className="header_user_info">
            <span className="header_username">{username}님!</span>
            <button button='button' onClick={handleLogout}><FontAwesomeIcon icon={faSignOut} />로그아웃</button>
          </div>
        )}

        {/* 모바일 검색 + 토글메뉴 */}
        <div className='mobile_menu_wrap'>
          <form onSubmit={handleMbSearchSubmit} className={`mb_search_form ${searchOpen ? 'open' : ''}`}>
            {/* 아이콘을 버튼으로 감싸 클릭해도 submit */}
            <button type="submit" className="header_search-icon_mb"
              aria-label={searchOpen ? "검색창 닫기" : "검색창 열기"}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

            <input name="keyword" type="text" placeholder="검색어를 입력해주세요" maxLength='30'
              ref={mbSearchRef}
              className={`mb_search_input ${searchOpen ? 'open' : ''}`}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleMbSearchSubmit(e);
                }
              }}
            />
          </form>

          {/* 모바일 메뉴 버튼 */}
          <button type='button' className="mobile_menu_btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="mobile_menu_icon" />
          </button>
        </div>

        {/* PC 검색창 */}
        <div className='header_search_wrap'>
          <form onSubmit={handlePcSearchSubmit} className="pc_search_form">
            {/* submit 버튼으로 변경 */}
            <button type="submit" className="header_search-icon" aria-label="검색하기">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

            <input name="keyword" type='text' placeholder="검색어를 입력해주세요" maxLength='30' 
              ref={pcSearchRef} className="pc_search_input"
            />
          </form>
        </div>

        {/* PC 메뉴 - lnb */}
        <nav className='header_lnb_wrap'>
          <ul>
            {username ? (
              <>
                {/* <li className='header_username_wrap'><span className='header_username'>{username}님!</span></li>
                <li>
                  <button onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOut} />
                    로그아웃
                  </button>
                </li> */} {/* 상단에 별도 분리 (좌우로 길어지는 문제 해결위함) */}
                <li>
                  <Link to={`/member/update/${id}`}>
                    <FontAwesomeIcon icon={faUser} />
                    회원수정
                  </Link>
                </li>
                <li>
                  <Link to="/cart">
                    <FontAwesomeIcon icon={faShoppingCart} />
                    장바구니
                  </Link>
                </li>
              </>
              ) : (
              <>
                <li>
                  <Link to="/login">
                    <FontAwesomeIcon icon={faUser} />
                    로그인
                  </Link>
                </li>
                <li>
                  <Link to="/register">
                    <FontAwesomeIcon icon={faUserPlus} />
                    회원가입
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/notice">
                <FontAwesomeIcon icon={faHeadset} />
                고객센터
              </Link>
            </li>
          </ul>
        </nav>

        {/* PC 메뉴 - gnb */}
        <nav className='header_gnb_wrap'>
          <ul>
            <li><Link to="/productpage">중고마켓</Link></li>
            <li><Link to="/goodsinsert">판매등록</Link></li>
            <li><Link to="/">그린커뮤니티</Link></li>
          </ul>
        </nav>

        {/* 모바일 메뉴 & 오버레이 */}
        {menuOpen && windowWidth < 768 && (
          <>
            {/* 검은 배경 오버레이 */}
            <div className="mobile_overlay" onClick={() => setMenuOpen(false)}
            />

            {/* 오른쪽에서 슬라이드로 나오는 메뉴 */}
            <div className="mobile_menu" style={{ transform: menuOpen ? 'translateX(250px)': 'translateX(100%)'}}>
              <ul>
                {username ? (
                  <>
                    <li><span className='header_username'>{username}님!</span></li>
                    <li>
                      <button onClick={handleLogout}>로그아웃</button>
                    </li>
                    <li><Link to={`/member/update/${id}`} onClick={() => setMenuOpen(false)}>회원수정</Link></li>
                    <li><Link to="/cart" onClick={() => setMenuOpen(false)}>장바구니</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" onClick={() => setMenuOpen(false)}>로그인</Link></li>
                    <li><Link to="/register" onClick={() => setMenuOpen(false)}>회원가입</Link></li>
                  </>
                )}
                <li><Link to="/notice" onClick={() => setMenuOpen(false)}>고객센터</Link></li>
              </ul>
              <ul>
                <li><Link to="/productpage" onClick={() => setMenuOpen(false)}>중고마켓</Link></li>
                <li><Link to="/goodsinsert" onClick={() => setMenuOpen(false)}>판매등록</Link></li>
                <li><Link to="/" onClick={() => setMenuOpen(false)}>그린커뮤니티</Link></li>
              </ul>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;