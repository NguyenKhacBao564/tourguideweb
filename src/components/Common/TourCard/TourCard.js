import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCar, faUsers, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FaCalendarAlt } from "react-icons/fa";
import "./TourCard.scss";

function TourCard(props) {

    const adultPrice = Number(props.price? props.price : (props.prices.length > 0) ? props.prices.find(price => price.age_group === 'adultPrice').price : 0).toLocaleString('vi-VN');
    
    // console.log(props.prices);
    return (
        <div className="tour-card">
            <div className="tour-card__image-container">
                {/* Biểu tượng khuyến mãi */}
                <div className="tour-card__discount">-20%</div>
                {/* Nút yêu thích */}
                <button className="tour-card__favorite">
                    <FontAwesomeIcon icon={faHeart} />
                </button>

                {/* Hình ảnh */}
                <img
                    src="https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Phú Yên"
                    className="tour-card__img"
                />
            </div>

            <div className="tour-card__info">
                <h3 className="tour-card__name">{props.name}</h3>
                <ul className="tour-card__details">
                    <li>
                        <p>
                            <FontAwesomeIcon icon={faClock} /> Thời lượng: {props.duration}
                        </p>
                    </li>
                    <li>
                        <p>
                            <FontAwesomeIcon icon={faCar} /> Phương tiện: {props.transport}
                        </p>
                    </li>
                    <li>
                        <p>
                            <FontAwesomeIcon icon={faUsers} /> Số lượng khách: {props.max_guests}
                        </p>
                    </li>
                    <li>
                        <p>
                            <FaCalendarAlt /> Ngày khởi hành: 25/09/2025
                        </p>
                    </li>
                </ul>
                <div className="tour-card__footer">
                    <div className="tour-card__footer__price-container">
                        <p>Giá từ:</p>
                        <p id="price">{adultPrice} đ</p>
                    </div>
                    <button className="book-btn">Đặt ngay</button>
                </div>
            </div>
        </div>
    );
}

export default TourCard;