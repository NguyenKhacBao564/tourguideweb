import React, {useRef} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import FilterTourCard from '../../components/FilterTourCard/FilterTourCard';
import NavBar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import TourCardHorizon from '../../components/Common/TourCard/TourCardHorizon';
import "../../styles/pages/FindTourContainer.scss";
import DropDownButton from '../../components/Common/DropDown/DropDownButton';


function FindTour(props) {
    const findTourPageRef = useRef(null);

    const dropDownItems = [
        {name: "Mới nhất", link: "#"},
        {name: "Cũ nhất", link: "#"},
        {name: "Giá thấp đến cao", link: "#"},
        {name: "Giá cao đến thấp", link: "#"},
    ]

    console.log("FindTour component rendered");
    return (
        <div className="findTour_Page" ref={findTourPageRef}>
            <NavBar pageRef={findTourPageRef}/>
            <Container className="findTour_Container">
                <Row className="mb-3"> 
                    <Col md={3}>Tìm kiếm tour</Col>  
                    <Col className="flex justify-content-between" md={9}>
                        <h2>42 Tour Được tìm thấy</h2>
                        <div className="sort_Area flex"> 
                            <p className="sort-text">Sắp xếp theo:</p>
                            <DropDownButton className="dropDown_Sort" title="Xếp theo" dropitem={dropDownItems} /> 
                        </div> 
                    </Col>

                </Row>
                <Row>
                    <Col md={3}>
                    <div className="filter-tour-card">
                        <FilterTourCard />
                    </div>
                    </Col>
                    <Col md={9}>
                        {[1,2,3,4,5].map((item, index) => (
                            <Row key={index} style={{marginBottom: '20px'}}>
                                <TourCardHorizon />
                            </Row>
                        ))}
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
}

export default FindTour;