import { useState, useContext, useEffect,useMemo, useCallback } from "react";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import TourFilterEmployee from "../../components/Employee/Filter/TourFilterEmployee";
import DataTable from "../../components/Common/DataTable/DataTable";
import { TourContext } from "../../context/TourContext";
import StatusFilterEmployee from "../../components/Employee/StatusFilter_Employee/StatusFilterEmployee";
import { useNavigate } from "react-router-dom";
import { getOccupancyFilters, sortToursByAvailability} from "../../utils/tourFilterHelpers";


const TourManagementEmp = () => {
  const navigate = useNavigate();
  const { tours, isLoading, error, fetchTours, blockTour, blockBatchTour } = useContext(TourContext);
  console.log('tours', tours);
  // Các trạng thái lọc và sắp xếp
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedTour, setSelectedTour] = useState([]); // Mảng chứa các tour đã chọn
  const occupancyFilters = useCallback(getOccupancyFilters(), []);
  const [filters, setFilters] = useState({
          status: 'all',
          search: '',
  });
  

  useEffect(() => {
    console.log("TourManagementEmp useEffect run");
    fetchTours(filters);
  }, [filters]);

  // Columns cho bảng
  const columns = [
    { key: 'tour_id', label: 'Mã tour' },
    { key: 'name', label: 'Tên tour' },
    { key: 'max_guests', label: 'Số chổ trống' },
    { key: 'start_date', label: 'Ngày khởi hành' },
    { key: 'end_date', label: 'Ngày trở về' },
    { key: 'status', label: 'Trạng thái' },
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
      condition: (item) => ['active', 'upcoming'].includes(item.status), // Chỉ cho phép khóa với status active hoặc upcoming
    },
    {
      label: 'Chi tiết',
      variant: 'success',
      onClick: (id, tourDetail) => {
        navigate("/businessemployee/managetour/addtour", {
          state: { tourDetail: tourDetail }
        });
      },
      // condition: (item) => ['active', 'upcoming'].includes(item.status), // Chỉ cho phép sửa với status active hoặc upcoming
    },
  ];



  // Sắp xếp tours bằng useMemo
  const sortedTours = useMemo(() => {
    if (!tours || tours.length === 0) return [];
    let result = [...tours];

    if (sortOrder) {
      console.log("Sorting tours by availability with order:", sortOrder);
      result = result.sort(sortToursByAvailability(sortOrder));
    }
    return result;
  }, [tours, sortOrder]);

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
  };
  
  const handleSort = (order) => {
    // if (order === sortOrder) return; // Không thay đổi nếu cùng thứ tự
    setSortOrder(order);
  };
  
  const handleBlockSelected = async (ids) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} tour đã chọn không batch?`)) {
      try {
        await blockBatchTour(ids);
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
          onSearch={handleFilterChange}
          onSort={handleSort}
          onBlockSelected={handleBlockSelected}
          selectedItems={selectedTour}
          searchPlaceholder="Tìm kiếm theo tên hoặc mã tour"
          occupancyFilters={occupancyFilters}
        />
      </Row>
      <Row>
        <StatusFilterEmployee onFilterChange={handleFilterChange} />
      </Row>
      <Row>
        <DataTable 
          data={sortedTours}
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
