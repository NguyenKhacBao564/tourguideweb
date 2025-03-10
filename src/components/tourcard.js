import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCar, faUsers} from "@fortawesome/free-solid-svg-icons";
import { FaCalendarAlt } from "react-icons/fa";
import "../assets/styles/components/TourCard.scss";
function TourCard(props) {

    // console.log(props);
    return (
        <div className='tour-card'>
            <img src="https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Phú Yên" className="tour-img"/>
            <div className="tour-info">
                <h3>{props.tourname}</h3>
                <ul className="tour-details">
                    <li><p className="tour-duration"><FontAwesomeIcon icon={faClock} />Thời lượng: {props.duration}</p></li>
                    <li><p><FontAwesomeIcon icon={faCar} />Phương tiện: {props.vehicle}</p></li>
                    <li><p className="tour-people"><FontAwesomeIcon icon={faUsers} />Số lượng khách: {props.available_seats}/{props.total_seats}</p></li>
                    <li><p className="tour-people"><FaCalendarAlt />Ngày khởi hành: 25/09/2025</p></li>
                </ul>
                <div className="tour-footer"> 
                    <div className="tour-price-container">
                        <p>Giá từ:</p>
                        <p id="price">{props.price} đ</p>
                    </div>  
                    <button className="book-btn">Đặt ngay</button>
                </div>
            </div>            
        </div>
    );
}

export default TourCard;