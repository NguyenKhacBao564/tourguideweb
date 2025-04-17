import { useState } from "react";
import { Container } from "react-bootstrap";
import { Row} from "react-bootstrap";
import TourFilterEmployee from "../../components/TourFilter_Employee/TourFilterEmployee";
import DataTable from "../../components/DataTable/DataTable";

import { TourProvider } from "../../context/TourContext";
import TourStatusFilterEmployee from "../../components/TourStatusFilter_Employee/TourStatusFilterEmployee";

const TourManagementEmp = () => {
  
  
  const [statusFilter, setStatusFilter] = useState("all");


  const handleStatusFilterChange = (filter) => {
    setStatusFilter(filter);
    console.log("Lọc theo trạng thái:", filter);
  };
  return (
    <Container fluid className="tour-management">
      <Row className="tour-management__filter">
        <TourFilterEmployee />
      </Row>
      <Row>
        <TourStatusFilterEmployee onFilterChange={handleStatusFilterChange}/>
      </Row>
      <Row>
        <TourProvider>
        <DataTable filterStatus={statusFilter}/>
        </TourProvider>
      </Row>
    </Container>
  );
};


export default TourManagementEmp;
