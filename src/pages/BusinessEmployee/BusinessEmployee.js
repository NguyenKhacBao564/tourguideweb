import React from 'react';
import ManagerLayout from '../../layouts/SystemManager/ManagerLayout'; 
import { CustomerProvider } from '../../context/CustomerContext';
function Employee_Business(props) {

  
  return (
      <CustomerProvider>
        <ManagerLayout/>
      </CustomerProvider>
  );
}

export default Employee_Business;