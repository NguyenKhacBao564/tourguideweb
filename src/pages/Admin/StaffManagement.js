// src/pages/Admin/StaffManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDataTable from '../../components/Admin/adminDataTable';
import { getEmployees } from '../../api/adminAPI';

const StaffManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const navigate                = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { employees, total } = await getEmployees('active', page, 10);
        setEmployees(employees);
        setTotal(total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const columns = [
    { header: 'ID nhân viên', accessor: 'emp_id' },
    { header: 'Tên nhân viên', accessor: 'fullname' },
    { header: 'Vai trò', accessor: 'role_id' },
    { header: 'Chi nhánh', accessor: 'branch_id' },
    { header: 'Trạng thái', accessor: 'em_status' },
    {
      header: 'Thao tác',
      accessor: 'actions',
      render: (emp) => (
        <>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => navigate(`${emp.emp_id}`)}
          >
            Sửa
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => console.log('Khoá tài khoản', emp)}
          >
            Khoá
          </button>
        </>
      )
    }
  ];

  return (
    <div className="p-4">
      <h2>Quản lý nhân viên</h2>
      <div className="d-flex mb-3">
        <button
          className="btn btn-success me-2"
          onClick={() => navigate('addNewEmployee')}
        >
          Thêm nhân viên
        </button>
      </div>

      <AdminDataTable
        columns={columns}
        data={employees}
        loading={loading}
        totalItems={total}
        currentPage={page}
        itemsPerPage={10}
        onPageChange={setPage}
      />
    </div>
  );
};

export default StaffManagement;
