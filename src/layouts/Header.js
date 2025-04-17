import React from 'react';
import Navbar from "./Navbar";
import '../styles/layouts/Header.scss';
import Searchbar from '../components/Searchbar/Searchbar';
function Header(props) {
    return (
        <div className='header'>
        <Navbar/>
        <div className="header__content">
            <img src='/background.png' alt='background' className='header__background-img'/>
            <h1 className='header__title'>Chúng tôi tìm cho bạn những tour tuyệt vời</h1>
            <p className='header__intro-text'>Hãy để chúng tôi giúp bạn lên kế hoạch cho chuyến đi hoàn hảo nhất. Từ những bãi biển đầy nắng đến các điểm đến kỳ thú, mọi hành trình đều là một trải nghiệm đáng nhớ.</p>
            <div className="header__video-area">
            <div className="header__circle-button">
                <a href='...'>
                <div className="header__play-icon"></div>
                </a>
            </div>
            <p className='header__watch-text'>Watch video</p>
            </div>
        </div>
        <Searchbar/>
</div>

    );
}

export default Header;