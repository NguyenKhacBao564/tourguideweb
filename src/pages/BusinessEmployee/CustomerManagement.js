// src/pages/BusinessEmployee/UserManagement.js
import React, { useState, useContext, useMemo} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CustomerFilterEmployee from '../../components/Employee/Filter/CustomerFilterEmployee';
import { TourProvider } from '../../context/TourContext';
import DataTable from '../../components/Common/DataTable/DataTable';
import { filterCustomerBySearchTerm } from '../../utils/customerFilterHelper';
import { useNavigate } from 'react-router-dom';
import { CustomerContext } from '../../context/CustomerContext';

function CustomerManagement(props) {
    const navigate = useNavigate();
    const {customerAccount, loading, error, blockCustomer, fetchCustomerAccount,  blockBatchCustomer} = useContext(CustomerContext);
    console.log('customerAccount', customerAccount);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUsers, setSelectedUser] = useState([]);

    const handleSearch = (value) => {
        // setSearchTerm(value);
        console.log("Search value:", value);
        fetchCustomerAccount({name: value});
    }
    

   
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
  
  //  const handleSearch = (searchText) => {
  //       setSearchTerm(searchText);
  //   };

  // Columns cho bảng
  const columns = [
    { key: 'cus_id', label: 'Mã khách hàng' },
    { key: 'fullname', label: 'Tên khách hàng' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Số điện thoại' },
    { key: 'date_of_birth', label: 'Ngày sinh' }
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
      onClick: (id, customerInfor) => {            
            navigate("/businessemployee/customer/inforcustomer", {
            state: { customerInfor: customerInfor }
            });
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
          data={customerAccount}
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