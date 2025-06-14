// src/pages/BusinessEmployee/UserManagement.js
import React, { useState, useContext, useMemo} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CustomerFilterEmployee from '../../components/Employee/Filter/CustomerFilterEmployee';
import { TourProvider } from '../../context/TourContext';
import DataTable from '../../components/Common/DataTable/DataTable';
import { filterCustomerBySearchTerm } from '../../utils/customerFilterHelper';
import { useNavigate } from 'react-router-dom';
import { CustomerContext } from '../../context/CustomerContext';
import ConfirmDialog from "../../components/Common/ConfirmDialog/ConfirmDialog";

function CustomerManagement(props) {
    const navigate = useNavigate();
    const {customerAccount, loading, error, blockCustomer, fetchCustomerAccount,  blockBatchCustomer} = useContext(CustomerContext);
    console.log('customerAccount', customerAccount);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customerToBlock, setCustomerToBlock] = useState(null); // Customer đang được khóa
    const [isBatchBlockCustomer, setIsBatchBlockCustomer] = useState(false); // Biến để xác định có đang khóa nhiều khách hàng cùng lúc hay không
    const [selectedUsers, setSelectedUser] = useState([]);

    // Columns cho bảng
    const columns = [
      { key: 'cus_id', label: 'Mã khách hàng' },
      { key: 'fullname', label: 'Tên khách hàng' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Số điện thoại' },
      { key: 'birthday', label: 'Ngày sinh' }
    ];

    const actions = [
      {
        label: 'Khóa',
        variant: 'danger',
        onClick: async (id) => {
          setCustomerToBlock(id); //Lưu id khách hàng cần khóa
          setIsDialogOpen(true); // Mở dialog xác nhận khóa khách hàng
          setIsBatchBlockCustomer(false); // Không phải khóa hàng loạt
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

    const handleSearch = (value) => {
        // setSearchTerm(value);
        console.log("Search value:", value);
        fetchCustomerAccount({name: value});
    }
    

   const handleDeleteSelected = () => {
      setIsDialogOpen(true); // Mở dialog xác nhận khóa khách hàng
      setIsBatchBlockCustomer(true); // Đặt trạng thái khóa hàng loạt
  };

  const checkConfirmBlock = async (isConfirmed) => {
    if(isConfirmed){
      try{
        if(isBatchBlockCustomer){
          await blockBatchCustomer(selectedUsers); 
          setSelectedUser([]);
          // alert(`${selectedUsers.length} khách hàng đã được khóa thành công!`);
        }else if (customerToBlock) {
          await blockCustomer(customerToBlock);
          setSelectedUser((prev) => prev.filter((CusId) => CusId !== customerToBlock));
          // alert(`Khách hàng với ID ${customerToBlock} đã được khóa thành công!`);
        }
      }catch(error){
        console.error('Lỗi khi khóa khách hàng:', error);
        alert("Đã xảy ra lỗi khi khóa khách hàng!");
      }
    }
    // Đóng dialog và reset trạng thái
    setIsDialogOpen(false);
    setCustomerToBlock(null);
    setIsBatchBlockCustomer(false);
  }
  

   return (
    <>
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
      {isDialogOpen && (
        <ConfirmDialog
          message="Bạn có chắc muốn xóa khách hàng này không?"
          checkConfirm={checkConfirmBlock}
        />
      )}
    </>
    );
}

export default CustomerManagement;