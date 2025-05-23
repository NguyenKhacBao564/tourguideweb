import React, {useRef} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../../styles/pages/BookingTour.scss";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import TourSchedule from '../../components/Common/TourSchedule/TourSchedule';
import Footer from '../../layouts/Footer';
import TourList from "../../components/TourList/Tourlist";
import { FaRegHeart } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import Navbar from '../../layouts/Navbar';
import TourInforCard from '../../components/TourInforCard.js/TourInforCard';
import ReviewSection from '../../layouts/ReviewSection';
import { API_URL } from '../../utils/API_Port';
import TourCard from '../../components/Common/TourCard/TourCard';
import { useSearchParams } from 'react-router-dom';


function BookingTour(props) {
    const bookingPageRef = useRef(null); // Tạo ref cho .bookingPage
    const [searchParams] = useSearchParams();
    const tourId = searchParams.get('id');
    console.log("Tour ID:", tourId); // Kiểm tra giá trị tourId

    const tours = [
        {
            cover_image: `${API_URL}/uploads/1745472098120-963422392.jpg`,
            name:"Tour 1",
            duration: "2 ngày 1 đêm",
            transport: "Xe máy",
            max_guest: "90",
            start_date: "09/09/2025"
        },
        {
            cover_image: `${API_URL}/uploads/1745472098120-963422392.jpg`,
            name:"Tour 1",
            duration: "2 ngày 1 đêm",
            transport: "Xe máy",
            max_guest: "90",
            start_date: "09/09/2025"
        },
        {
            cover_image: `${API_URL}/uploads/1745472098120-963422392.jpg`,
            name:"Tour 1",
            duration: "2 ngày 1 đêm",
            transport: "Xe máy",
            max_guest: "90",
            start_date: "09/09/2025"
        },
        {
            cover_image: `${API_URL}/uploads/1745472098120-963422392.jpg`,
            name:"Tour 1",
            duration: "2 ngày 1 đêm",
            transport: "Xe máy",
            max_guest: "90",
            start_date: "09/09/2025"
        },
        {
            cover_image: `${API_URL}/uploads/1745472098120-963422392.jpg`,
            name:"Tour 1",
            duration: "2 ngày 1 đêm",
            transport: "Xe máy",
            max_guest: "90",
            start_date: "09/09/2025"
        },
        {
            cover_image: `${API_URL}/uploads/1745472098120-963422392.jpg`,
            name:"Tour 1",
            duration: "2 ngày 1 đêm",
            transport: "Xe máy",
            max_guest: "90",
            start_date: "09/09/2025"
        }
    ]
    return (
        <div className="bookingPage" ref={bookingPageRef}>
            <Navbar bookingPageRef={bookingPageRef}/>
            <Container className="bookingContent"  >
                <Row>
                    <Col md={9} className="bookingContent-left">
                        <h1>Du lịch Đà Lạt - Samten Hills - Puppy Farm - Langbiang - Gallery La Chocotea - Thác Bobla</h1>
                        <div className="d-flex align-items-center mb-3">
                            <span className="me-2">Đà Lạt</span>
                            <span className="text-warning">★★★★★</span>
                            <span className="ms-2 text-muted">(348 đánh giá)</span>
                        </div>
                        <Container className="mb-4 p-0">
                            {/* Hình ảnh chính */}
                            <Row className="">
                                <img
                                    src="https://i.imgur.com/e2UnpdB.jpg"
                                    alt="Main Tour"
                                    style={{ width: '90%'}}
                                />
                            </Row>
                            {/* Hình ảnh phụ */}
                            <Row className="d-flex flex-wrap">
                                {[...Array(4)].map((_, index) => (
                                    <img
                                    key={index}
                                    src="https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt={`Thumbnail ${index + 1}`}
                                    className="img-fluid rounded m-1"
                                    style={{ width: '15%' }}
                                    />
                                ))}
                            </Row>
                        </Container>
                        <TourInforCard />
                        {/* Thông tin bổ sung */}
                        <div className="mt-4">
                            <h3 className="section-title">Tour Này Có Gì Hay!</h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem qui enim porro consectetur sequi aliquid quae mollitia quibusdam, tenetur doloribus. Placeat sequi distinctio voluptatem natus illo libero dolor ratione amet!
                            </p>
                        </div>

                        <hr className="my-4"></hr>
                        {/* Thông tin lịch trình */}    
                        <h3 className="section-title">Lịch Trình</h3>
                        <TourSchedule />

                        <hr className="my-4"></hr>

                        <h3 className="section-title">Những lưu ý khi đặt tour</h3>
                        <ul>
                            <li>Giá tour không bao gồm chi phí ăn uống cá nhân</li>
                            <li>Nếu hủy hoặc chuyển sang các tuyến du lịch khác trước ngày khởi hành 20: Không mất chi phí.</li>
                            <li>Nếu chương trình du lịch bị hủy bỏ hoặc thay đổi bởi một trong hai bên vì một lý do bất khả kháng như hỏa hoạn, thời tiết, tai nạn, thiên tai, chiến tranh, dịch bệnh, hoãn, dời, hủy chuyến hoặc thay đổi khác của các phương tiện vận chuyển công cộng hoặc các sự kiện bất khả kháng khác theo quy định pháp luật …), thì Vietravel sẽ không chịu bất kỳ nghĩa vụ bồi hoàn các tổn thất đã xảy ra và không chịu bất kỳ trách nhiệm pháp lý nào.</li>
                        </ul>

                        <hr className="my-4"></hr>

                        <h3 className="section-title">Đánh giá của du khách</h3>
                        <ReviewSection />

                        {/* <hr className="my-4"></hr> */}

                     
                    </Col>
                    <Col md={3} className="booking-card" >
                        <Card className="booking-card-sticky ">
                            <Card.Header><span style={{fontWeight: 'bold', fontSize: '20px'}}>Booking</span></Card.Header>
                            <Card.Body>
                                <h6>Giá</h6>
                                <h4 className="text-danger text-center fw-bold">4.129.000 đ <span style={{fontWeight: 'bold', color: "black", fontSize: '15px'}}>/ Khách</span></h4>
                                <Card.Text as="div">
                                     <Button variant="custom-primary" className="mb-2 w-100">Đặt Tour</Button>
                                </Card.Text>
                                <Card.Text>
                                    <Button variant="custom-secondary" className="mb-2 w-100">
                                        <span role="img" aria-label="heart"></span><FaRegHeart /> Thêm Vào Yêu Thích
                                    </Button>
                                </Card.Text>
                                <Card.Text>
                                    <Button variant="custom-secondary" className="mb-2 w-100"><RiShareForwardLine /> Liên Hệ Tư Vấn</Button>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                
                <div className='my-md-5'>
                    <h2 className="tour-relevant py-md-3 text-center">Các tour liên quan</h2>
                    <Container className="tourlist-container">
                        <Row className="custom-row g-3" xs={1} sm={2} md={3} xl={3} xxl={4}>
                        {tours.map((tour) => (
                            <Col key={tour.tour_id} className="custom-col">
                            <TourCard {...tour} />
                            </Col>
                        ))}
                        </Row>
                        {/* <div className="show-all-container">
                        <ShowAllButton />
                        </div> */}
                    </Container>
                </div>
            </Container>
            

            

            {/* <Container className="tour-relevant" >
                <h3 className="section-title">Các tour liên quan</h3>
                <TourList tours={tours}/>
            </Container> */}
            
            <Footer />
        </div>
    );
}

export default BookingTour;