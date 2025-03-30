import React, {useEffect} from 'react';


import TourCard from "../TourCard/TourCard"; 
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import ShowAllButton from '../Button/ShowAllButton';
import './TourList.scss';
function Tourlist(props) {
    const [tours, setTours] = React.useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/tours")
          .then((res) => setTours(res.data))
          .catch((err) => console.error(err));
      }, []);
   
    return (
        <div className='tourlist'>
        <Container>
                <Row className="g-4">
                    {tours.map(tour => (
                        <Col key={tour.tour_id} xs={12} sm={6} md={6} lg={4} xl={4} xxl={3} style={{ display: "flex", justifyContent: "center"}}> 
                            <TourCard {...tour} />
                        </Col>
                    ))}
                </Row>
                <div className="show-all-container">
                    <ShowAllButton/>
                </div>
        </Container>
        
        </div>
    );
}

export default Tourlist;