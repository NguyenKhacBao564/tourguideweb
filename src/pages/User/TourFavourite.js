import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Footer from '../../layouts/Footer';
import Navbar from '../../layouts/Navbar';
import TourCard from '../../components/Common/TourCard/TourCard';
import "../../styles/pages/TourFavourite.scss"
function TourFavourite(props) {

    const tours=[
        {
            tour_id: 1,
            name: "Tour Du Lịch Đà Nẵng",
            description: "Khám phá vẻ đẹp của Đà Nẵng với tour du lịch 3 ngày 2 đêm. Tham quan Bà Nà Hills, Ngũ Hành Sơn và bãi biển Mỹ Khê.",
            cover_image: "images/tour1.jpg",
            duration: "3 ngày 2 đêm",
            start_date: "2023-11-01",
            end_date: "2023-11-03",
            max_guests: 20,
        },
        {
            tour_id: 1,
            name: "Tour Du Lịch Đà Nẵng",
            description: "Khám phá vẻ đẹp của Đà Nẵng với tour du lịch 3 ngày 2 đêm. Tham quan Bà Nà Hills, Ngũ Hành Sơn và bãi biển Mỹ Khê.",
            cover_image: "images/tour1.jpg",
            duration: "3 ngày 2 đêm",
            start_date: "2023-11-01",
            end_date: "2023-11-03",
            max_guests: 20,
        },
        {
            tour_id: 1,
            name: "Tour Du Lịch Đà Nẵng",
            description: "Khám phá vẻ đẹp của Đà Nẵng với tour du lịch 3 ngày 2 đêm. Tham quan Bà Nà Hills, Ngũ Hành Sơn và bãi biển Mỹ Khê.",
            cover_image: "images/tour1.jpg",
            duration: "3 ngày 2 đêm",
            start_date: "2023-11-01",
            end_date: "2023-11-03",
            max_guests: 20,
        },
        {
            tour_id: 1,
            name: "Tour Du Lịch Đà Nẵng",
            description: "Khám phá vẻ đẹp của Đà Nẵng với tour du lịch 3 ngày 2 đêm. Tham quan Bà Nà Hills, Ngũ Hành Sơn và bãi biển Mỹ Khê.",
            cover_image: "images/tour1.jpg",
            duration: "3 ngày 2 đêm",
            start_date: "2023-11-01",
            end_date: "2023-11-03",
            max_guests: 20,
        },
        {
            tour_id: 1,
            name: "Tour Du Lịch Đà Nẵng",
            description: "Khám phá vẻ đẹp của Đà Nẵng với tour du lịch 3 ngày 2 đêm. Tham quan Bà Nà Hills, Ngũ Hành Sơn và bãi biển Mỹ Khê.",
            cover_image: "images/tour1.jpg",
            duration: "3 ngày 2 đêm",
            start_date: "2023-11-01",
            end_date: "2023-11-03",
            max_guests: 20,
        },
        {
            tour_id: 1,
            name: "Tour Du Lịch Đà Nẵng",
            description: "Khám phá vẻ đẹp của Đà Nẵng với tour du lịch 3 ngày 2 đêm. Tham quan Bà Nà Hills, Ngũ Hành Sơn và bãi biển Mỹ Khê.",
            cover_image: "images/tour1.jpg",
            duration: "3 ngày 2 đêm",
            start_date: "2023-11-01",
            end_date: "2023-11-03",
            max_guests: 20,
        },
        {
            tour_id: 1,
            name: "Tour Du Lịch Đà Nẵng",
            description: "Khám phá vẻ đẹp của Đà Nẵng với tour du lịch 3 ngày 2 đêm. Tham quan Bà Nà Hills, Ngũ Hành Sơn và bãi biển Mỹ Khê.",
            cover_image: "images/tour1.jpg",
            duration: "3 ngày 2 đêm",
            start_date: "2023-11-01",
            end_date: "2023-11-03",
            max_guests: 20,
        }
    ]

    return (
        <div>
            <Navbar />
            <Container className="tour_favourite">
                <h2 className="tour-favourite__title text-center">Tour Yêu Thích</h2>
                <p className="tour-favourite__description text-center">Danh sách tour yêu thích của bạn sẽ được hiển thị tại đây.</p>
                {/* Thêm các thành phần khác như danh sách tour yêu thích */}
                <Row className="custom-row g-3 mt-4" xs={1} sm={2} md={3} xl={3} xxl={4}>
                                {tours.map((tour) => (
                                    <Col key={tour.tour_id} className="custom-col">
                                        <TourCard {...tour} />
                                    </Col>
                                ))}
                            </Row>

            </Container>
            <Footer />
        </div>
    );
}

export default TourFavourite;