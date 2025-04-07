import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import './TourTable.scss';

function TourTable(props) {

  const {filterType} = props;


  const [filerActive, setFilterActive] = useState(filterType);
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if(filterType === "") {
      setFilterActive(filterType);
    } else if(filterType === "num") {
      setTours(prev => prev.filter(tour => tour.max_guests === 90));
      setFilterActive(filterType);
    }}
  , [filterType]);

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:5000/tours")
      .then(response => {
        setTours(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedAll && selectedTour.length !== tours.length) {
      setSelectedAll(false);
    }
  }, [tours, selectedTour]);

  const handleSelectAll = () => {
    if (!selectedAll) {
      setSelectedTour(tours.map(tour => tour.tour_id));
      setSelectedAll(true);
    } else {
      setSelectedTour([]);
      setSelectedAll(false);
    }
  };

  const handleChangeTour = (id) => {
    setSelectedTour(prev =>
      prev.includes(id) ? prev.filter(tourId => tourId !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tour này?")) {
      axios.delete(`http://localhost:5000/tours/${id}`)
        .then(() => {
          setTours(tours.filter(tour => tour.tour_id !== id));
          setSelectedTour(selectedTour.filter(tourId => tourId !== id));
        })
        .catch(error => {
          console.error("Lỗi khi xóa tour:", error);
          // axios.get("http://localhost:5000/tours")
          //   .then(response => setTours(response.data));
          }
        );
    }
  };

  const handleViewDetail = (id) => {
    // Logic xem chi tiết tour, ví dụ: chuyển hướng hoặc mở modal
    console.log(`Xem chi tiết tour ${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày, thêm số 0 nếu cần
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (tháng bắt đầu từ 0, nên +1)
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <Container className="table-wrapper mt-4">
      <Table hover responsive borderless className="tour-management__table">
        <thead className="bg-light">
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                name="selectAll"
                id="selectAll"
                checked={selectedAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>Mã tour</th>
            <th>Tên tour</th>
            <th>Thời điểm tạo</th>
            <th>Số lượng chổ đã đặt</th>
            <th>Ngày khởi hành</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="7">Đang tải dữ liệu...</td>
            </tr>
          ) : tours.length === 0 ? (
            <tr>
              <td colSpan="7">Không có tour nào để hiển thị.</td>
            </tr>
          ) : (
            tours.map((tour) => (
              <tr key={tour.tour_id} className="tour-management__table-row align-middle">
                <td>
                  <Form.Check
                    type="checkbox"
                    name="selectedTour"
                    id={`tour-${tour.tour_id}`}
                    checked={selectedTour.includes(tour.tour_id)}
                    onChange={() => handleChangeTour(tour.tour_id)}
                  />
                </td>
                <td>{tour.tour_id}</td>
                <td>{tour.name}</td>
                <td>{formatDate(tour.created_at)}</td>
                <td>{tour.max_guests}</td>
                <td>{formatDate(tour.start_date)}</td>
                <td>
                  <ButtonGroup className="me-2" aria-label="First group">
                    <Button variant="danger" size="sm" onClick={() => handleDelete(tour.tour_id)}>Khóa</Button>
                  </ButtonGroup>
                  <ButtonGroup className="me-2" aria-label="Second group">
                    <Button variant="success" size="sm" onClick={() => handleViewDetail(tour.tour_id)}>Chi tiết</Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default TourTable;