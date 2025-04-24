import React, { useState, useEffect } from 'react';
import AdminDataTable from '../../components/Admin/adminDataTable';
import { getTour } from '../../api/adminAPI';

const TourManagement = () => {
  const [tours, setTours]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(false);
  const [page, setPage]         = useState(1);
  const pageSize                = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // API trả về { tours, total }
        const { tours: fetchedTours, total: fetchedTotal } = await getTour({ page, pageSize });
        setTours(fetchedTours);
        setTotal(fetchedTotal);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách tour:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleApprove = row => {
    console.log('Duyệt tour', row.tour_id);
    // TODO: gọi API duyệt
  };
  const handleReject = row => {
    console.log('Từ chối tour', row.tour_id);
    // TODO: gọi API từ chối
  };

  const columns = [
    { header: 'Mã tour', accessor: 'tour_id' },
    { header: 'Tên tour', accessor: 'name' },
    { header: 'Địa điểm', accessor: 'destination' },
    {
      header: 'Thời điểm tạo',
      accessor: 'created_at',
      render: row => new Date(row.created_at).toLocaleDateString()
    },
    {
      header: 'Ngày khởi hành',
      accessor: 'start_date',
      render: row => new Date(row.start_date).toLocaleDateString()
    },
    {
      header: 'Thao tác',
      accessor: 'actions',
      render: row => (
        <>
          <button
            className="btn btn-sm btn-success me-2"
            onClick={() => handleApprove(row)}
          >
            Duyệt
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleReject(row)}
          >
            Từ chối
          </button>
        </>
      )
    }
  ];

  return (
    <div className="p-4">
      <h2>Quản lý tour</h2>
      <AdminDataTable
        columns={columns}
        data={tours}
        loading={loading}
        totalItems={total}
        currentPage={page}
        itemsPerPage={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
};

export default TourManagement;
