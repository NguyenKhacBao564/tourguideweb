import React, {use, useRef, useState, useEffect} from 'react';
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
import { getTourImages} from '../../api/imageAPI';
import { getTourById } from '../../api/tourAPI';
import {getItinerary} from '../../api/scheduleAPI';
import { formatPrice } from '../../feature/formatPrice';

function BookingTour(props) {
    const bookingPageRef = useRef(null); // Tạo ref cho .bookingPage để sử dụng trong Navbar
    const [searchParams] = useSearchParams();
    const tourId = searchParams.get('id');
    const [isLoading, setIsLoading] = useState(true);
    console.log("Tour ID:", tourId); // Kiểm tra giá trị tourId
    const [imageIndex, setImageIndex] = useState(0);
    const [images, setImages] = useState([]); // Lưu trữ hình ảnh của tour

    const [tour, setTour] = useState({});
    const [schedules, setSchedules] = useState([]);



    useEffect(() => {
        const fetchTour = async () => {
            setIsLoading(true);
            console.log("is loading...")
            const tourData = await getTourById(tourId);
            const scheduleData = await getItinerary(tourId);
            const imageData = await getTourImages(tourId);
            console.log("Image data:", imageData); // Kiểm tra dữ liệu hình ảnh
            setTour(tourData);
            setSchedules(scheduleData);
            setImages(imageData);
            console.log("Schedule data:", scheduleData); // Kiểm tra dữ liệu lịch trình
            console.log("get data success...")
            setIsLoading(false);
        };
        fetchTour();
        
    }, [tourId]);

    console.log("Tour data:", tour); // Kiểm tra dữ liệu tour

    // const images = [
    //     {
    //         src: "https://dulichtoday.vn/wp-content/uploads/2017/04/vinh-Ha-Long.jpg",
    //         alt: "Image 1",
    //     },
    //     {
    //         src: "https://dulichtoday.vn/wp-content/uploads/2017/04/vinh-Ha-Long.jpg",
    //         alt: "Image 2",
    //     },
    //     {
    //         src: "https://media.hanamtv.vn/upload/image/201708/medium/49847_Du-Lich_1-01.jpg",
    //         alt: "Image 3",
    //     },
    //     {
    //         src: "https://thoibaonganhang.vn/stores/news_dataimages/canhnq/042023/13/20/1419_du-lich-ninh-binh-721.jpg",
    //         alt: "Image 4",
    //     },
    //     {
    //         src: "https://images.vietnamtourism.gov.vn/vn/images/2020/Thang_9/_DSC3768.JPG",
    //         alt: "Image 5",
    //     }
    // ]

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
                        <h1>{tour.name}</h1>
                        <div className="d-flex align-items-center mb-3">
                            <span className="me-2">{tour.destination}</span>
                            <span className="text-warning">★★★★★</span>
                            <span className="ms-2 text-muted">(348 đánh giá)</span>
                        </div>
                        {/*Vùng hiển thị hình ảnh */}
                        <Container className="mb-4 p-0">
                            {/* Hình ảnh chính */}
                            <Row>
                                {!isLoading ? (
                                    <div className="main-image-container"><img
                                        src={`${API_URL}/${images[imageIndex].image_url}`}
                                        alt="Main Tour"
                                        className="main-image"
                                    /></div>
                                ) : (
                                    <div className="main-image-container">
                                      <p>Đang tải...</p>
                                    </div>
                                )}
                            </Row>
                            {/* Hình ảnh phụ */}
                            <Row className="d-flex flex-wrap pt-md-2">
                                {!isLoading && images.length === 0 ? (
                                    <div>No images available</div>
                                ) : (
                                    images.map((image, index) => (
                                        <img
                                        key={index}
                                        src={`${API_URL}/${image.image_url}`}
                                        alt={image.alt}
                                        onClick={() => setImageIndex(index)}
                                        className="thumbnail-image img-fluid rounded m-1"
                                        style={{ width: '15%' }}
                                        />
                                    ))
                                )}
                            </Row>
                        </Container>

                        <TourInforCard tour={tour} />
                        {/* Thông tin bổ sung */}
                        <div className="mt-4">
                            <h3 className="section-title">Tour Này Có Gì Hay!</h3>
                            <p>
                                {tour.description}
                            </p>
                        </div>

                        <hr className="my-4"></hr>
                        {/* Thông tin lịch trình */}    
                        <h3 className="section-title">Lịch Trình</h3>
                        <TourSchedule schedules={schedules} />

                        <hr className="my-4"></hr>

                        <h3 className="section-title">Những lưu ý khi đặt tour</h3>
                        <ul>
                            <li>Giá tour không bao gồm chi phí ăn uống cá nhân</li>
                            <li>Nếu hủy hoặc chuyển sang các tuyến du lịch khác trước ngày khởi hành 20: Không mất chi phí.</li>
                            <li>Nếu chương trình du lịch bị hủy bỏ hoặc thay đổi bởi một trong hai bên vì một lý do bất khả kháng như hỏa hoạn, thời tiết, tai nạn, thiên tai, chiến tranh, dịch bệnh, hoãn, dời, hủy chuyến hoặc thay đổi khác của các phương tiện vận chuyển công cộng hoặc các sự kiện bất khả kháng khác theo quy định pháp luật …), thì Vietravel sẽ không chịu bất kỳ nghĩa vụ bồi hoàn các tổn thất đã xảy ra và không chịu bất kỳ trách nhiệm pháp lý nào.</li>
                        </ul>

                        <hr className="my-4"></hr>

                        <h3 className="section-title">Đánh giá của du khách</h3>
                        <ReviewSection tour_id={tourId} />

                        {/* <hr className="my-4"></hr> */}

                     
                    </Col>
                    <Col md={3} className="booking-card" >
                        <Card className="booking-card-sticky ">
                            <Card.Header><span style={{fontWeight: 'bold', fontSize: '20px'}}>Booking</span></Card.Header>
                            <Card.Body>
                                <h6>Giá</h6>
                                <h4 className="text-danger text-center fw-bold">{formatPrice(tour.adultPrice)} đ<span style={{fontWeight: 'bold', color: "black", fontSize: '15px'}}>/ Khách</span></h4>
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