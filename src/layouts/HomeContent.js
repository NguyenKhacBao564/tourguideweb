import React, { useState, useContext, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import '../styles/layouts/MainContent.scss';
import Tourlist from '../components/TourList/Tourlist';
import Touroutstanding from './Touroutstanding';
import Slider from "react-slick";
import { TourProvider } from "../context/TourContext";
import StatsOverview from './StatOverview';
import provinceFilter from '../utils/provinceFilter'; // Nhập categories từ file utility
import { TourContext } from '../context/TourContext';


function Maincontent() {
  const { getTourByProvince, getTourOutstanding } = useContext(TourContext);
  const [index, setIndex] = useState(0);
  const [toursByProvince, setToursByProvince] = useState([]);
  const [toursOutstanding, setToursOutstanding] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const toursByProvince = await getTourByProvince(provinceFilter[index].name);
        setToursByProvince(toursByProvince);
        const toursOutstanding = await getTourOutstanding();
        setToursOutstanding(toursOutstanding);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTours();
  }, [index]);
  

  return (
    <div className='maincontent'>
      <div className="header-section"> 
        <h1>Khám phá những hành trình mới</h1>
        <p>Hãy để mỗi chuyến đi trở thành một câu chuyện đáng nhớ. Trải nghiệm du lịch tuyệt vời với dịch vụ chất lượng và điểm đến hấp dẫn</p>
      </div>
      
      <div className="list-provinces">
        {provinceFilter.map((province, idx) => (
          <button 
            key={idx} 
            className={`province-btn ${idx === index ? 'active' : ''}`}
            onClick={() => setIndex(idx)}
          >
            {province.name}
          </button>
        ))}
      </div>
      
      <Carousel className='province-detail' activeIndex={index} onSelect={setIndex} interval={null}>
        {provinceFilter.map((item, idx) => (
          <Carousel.Item key={idx}>
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
        <Tourlist tours={toursByProvince} loading={loading} error={error} />
        <Touroutstanding tours={toursOutstanding} loading={loading} error={error} />
      <StatsOverview />
    </div>
  );
}

export default Maincontent;