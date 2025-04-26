import { Routes, Route } from "react-router-dom";
import Page from "./pages/User/Home";
import Register from "./pages/User/Register";
import Login from "./pages/User/Login";
import ScrollToTop from "./feature/scrollToTop";
import Contact from "./pages/User/Contact";
import TourManagementEmp from "./pages/BusinessEmployee/TourManagement";
import MainLayout from "./pages/Admin/layout/MainLayout";
import Dashboard from "./pages/Admin/Dashboard";
import StaffManagement from "./pages/Admin/StaffManagement";
import EmployeeProfile from "./pages/Admin/EmployeeProfile";
import TourManagement from "./pages/Admin/TourManagement";
import BranchManagement from "./pages/Admin/BranchManagement";
import BusinessEmployee from "./pages/BusinessEmployee/BusinessEmployee";
import AddNewTour from "./pages/BusinessEmployee/AddNewTour/AddNewTour";
import InforUser from "./pages/User/InforUser";
import ConsultantEmployee from "./pages/ConsultantEmployee/ConsultantEmployee";
import Chatbot from "./pages/ConsultantEmployee/ChatBot";
import ResponeSupport from "./pages/ConsultantEmployee/ResponeSupport";
import { TourProvider } from "./context/TourContext";
// import { ConsultantSupportProvider } from "./context/ConsultantSupportContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/BusinessEmployee/UserManagement";
import AddNewEmployee from "./pages/Admin/addNewEmployee";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
        {/* <ConsultantSupportProvider> */}
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/thongtin" element={<InforUser />} />
          <Route path="/customer" element={<p>customer</p>} />
          <Route path="/sale" element={<p>sale</p>} />
          <Route path="/support" element={<p>support</p>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound/>} />

          {/* Business Employee Routes */}
          <Route path="/businessemployee" element={
            <ProtectedRoute allowedRoles={["Sales"]}>
              <BusinessEmployee />
            </ProtectedRoute>
            }>
            <Route path="customer" element={<UserManagement />} />
            <Route path="managetour" element={
              <TourProvider> 
                <TourManagementEmp />
              </TourProvider>
            }/>
            <Route path="managetour/addtour" element={
              <TourProvider> 
                <AddNewTour />
              </TourProvider>
            }/>
            <Route path="promotion" element={<p>Khuyến mãi</p>} />
        </Route>

         {/* Admin Routes */}
         <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <MainLayout />
              </ProtectedRoute>
          }>
              {/* <Route index element={<Dashboard />} /> */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="staffManagement" element={<StaffManagement />} />
              <Route path="staffManagement/:id" element={<EmployeeProfile />} />
              <Route path="staffManagement/addNewEmployee" element={<AddNewEmployee />} />
              <Route path="tourManagement" element={<TourManagement />} />
              <Route path="branchManagement" element={<BranchManagement />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

          {/* Consultant Employee Routes */}
          <Route path="/consultantemployee" element={
            <ProtectedRoute allowedRoles={["Support"]}>
              <ConsultantEmployee />
            </ProtectedRoute>
          }>
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="request-support" element={<ResponeSupport />} />
          </Route>
        </Routes>
    </div >
  );
}

export default App;

