import React, { useState } from 'react';
import "./FilterTourCard.scss";
import { Container, Row, Col } from 'react-bootstrap';
import {provinceList} from "../../utils/provinceList"
import Dropdown from 'react-bootstrap/Dropdown';



function FilterTourCard(props) {
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState("Chọn tỉnh");
    const [selectedDestination, setSelectedDestination] = useState("Chọn điểm đến");

    const [values, setValues] = useState({
        budget: '',
        province: '',
        destination: '',
        date: ''
    });

    console.log("Value: ", values);
    const handleBudgetSelect = (budget) => {
        setValues({ ...values, budget: budget === values.budget ? '' : budget });
    };

    const handleValueChange = (field, value) => {
        setValues({ ...values, [field]: value });
    };


    console.log("selectedBudget:", values.budget);
    console.log("province:" ,provinceList);

    return (
        <Container className="filterTour_card">
            <Row>
                <h3>Bộ lọc tìm kiếm</h3>
            </Row>
            <Row className="filter-section">
                <Row>
                    <p>Ngân sách</p>
                </Row>
                <Row className="mx-auto">
                    <Col md={6} >
                        <Row>
                            <p
                                className={`budget-option ${values.budget === 'under5' ? 'selected' : ''}`}
                                name="under5"
                                value="under5"
                                onClick={() => handleBudgetSelect('under5')}
                            >
                                Dưới 5 Triệu
                            </p>
                        </Row>
                        <Row>
                            <p
                                className={`budget-option ${values.budget === '10-20' ? 'selected' : ''}`}
                                onClick={() => handleBudgetSelect('10-20')}
                            >
                                Từ 10 - 20 Triệu
                            </p>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <p
                                className={`budget-option ${values.budget === '5-10' ? 'selected' : ''}`}
                                onClick={() => handleBudgetSelect('5-10')}
                            >
                                Từ 5 - 10 Triệu
                            </p>
                        </Row>
                        <Row>
                            <p
                                className={`budget-option ${values.budget === 'over20' ? 'selected' : ''}`}
                                onClick={() => handleBudgetSelect('over20')}
                            >
                                Trên 20 Triệu
                            </p>
                        </Row>
                    </Col>
                </Row>
            </Row>
            <Row className="filter-section">
                <Row>
                    <p>Điểm Khởi Hành</p>
                </Row>
                <Row className="mx-auto">
                    <Dropdown  onSelect={(selected) => handleValueChange('province', selected)}>
                        <Dropdown.Toggle >
                            {values.province || "Tất cả"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="custom-dropdown-menu">
                            {provinceList.map((province, index) => (
                            <Dropdown.Item key={index} eventKey={province.value}>
                                {province.value}
                            </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Row>
            </Row>
            <Row className="filter-section">
                <Row>
                    <p>Điểm Đến</p>
                </Row>
                <Row className="mx-auto">
                    <Dropdown onSelect={(selected) => handleValueChange('destination', selected)}>
                        <Dropdown.Toggle variant="success" >
                             {values.destination || "Tất cả"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {provinceList.map((province, index) => (
                            <Dropdown.Item key={index} eventKey={province.value}>
                                {province.value}
                            </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Row>
            </Row>
            <Row className="filter-section">
                <Row>
                    <p>Ngày Đi</p>
                </Row>
                <Row className="mx-auto">
                        <input type="date" className="date-input" 
                            value={values.date} 
                            onChange={(e) => handleValueChange('date', e.target.value)}
                            defaultValue="2021-12-10" 
                        />
                </Row>
            </Row>
            <Row>
                <Col>
                    <button className="apply-button btn fz-16">Áp Dụng</button>
                </Col>
            </Row>
        </Container>
    );
}

export default FilterTourCard;