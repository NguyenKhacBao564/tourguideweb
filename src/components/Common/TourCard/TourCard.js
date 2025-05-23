import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCar, faUsers, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FaCalendarAlt } from "react-icons/fa";
import {formatDate} from "../../../feature/formatDate";
import { API_URL } from "../../../utils/API_Port";
import "./TourCard.scss";
import { useNavigate } from 'react-router';
function TourCard(props) {
    const navigate = useNavigate();
    const handleBooking = () => {
        // Truyền id qua query parameter
        console.log("click đặt tour")
        const tourId = props.tour_id; // Giả định props có id, nếu không cần điều chỉnh
        navigate(`/booking?id=${tourId}`);
    };

    const adultPrice = Number(props.price).toLocaleString('vi-VN');

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
                    src={`${API_URL}/${props.cover_image}`}
                    alt="Tour"
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
                            <FaCalendarAlt /> Ngày khởi hành: {formatDate(props.start_date)}
                        </p>
                    </li>
                </ul>
                <div className="tour-card__footer">
                    <div className="tour-card__footer__price-container">
                        <p>Giá từ:</p>
                        <p id="price">{adultPrice} đ</p>
                    </div>
                    <button className="book-btn" onClick={() => handleBooking()}>Đặt ngay</button>
                </div>
            </div>
        </div>
    );
}

export default TourCard;