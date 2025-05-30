// src/pages/BusinessEmployee/UserManagement.js
import React, { useState, useContext, useMemo} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CustomerFilterEmployee from '../../components/Employee/Filter/CustomerFilterEmployee';
import { TourProvider } from '../../context/TourContext';
import DataTable from '../../components/Common/DataTable/DataTable';
import { filterCustomerBySearchTerm } from '../../utils/customerFilterHelper';

import { CustomerContext } from '../../context/CustomerContext';
function CustomerManagement(props) {
    const {customerAccount, loading, error, blockCustomer, blockBatchCustomer} = useContext(CustomerContext);

   const [searchTerm, setSearchTerm] = useState("");
   const [selectedUsers, setSelectedUser] = useState([]);

   const handleSearch = (value) => {
    setSearchTerm(value);
   }
   
   const filteredCustomers = useMemo(() => {
    return customerAccount.filter(filterCustomerBySearchTerm(searchTerm));
   }, [customerAccount, searchTerm]);

   
   const handleDeleteSelected = async (ids) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} user đã chọn không?`)) {
      try {
        const result = await blockBatchCustomer(ids);
        setSelectedUser([]);
        return console.log("Khóa thành công", result);
      } catch (err) {
        console.error('Lỗi khi xóa khách hàng', err);
        alert(`Lỗi: ${err.message}`);
      }finally{
        setSelectedUser([]);
      }
    }
  };
  
  // Columns cho bảng
  const columns = [
    { key: 'cus_id', label: 'Mã khách hàng' },
    { key: 'fullname', label: 'Tên khách hàng' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Số điện thoại' },
    {key: 'age', label: 'Tuổi'}
  ];
  const actions = [
    {
      label: 'Khóa',
      variant: 'danger',
      onClick: async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa user này không?')) {
          try {
            const result = await blockCustomer(id);
            setSelectedUser((prev) => prev.filter((CusId) => CusId !== id));
            return console.log("Xóa thành công: ",result);
          } catch (err) {
            console.error('Lỗi khi xóa khách hàng:', err);
          }
        }
      },
    },
    {
      label: 'Chi tiết',
      variant: 'success',
      onClick: (id) => {
        console.log(`Xem chi tiết tour ${id}`);
      },
    },
  ];
   return (
    
    <Container fluid>
      <Row >
        <CustomerFilterEmployee onSearch={handleSearch} onDelete={handleDeleteSelected} selectedItems={selectedUsers}/>
      </Row>
      <Row>
        <DataTable 
          data={filteredCustomers}
          onSearch={handleSearch}
          columns={columns}
          actions={actions}
          itemsPerPage={13}
          totalItems={customerAccount.length}
          isLoading={loading}
          selectedItems={selectedUsers}
          onSelectChange={setSelectedUser}
          error={error ? error.message : null}
          idKey="cus_id"
        />
      </Row>
    </Container>
    );
}

export default CustomerManagement;