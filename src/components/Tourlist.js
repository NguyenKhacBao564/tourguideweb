import React, {useEffect} from 'react';
import Tourcard from './Tourcard';
import TourList from '../assets/styles/components/TourList.scss';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import ShowAllButton from './ShowAllButton';

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
                        <Col key={tour.id} xs={12} sm={6} md={6} lg={4} xl={4} xxl={3} style={{ display: "flex", justifyContent: "center"}}> 
                            <Tourcard {...tour} />
                        </Col>
                    ))}
                </Row>
                <div className="show-all-container">
                    <ShowAllButton />
                </div>
        </Container>
        
        </div>
    );
}

export default Tourlist;