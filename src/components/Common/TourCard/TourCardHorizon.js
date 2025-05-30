import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCar, faUsers, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import "./TourCardHorizon.scss";
import { Container, Row, Col } from 'react-bootstrap';
function TourCardHorizon(props) {
    return (
        <Card className="card-horizontal">
          <Card.Img
            variant="top"
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhdmVsJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww"
            alt="Tour Image"
            className="h-48 object-cover"
          />
          <Card.Body>
            <Card.Title className="">
              Buôn Ma Thuột - Gia Lai - Kon Tum - Thác DrayNur - Bien Hồ - To Nung - Nhà thó KonKlor - Cư khâu Bơ Y - Măng Đen ...
            </Card.Title>
            <Card.Text className="">
                <Container fluid>
                    <Row className="tour_infor">
                        <Col>
                            <p><FontAwesomeIcon icon={faClock} /> Thời gian: 2N1D</p>
                            <p><FaLocationDot /> Khởi hành: TP Hồ Chí Minh</p>
                        </Col>
                        <Col>
                            <p><FaCalendarAlt /> Ngày khởi hành: 30/02/2025</p>
                            <p><FontAwesomeIcon icon={faUsers} /> Chỗ trống: 28/30</p>
                        </Col>
                    </Row>
                </Container>
            </Card.Text>
            <div className="tour-price">
                <div className="gap-2">
                    <p className="font-bold text-black-normal">Giá từ:</p>
                    <p className="font-bold text-red-600"> 3.990.000 đ</p>
                </div>
                  
                <div className="tmp">
                    <p className="review">
                        (584 reviews)
                    </p>   
                    <Button variant="primary" >
                        Xem chi tiết
                    </Button>
                </div>   
            </div>

          </Card.Body>
        </Card>
    );
}

export default TourCardHorizon;