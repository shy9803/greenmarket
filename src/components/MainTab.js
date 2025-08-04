import React, { useState } from 'react';
import ItemCard from './ItemCardMainTab';
import itemData from '../data/itemData';
import '../style/maintab.css';

function MainTab(props) {
  const [activeTab, setActiveTab] = useState("# 집꾸미기");
  const tabs = Object.keys(itemData);

  // 탭별 제목 (프로젝트 이후 추가(공유 누락 부분))
  const tabTitles = {
    "# 집꾸미기": "집꾸미기도 알뜰한 그린마켓 추천템과 함께", // Figma UI디자인 작성 제목
    "# 러닝용품": "러닝용품도 알뜰한 그린마켓 추천템과 함께",
    "# 자취인필수": "자취인들에게 필수적인 용품도 알뜰한 그린마켓 추천템과 함께"
  }

  return (
    <div className='main_tab_con'>

      <div className='main_tab_wrap'>
        {/* 탭 버튼 */}
        <ul className='main_tab_btns'>
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "btnAct" : ""}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>

        <h2>{tabTitles[activeTab]}</h2>

        {/* 탭 콘텐츠 */}
        <div className='main_tab_content'>
          <div className='main_tab_content_inner'>

            {/* 왼쪽 대표 이미지 */}
            {itemData[activeTab]?.image && (
              <div className='main_tab_main_image'>
                <img
                  src={`${process.env.PUBLIC_URL}${itemData[activeTab].image}`}
                  alt={`${activeTab} 대표 이미지`}
                  className='main_tab_big_img'
                />
              </div>
            )}


            {/* 오른쪽 아이템 리스트 */}
            <ul className='main_tab_content_list'>
              {(itemData[activeTab]?.items || []).map((item) =>
                item.image ? (
                  <ItemCard
                    key={item.id}
                    imgSrc={`${process.env.PUBLIC_URL}${item.image}`}
                    brand={item.brand}
                    name={item.name}
                    price={item.price}
                    datetime={item.time}
                  />
                ) : (
                  <li key={item.id}>{item.name}</li>
                )
              )}
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}

export default MainTab;
