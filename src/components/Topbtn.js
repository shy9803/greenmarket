import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

import '../style/topbtn.css';

function Topbtn() {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 감지
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsVisible(scrollTop > 300); // 300px 이상이면 버튼 보이기
  };

  // 최상단으로 스크롤
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className='topbtn'>
      {isVisible && (
      <button type='button' onClick={scrollTop}>
        <FontAwesomeIcon icon={faArrowUp} />
        <span>Top</span>
      </button>
      )}
    </div>
  );
}

export default Topbtn;