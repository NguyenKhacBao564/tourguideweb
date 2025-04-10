import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import ShowAllButton from '../components/Button/ShowAllButton';
import '../styles/layouts/MainContent.scss';
// import AOS from 'aos';
// import 'aos/dist/aos.css'; // You can also use <link> for styles
import Tourlist from '../components/TourList/Tourlist';
import Touroutstanding from './Touroutstanding';
import Slider from "react-slick";    // ..
// AOS.init();
function Maincontent() {
    const [provinces] = useState(["Hà Nội", "Đồng Tháp", "Phú Yên", "Đà Lạt", "Bình Định", "Huế", "Quảng Trị", "Đà Nẵng"]);

    // Đưa categories trở lại
    const [categories] = useState([
        {
            name: "Hà Nội",
            image: "https://images.pexels.com/photos/11542516/pexels-photo-11542516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            description: "Hanoi is the capital of Vietnam and the country's second largest city by population. The city mostly lies on the right bank of the Red River.",
        },
        {
            name: "Đồng Tháp",
            image: "https://images.pexels.com/photos/11691122/pexels-photo-11691122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            description: "Đồng Tháp is a province in the Mekong Delta region of southern Vietnam. It shares its border with Cambodia to the west and is surrounded by Long An, Tien Giang, and Vinh Long provinces.",
        },
        {
            name: "Phú Yên",
            image: "https://images.pexels.com/photos/16303087/pexels-photo-16303087/free-photo-of-tuy-t-nha-c-a-lang-r-ng.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            description: "Phú Yên is a coastal province in central Vietnam, known for its stunning beaches and natural landscapes.",
        },
        {
            name: "Đà Lạt",
            image: "https://images.pexels.com/photos/1654259/pexels-photo-1654259.jpeg?auto=compress&cs=tinysrgb&w=800",
            description: "Đà Lạt is the city of eternal spring, famous for its pine forests, cool weather, and beautiful flower gardens.",
        },
        {
            name: "Bình Định",
            image: "https://images.pexels.com/photos/30406023/pexels-photo-30406023.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            description: "Bình Định is known for its martial arts tradition, beautiful beaches, and historical sites.",
        },
        {
            name: "Huế",
            image: "https://images.pexels.com/photos/11043267/pexels-photo-11043267.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load",
            description: "Huế is a historic city, home to the Imperial City, ancient pagodas, and the Perfume River.",
        },
        {
            name: "Quảng Trị",
            image: "https://images.pexels.com/photos/8383504/pexels-photo-8383504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            description: "Quảng Trị is a province with a rich history, known for its war memorials and natural landscapes.",
        },
        {
            name: "Đà Nẵng",
            image: "https://images.pexels.com/photos/20360871/pexels-photo-20360871/free-photo-of-l-nh-tuy-t-phong-c-nh-nha-c-a.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            description: "Đà Nẵng is a modern coastal city with beautiful beaches, the Dragon Bridge, and nearby attractions like Hội An and Bà Nà Hills.",
        }
    ]);

    const [index, setIndex] = useState(0);

    return (
        <div className='maincontent'>
            <div className="header-section">
                <h1>Khám phá những hành trình mới</h1>
                <p>Hãy để mỗi chuyến đi trở thành một câu chuyện đáng nhớ. Trải nghiệm du lịch tuyệt vời với dịch vụ chất lượng và điểm đến hấp dẫn</p>
            </div>

            <div className="list-provinces">
                {provinces.map((province, idx) => (
                    <button
                        key={idx}
                        className={`province-btn ${idx === index ? 'active' : ''}`}
                        onClick={() => setIndex(idx)}
                    >
                        {province}
                    </button>
                ))}
            </div>

            <Carousel className='province-detail' activeIndex={index} onSelect={setIndex}>
                {categories.map((item, idx) => (
                    <Carousel.Item key={idx} >
                        <img alt={item.name} src={item.image} className="province-img" />
                        <Carousel.Caption className='province-caption'>
                            <div className="province-info">
                                <div className="province-title">
                                    <h1>{item.name}</h1>
                                    <p>{item.description}</p>
                                </div>
                                <div className="cta-container">
                                    <button className="cta-button">Khám phá ngay</button>
                                </div>
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

            <h1 className="tourlist_Label">Các tour nổi bật</h1>
            <Tourlist />
            <Touroutstanding />
        </div>
    );
}
<div>
    <Touroutstanding />
</div >

export default Maincontent;
