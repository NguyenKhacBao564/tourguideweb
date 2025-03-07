import React, {useEffect} from 'react';
import Tourcard from '../components/Tourcard';
// import tourdata from '../data/db';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
function Tourlist(props) {
    const [tours, setTours] = React.useState([]);

    // useEffect(() => {
    //     const fetchTours = async () => {
    //         const tourlist = await fetch('http://localhost:3004/tour');
    //         const data= await tourlist.json();
    //         // console.log(tourlist.json());
    //         setTours(data);
    //     }
    //     fetchTours();
        
    // }, []);
    useEffect(() => {
        axios.get("http://localhost:5000/tours")
          .then((res) => setTours(res.data))
          .catch((err) => console.error(err));
      }, []);

    
      
    return (
        <div className='tourlist'>
       <Container style={{ display: "flex", flexWrap: "wrap" }}>
            <Row className="g-3 flex" style={{ display: "flex", flexWrap: "wrap" }}>
                {tours.map(tour => (
                    <Col key={tour.id} xs={12} sm={6} md={4} lg={3}>
                        <Tourcard {...tour} />
                    </Col>
                ))}
            </Row>
        </Container>

        </div>
    );
}

export default Tourlist;