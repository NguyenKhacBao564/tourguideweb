import { useState, useEffect } from "react";
import { Table, Container, Button } from "react-bootstrap";
import { Row} from "react-bootstrap";
import TourFilterAdmin from "../../../components/TourFilter_Admin/TourFilterAdmin";
import TourTable from "../../../components/TourTable/TourTable";

import { TourProvider } from "../../../context/TourContext";
import TourStatusFilter from "../../../components/TourStatusFilter_Admin/TourStatusFilter";

const TourManagement = () => {
  
  // const [filterType, setFilterType] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // const handleClick = (type) => {
  //   setFilterType(type);
  // }

  const handleStatusFilterChange = (filter) => {
    setStatusFilter(filter);
    console.log("Lọc theo trạng thái:", filter);
  };
  return (
    <Container fluid className="tour-management">
      <Row className="tour-management__filter">
        <TourFilterAdmin />
      </Row>
      <Row>
        <TourStatusFilter onFilterChange={handleStatusFilterChange}/>
      </Row>
      <Row>
        <TourProvider>
        <TourTable filterStatus={statusFilter}/>
        </TourProvider>
      </Row>
    </Container>
  );
};


export default TourManagement;
