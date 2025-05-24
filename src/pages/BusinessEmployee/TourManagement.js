import { useState, useContext, useMemo, useCallback } from "react";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import TourFilterEmployee from "../../components/Employee/Filter/TourFilterEmployee";
import DataTable from "../../components/Common/DataTable/DataTable";
import { TourContext } from "../../context/TourContext";
import StatusFilterEmployee from "../../components/Employee/StatusFilter_Employee/StatusFilterEmployee";
import { useNavigate } from "react-router-dom";
import { getOccupancyFilters } from "../../utils/tourFilterHelpers";

import { 
  filterToursByStatus, 
  filterToursBySearchTerm, 
  sortToursByAvailability, 
  combineFilters, 
  FILTER_KEYS 
} from "../../utils/tourFilterHelpers";

const TourManagementEmp = () => {
  const navigate = useNavigate();
  const { tours, isLoading, error, blockTour, blockBatchTour } = useContext(TourContext);
  console.log('tours', tours);
  // Các trạng thái lọc và sắp xếp
  const [statusFilter, setStatusFilter] = useState(FILTER_KEYS.ALL);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedTour, setSelectedTour] = useState([]);
  const occupancyFilters = useCallback(getOccupancyFilters(), []);

  
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
        navigate("/businessemployee/managetour/addtour", {
          state: { tourDetail: tourDetail }
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
  
  const handleBlockSelected = async (ids) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} tour đã chọn không batch?`)) {
      try {
        const result = await blockBatchTour(ids);
        setSelectedTour([]);
      } catch (error) {
        console.error('Lỗi khi khóa tour:', error);
      }
    }
  };

  return (
    <Container fluid>
      <Row>
        <TourFilterEmployee 
          onSearch={handleSearch}
          onSort={handleSort}
          onBlockSelected={handleBlockSelected}
          selectedItems={selectedTour}
          searchPlaceholder="Tìm kiếm theo tên hoặc mã tour"
          occupancyFilters={occupancyFilters}
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
