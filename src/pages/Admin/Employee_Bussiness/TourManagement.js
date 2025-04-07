import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";
import AddTourArea from "../../../components/AddTourArea/AddTourArea";
import { Row, Col } from "react-bootstrap";
import TourFilterAdmin from "../../../components/TourFilter_Admin/TourFilterAdmin";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import TourTable from "../../../components/TourTable/TourTable";

const TourManagement = () => {
  
  const [filterType, setFilterType] = useState("");
  
  const handleClick = () => {
    setFilterType("num");
  }

  return (
    <Container fluid className="tour-management">
      <Row className="tour-management__filter">
        <TourFilterAdmin />
      </Row>
      <Row>
        <Button onClick={()=>{handleClick()}}>tour filter</Button>
      </Row>
      <Row>
        <TourTable filterType={filterType}/>
      </Row>
    </Container>
  );
};

export default TourManagement;
