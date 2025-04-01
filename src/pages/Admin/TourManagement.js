import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";
import AddTourArea from "../../components/AddTourArea/AddTourArea";

const TourManagement = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/tours")
      .then(response => setTours(response.data))
      .catch(error => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tour này?")) {
      axios.delete(`http://localhost:5000/tours/${id}`)
        .then(() => {
          setTours(tours.filter(tour => tour.tour_id !== id)); 
        })
        .catch(error => console.error("Lỗi khi xóa người tour:", error));
    }
  };
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Quản lý tour</h2>
      <Table striped bordered hover responsive>
        <thead className="bg-light">
          <tr>
            <th>ID</th>
            <th>Tour Name</th>
            <th>Duration</th>
            <th>Transport</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour.tour_id}>
              <td>{tour.name}</td>
              <td>{tour.duration}</td>
              <td>{tour.transport}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(tour.tour_id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <AddTourArea />
      <Button variant="primary" href="/admin/tours/add">Thêm tour mới</Button>
    </Container>
  );
};

export default TourManagement;
