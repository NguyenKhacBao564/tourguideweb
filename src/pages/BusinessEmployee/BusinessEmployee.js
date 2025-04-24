import React, {use, useContext, useEffect} from 'react';
import ManagerLayout from '../../layouts/SystemManager/ManagerLayout'; 
 import { AuthContext } from '../../context/AuthContext';
 import { TourProvider } from '../../context/TourContext';
 import { CustomerProvider } from '../../context/CustomerContext';
function Employee_Business(props) {

  
  return (
    <TourProvider> 
      <CustomerProvider>
      <ManagerLayout/>
      </CustomerProvider>
    </TourProvider>
  );
}

export default Employee_Business;