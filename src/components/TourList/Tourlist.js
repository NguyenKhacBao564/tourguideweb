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
        <Container className="tourlist-container"  fluid>
                <Row className="custom-row g-3" xs={1} sm={2} md={3} xl={4} xxl={5} >
                    {tours.map(tour => (
                        <Col key={tour.tour_id} className="custom-col" > 
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