import React, {useEffect, useContext} from 'react';
import axios from "axios";
import TourCard from "../components/TourCard/TourCard"; 
import Slider from "react-slick";
import { TourContext } from "../context/TourContext";


import { SlArrowLeftCircle,SlArrowRightCircle } from "react-icons/sl";
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ 
        ...style, 
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        background: "#272727", 
        borderRadius: "50%", 
        width: "40px", 
        height: "40px",
       
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      <SlArrowRightCircle size={24} color="white" />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ 
        ...style, 
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        background: "#272727", 
        borderRadius: "50%", 
        width: "40px", 
        height: "40px",
        left: "-50px", 
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      <SlArrowLeftCircle size={24} color="white" />
    </div>
  );
}
function Touroutstanding(props) {
      const settings = {
        className: "center",
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 4,
        arrows: true,
        swipeToSlide: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        afterChange: function(index) {
          console.log(
            `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
          );
        }
      };

      const { tours, isLoading, error } = useContext(TourContext);
      if (isLoading) return <div className="loading">Đang tải...</div>;
      if (error) return <div className="error">Lỗi: {error.message}</div>;
    
      return (
        <div className="TourOutStanding_container p-20-10 mt-30">
          <h1 style={{color:"white"}} >Điểm đến nổi bật</h1>
        <Slider {...settings}>
          {tours.map(tour => (
            <div key={tour.id} xs={12} sm={6} md={6} lg={4} xl={4} xxl={3} style={{ display: "flex", justifyContent: "center"}}> 
                <TourCard key={tour.id} {...tour} className="Tourout" style={{ boxShadow: "none" }}/>
            </div>
          ))}
        </Slider>
        </div>
      );
}

export default Touroutstanding;