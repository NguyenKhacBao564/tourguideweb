import { useState, useContext, useMemo } from "react";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import TourFilterEmployee from "../../components/Employee/Filter/TourFilterEmployee";
import DataTable from "../../components/Common/DataTable/DataTable";
import { TourContext } from "../../context/TourContext";
import StatusFilterEmployee from "../../components/Employee/StatusFilter_Employee/StatusFilterEmployee";
import { useNavigate } from "react-router-dom";

import { 
  filterToursByStatus, 
  filterToursBySearchTerm, 
  sortToursByAvailability, 
  combineFilters, 
  FILTER_KEYS 
} from "../../utils/tourFilterHelpers";

const TourManagementEmp = () => {
  const navigate = useNavigate();
  const { tours, isLoading, error, blockTour } = useContext(TourContext);
  console.log('tours', tours);
  // Các trạng thái lọc và sắp xếp
  const [statusFilter, setStatusFilter] = useState(FILTER_KEYS.ALL);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedTour, setSelectedTour] = useState([]);

  // Columns cho bảng
  const columns = [
    { key: 'tour_id', label: 'Mã tour' },
    { key: 'name', label: 'Tên tour' },
    { key: 'max_guests', label: 'Chổ trống' },
    { key: 'start_date', label: 'Ngày khởi hành' },
    { key: 'end_date', label: 'Ngày trở về' },
  ];

  // Định nghĩa các hành động (button) cho mỗi cột trong bảng
  const actions = [
    {
      label: 'Khóa',
      variant: 'danger',
      onClick: async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn khóa tour này không?')) {
          try {
            await blockTour(id);
            setSelectedTour((prev) => prev.filter((tourId) => tourId !== id));
          } catch (err) {
            console.error('Lỗi khi khóa tour:', err);
          }
        }
      },
    },
    {
      label: 'Chi tiết',
      variant: 'success',
      onClick: (id, tourDetail) => {
        // Ensure price fields are properly formatted as strings
        const formattedTour = {
          ...tourDetail,
        };
        
        navigate("/businessemployee/managetour/addtour", {
          state: { tourDetail: formattedTour }
        });
      },
    },
  ];

  // Xử lý lọc và sắp xếp dữ liệu
  const filteredAndSortedTours = useMemo(() => {
    // Kết hợp các bộ lọc
    const combinedFilter = combineFilters(
      filterToursByStatus(statusFilter),
      filterToursBySearchTerm(searchTerm)
    );
    // Áp dụng bộ lọc
    let result = tours.filter(combinedFilter); 
    // Áp dụng sắp xếp nếu có
    if (sortOrder) {
      result = [...result].sort(sortToursByAvailability(sortOrder));
    } 
    return result;
  }, [tours, statusFilter, searchTerm, sortOrder]);

  // Handlers for filters
  const handleStatusFilterChange = (filter) => {
    setStatusFilter(filter);
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const handleSort = (order) => {
    setSortOrder(order);
  };
  
  const handleDeleteSelected = async (ids) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} tour đã chọn không?`)) {
      try {
        // Xóa lần lượt các tour đã chọn
        for (const id of ids) {
          await blockTour(id);
        }
        setSelectedTour([]);
      } catch (err) {
        console.error('Lỗi khi khóa tour:', err);
      }
    }
  };

  return (
    <Container fluid className="tour-management">
      <Row>
        <TourFilterEmployee 
          onSearch={handleSearch}
          onSort={handleSort}
          onDeleteSelected={handleDeleteSelected}
          selectedItems={selectedTour}
          searchPlaceholder="Tìm kiếm theo tên hoặc mã tour"
        />
      </Row>
      <Row>
        <StatusFilterEmployee onFilterChange={handleStatusFilterChange}/>
      </Row>
      <Row>
        <DataTable 
          data={filteredAndSortedTours}
          columns={columns}
          actions={actions}
          onFilter={() => true} // Filters are applied before passing to DataTable
          itemsPerPage={12}
          isLoading={isLoading}
          error={error ? error.message : null}
          selectedItems={selectedTour}
          onSelectChange={setSelectedTour}
          idKey="tour_id"/>
      </Row>
    </Container>
  );
};

export default TourManagementEmp;
