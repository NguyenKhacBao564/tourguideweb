import React, {use, useContext, useEffect} from 'react';
import ManagerLayout from '../../layouts/SystemManager/ManagerLayout'; 
 import { AuthContext } from '../../context/AuthContext';
 import { TourProvider } from '../../context/TourContext';
 import { CustomerProvider } from '../../context/CustomerContext';
function Employee_Business(props) {
  const   { user } = useContext(AuthContext);
  console.log("User in Employee_Business: ", user);
  useEffect(() => {
    console.log("reload ", user);
  }
  , [user]);
  return (
    <TourProvider> 
      <CustomerProvider>
      <ManagerLayout/>
      </CustomerProvider>
    </TourProvider>
  );
}

export default Employee_Business;