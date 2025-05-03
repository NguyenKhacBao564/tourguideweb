
// src/pages/Admin/StaffManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDataTable from '../../components/Admin/adminDataTable';
import { getEmployees, lockEmployees } from '../../api/adminAPI';

const roleMap = {
  1: 'Quản lý',
  2: 'Nhân viên kinh doanh',
  3: 'Nhân viên tư vấn',
};

const StaffManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  // 1. Lấy dữ liệu từ server
  useEffect(() => {
    const fetchEmployees = async () => {
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
    fetchEmployees();
  }, [page]);

  // 2. Tính danh sách filter options (role_id có trong data)
  const roleOptions = React.useMemo(() => {
    return Array.from(new Set(employees.map(e => e.role_id)));
  }, [employees]);

  const branchOptions = React.useMemo(() => {
    return Array.from(new Set(employees.map(e => e.branch_name)));
  },   [employees]);
  // 3. Áp dụng filter & tìm kiếm trên client
  useEffect(() => {
    let data = employees;

    // lọc theo role nếu có chọn
    if (roleFilter) {
      data = data.filter(e => e.role_id === Number(roleFilter));
    }
    // lọc theo branch nếu có chọn
    if (branchFilter) {
      data = data.filter(e => e.branch_name === branchFilter);
    }
    // lọc theo searchTerm: kiểm tra cả emp_id và fullname
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      data = data.filter(
        e =>
          e.emp_id.toLowerCase().includes(term) ||
          e.fullname.toLowerCase().includes(term)
      );
    }

    setFiltered(data);
  }, [employees, searchTerm, roleFilter, branchFilter]);

  // Khóa các nhân viên đã chọn
  const handleLockSelected = async () => {
    try {
      await lockEmployees(selectedRowKeys);        // gọi API bulk-lock
      setSelectedRowKeys([]);                      // reset selection
      setPage(1);                                  // quay về trang 1 (tuỳ chọn)
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi khóa nhân viên');
    }
  };
  // 4. Column định nghĩa cho AdminDataTable
  const columns = [
    
    { header: 'ID nhân viên',   accessor: 'emp_id'    },
    { header: 'Tên nhân viên',  accessor: 'fullname'  },
    { header: 'Quyền hạn',        accessor: 'role_id',    render: row => roleMap[row.role_id] || '—'   },
    { header: 'Chi nhánh',      accessor: 'branch_name' },
    { header: 'Trạng thái',     accessor: 'em_status' },
    {
      header: '',
      accessor: 'actions',
      render: row => (
        <div>
          <button 
            className="btn btn-sm btn-primary me-2" 
            onClick={() => navigate(`./${row.emp_id}`)}>Sửa</button>
          <button 
            className="btn btn-sm btn-danger" 
            onClick={() => console.log('Khoá', row.emp_id)}>Khoá</button>
        </div>
      )
    },
  ];

  return (
    <div>
      <h2>Quản lý nhân viên</h2>
      
      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Tìm theo ID hoặc tên..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          {roleOptions.map(rid => (
            <option key={rid} value={rid}>
              {roleMap[rid]}
            </option>
          ))}
        </select>

        <select
          value={branchFilter}
          onChange={e => setBranchFilter(e.target.value)}
        >  
          <option value="">Tất cả chi nhánh</option>
          {branchOptions.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>  
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={handleLockSelected}
            disabled={!selectedRowKeys.length}
          >
            Khóa đã chọn ({selectedRowKeys.length})
          </button>
          <button
            onClick={() => setSelectedRowKeys([])}
            style={{ marginLeft: 8 }}
          >Bỏ chọn</button>
        </div>
        <button className="btn btn-success me-2"
          onClick={() => navigate('addNewEmployee')}>
          Thêm nhân viên
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <AdminDataTable
        columns={columns}
        data={filtered}
        loading={loading}
        totalItems={total}
        currentPage={page}
        itemsPerPage={10}
        onPageChange={setPage}
        // Truyền rowSelection vào
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys        
        }}
      />
    </div>
  );
};

export default StaffManagement;
