import React from 'react';
import Navbar from "./Navbar";
import '../styles/layouts/Header.scss';
import Searchbar from '../components/Searchbar/Searchbar';
function Header(props) {
    return (
        <div className='header'>
            <Navbar/>
            <div className="header-content">
                <img src='/background.png' alt='background' className='background-img'/>
                <h1>Chúng tôi tìm cho bạn những tour tuyệt vời</h1>
                <p className='intro-text'>Hãy để chúng tôi giúp bạn lên kế hoạch cho chuyến đi hoàn hảo nhất. Từ những bãi biển đầy nắng đến các điểm đến kỳ thú, mọi hành trình đều là một trải nghiệm đáng nhớ.</p>
                <div className="videoArea">
                    <div className="circle-button">
                        <a href='https://github.com/DUYBEGINER/tour-booking-web.git'>
                            <div className="play-icon"></div>
                        </a>              
                    </div>
                    <p>Watch video</p>
                    
                </div>
            </div>
            
            <Searchbar/>
        </div>
    );
}

export default Header;