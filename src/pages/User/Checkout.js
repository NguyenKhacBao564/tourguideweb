import React from 'react';
import { Container } from 'react-bootstrap';
import {Row, Col} from 'react-bootstrap';
import NavBar from '../../layouts/Navbar';
import "../../styles/pages/Checkout.scss";

function Checkout(props) {
    return (
        <div>
        <NavBar />
        <Container className="checkout-container" fluid>
            <Row>
                <h1>THANH TOÁN</h1>
            </Row>

            <Row>
                <Col></Col>
                <Col></Col>
            </Row>


        </Container>
        </div>
    );
}

export default Checkout;