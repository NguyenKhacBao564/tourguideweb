import { useState } from "react";
import { Container } from "react-bootstrap";
<<<<<<< HEAD
import { Row } from "react-bootstrap";
import TourFilterEmployee from "../../components/TourFilter_Employee/TourFilterEmployee";
import DataTable from "../../components/DataTable/DataTable";
=======
import { Row} from "react-bootstrap";
import TourFilterEmployee from "../../components/Employee/Filter/TourFilterEmployee";
import DataTable from "../../components/Common/DataTable/DataTable";
>>>>>>> 72c24a91b735585caef8c4924f9eccabdbcf446a

import { TourProvider } from "../../context/TourContext";
import TourStatusFilterEmployee from "../../components/Employee/TourStatusFilter_Employee/TourStatusFilterEmployee";

const TourManagementEmp = () => {
<<<<<<< HEAD


  const [statusFilter, setStatusFilter] = useState("all");
=======
  
  
  const [status, setStatus] = useState("all");
>>>>>>> 72c24a91b735585caef8c4924f9eccabdbcf446a


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
<<<<<<< HEAD
          <DataTable filterStatus={statusFilter} />
=======
        <DataTable filterStatus={status}/>
>>>>>>> 72c24a91b735585caef8c4924f9eccabdbcf446a
        </TourProvider>
      </Row>
    </Container>
  );
};


export default TourManagementEmp;
