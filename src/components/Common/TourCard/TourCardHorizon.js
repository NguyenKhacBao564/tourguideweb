import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCar, faUsers, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { API_URL } from '../../../utils/API_Port';
import { formatDate } from '../../../feature/formatDate';
import "./TourCardHorizon.scss";

import { Container, Row, Col } from 'react-bootstrap';
function TourCardHorizon(props) {

    const { tour } = props;
    
    console.log('🎫 TourCardHorizon received tour:', tour);
    
    if (!tour) {
        console.error('❌ TourCardHorizon: tour prop is missing');
        return <div>Tour data is missing</div>;
    }
    
    const handleBooking = () => {
         window.location.href = `/booking?id=${tour.tour_id}`;
    }
    return (
        <Card className="card-horizontal">
          <Card.Img
            variant="top"
            src={`${API_URL}/${tour.cover_image}`}
            alt="Tour Image"
            className="h-48 object-cover"
          />
          <Card.Body>
            <Card.Title >
              {tour.name || 'Tên tour không xác định'}
            </Card.Title>
            <div className="cardText">
                <Container fluid>
                    <Row className="tour_infor">
                        <Col>
                            <span><FontAwesomeIcon icon={faClock} /> Thời gian: {tour.duration || 0} ngày {(tour.duration || 1) -1} đêm</span>
                            <span><FaLocationDot /> Khởi hành: {tour.departureLocation || tour.departure_location || 'Chưa xác định'}</span>
                        </Col>
                        <Col>
                            <span><FaCalendarAlt /> Ngày khởi hành: {tour.start_date ? formatDate(tour.start_date) : 'Chưa xác định'}</span>
                            <span><FontAwesomeIcon icon={faUsers} /> Chỗ còn trống: {(tour.max_guests || 0) - (tour.booked_slots || 0)}</span>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="tour-price">
                <div className="gap-2">
                    <p className="font-bold text-black-normal">Giá từ:</p>
                    <p className="font-bold text-red-600"> 
                        {tour.price ? tour.price.toLocaleString('vi-VN') : 'Liên hệ'} đ
                    </p>
                </div>
                  
                <div className="tmp">
                    {/* <p className="review">
                        (584 reviews)
                    </p>    */}
                    <Button variant="primary" onClick={handleBooking}>
                        Xem chi tiết
                    </Button>
                </div>   
            </div>

          </Card.Body>
        </Card>
    );
}

export default TourCardHorizon;