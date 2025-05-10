// src/pages/Admin/BranchManagement.js
// src/pages/Admin/BranchManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDataTable from '../../../components/Admin/adminDataTable';
import { getBranchStats } from '../../../api/adminAPI'; // bạn cần export hàm này từ adminAPI

const BranchManagement = () => {
  const [branches, setBranches]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const itemsPerPage              = 10;
  const navigate                  = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const data = await getBranchStats();
        setBranches(data);
      } catch (err) {
        console.error('Lỗi khi lấy thống kê chi nhánh:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const pagedData = branches.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const columns = [
    { header: 'Tên chi nhánh', accessor: 'branch_name' },
    { 
      header: 'Doanh thu', 
      accessor: 'revenue',
      render: row => `${row.revenue.toLocaleString('vi-VN')} VND`
    },
    { 
      header: 'Trạng thái', 
      accessor: 'status', 
    },
    { 
      header: 'SL tour', 
      accessor: 'total_tours' 
    },
    { 
      header: 'Tỷ lệ huỷ', 
      accessor: 'cancellation_rate',
      render: row => `${row.cancellation_rate}%`
    },
    {
      header: 'Thao tác',
      accessor: 'actions',
      render: row => (
        <button
          className="btn btn-sm btn-info"
          onClick={() => navigate(`/admin/branchManagement/${row.branch_id}`)}
        >
          Xem chi tiết
        </button>
      )
    }
  ];

  return (
    <div className="p-4">
      <h2>Quản lý chi nhánh</h2>
      <AdminDataTable
        columns={columns}
        data={pagedData}
        loading={loading}
        totalItems={branches.length}
        currentPage={page}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
      />
    </div>
  );
};

export default BranchManagement;
