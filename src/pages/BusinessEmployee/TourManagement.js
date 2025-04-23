import { useState } from "react";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import TourFilterEmployee from "../../components/Employee/Filter/TourFilterEmployee";
import DataTable from "../../components/Common/DataTable/DataTable";

import { TourProvider } from "../../context/TourContext";
import TourStatusFilterEmployee from "../../components/Employee/TourStatusFilter_Employee/TourStatusFilterEmployee";

const TourManagementEmp = () => {


  const [status, setStatus] = useState("all");


  const handleStatusFilterChange = (filter) => {
    setStatus(filter);
    console.log("Lọc theo trạng thái:", filter);
  };
  return (
    <Container fluid className="tour-management">
      <Row>
        <TourFilterEmployee />
      </Row>
      <Row>
        <TourStatusFilterEmployee onFilterChange={handleStatusFilterChange} />
      </Row>
      <Row>
        <TourProvider>
          <DataTable filterStatus={status} />
        </TourProvider>
      </Row>
    </Container>
  );
};


export default TourManagementEmp;
