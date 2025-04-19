import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UserFilterEmployee from '../../components/Employee/Filter/UserFilterEmployee';
import { TourProvider } from '../../context/TourContext';
import DataTable from '../../components/Common/DataTable/DataTable';

function UserManagement(props) {
    const [status, setStatus] = useState("all");


  const handleStatusFilterChange = (filter) => {
    setStatus(filter);
    console.log("Lọc theo trạng thái:", filter);
  };
    return (
    <Container fluid className="tour-management">
      <Row className="tour-management__filter">
        <UserFilterEmployee />
      </Row>
      <Row>
        <TourProvider>
        <DataTable filterStatus={status}/>
        </TourProvider>
      </Row>
    </Container>
    );
}

export default UserManagement;