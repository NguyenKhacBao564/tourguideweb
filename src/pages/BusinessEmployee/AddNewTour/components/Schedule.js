import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin2Fill } from "react-icons/ri";
import "./Schedule.scss";

function Schedule(props) {

    const {schedule} = props;

    return ( 
             
        <Container className="schedule mt-3">
          <GiHamburgerMenu size={30} className="schedule-icon"/>
          <Container className="schedule-content">
          <p className="day">Ngày {schedule.day_number}</p>
          <p className="schedule-content-name">{schedule.tour_route}</p>
          <Button variant="light" className="bg-white" ><AiFillEdit size={30} color="#F49B33"/></Button>
          <Button variant="danger" className="bg-white"><RiDeleteBin2Fill size={30} color="#EB5757"/></Button>
          </Container>
        </Container>
    );
}

export default Schedule;