import React, { useState, useEffect, useContext} from 'react';
import { Table, Container, Button } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import './DataTable.scss';
import { TourContext } from "../../context/TourContext";

function TourTable(props) {
const { filterStatus } = props;
const { tours, isLoading, error, deleteTour } = useContext(TourContext);
const [selectedTour, setSelectedTour] = useState([]);
const [selectedAll, setSelectedAll] = useState(false);

 
  const filteredTours = tours.filter((tour) => {
      const today = new Date();
      const startDate = new Date(tour.start_date);
  
      switch (filterStatus) {
        case "all":
          return true; // Hiển thị tất cả tour
        case "sapKhoiHanh":
          // Sắp khởi hành: Ngày khởi hành trong tương lai gần (ví dụ: 7 ngày tới)
          return startDate > today && startDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        case "dangKhoiHanh":
          // Đang khởi hành: Ngày khởi hành là hôm nay
          return startDate.toDateString() === today.toDateString();
        case "daHoanThanh":
          // Đã hoàn thành: Ngày khởi hành đã qua
          return startDate < today;
        case "chuaKhoiHanh":
          // Chưa khởi hành: Ngày khởi hành còn xa (hơn 7 ngày)
          return startDate > new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        default:
          return true;
      }
    });

    const [currentPage, setCurrentPage] = useState(1);
    const toursPerPage = 10;
    
    const indexOfLastTour = currentPage * toursPerPage;
    const indexOfFirstTour = indexOfLastTour - toursPerPage;
    const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
    
    const totalPages = Math.ceil(filteredTours.length / toursPerPage);
    
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
    
    useEffect(() => {
      setSelectedAll(tours.length > 0 && selectedTour.length === tours.length);
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


  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tour này không?")) {
      try {
        await deleteTour(id); // Gọi deleteTour từ context
        setSelectedTour((prev) => prev.filter((tourId) => tourId !== id));
      } catch (err) {
        console.error("Lỗi khi xóa tour:", err);
      }
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
          ) : currentTours.length === 0 ? (
            <tr>
              <td colSpan="7">Không có tour nào để hiển thị.</td>
            </tr>
          ) : (
            currentTours.map((tour) => (
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
                    <Button variant="danger" size="sm" onClick={()=> handleDelete(tour.tour_id)}>Khóa</Button>
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
      <div className="pagination d-flex justify-content-center mt-3">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "primary" : "outline-primary"}
            onClick={() => handlePageChange(page)}
            className="mx-1"
          >
            {page}
          </Button>
        ))}
        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </Container>
  );
}

export default TourTable;