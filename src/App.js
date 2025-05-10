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
import { AuthProvider } from "./context/AuthContext";
import ConsultantEmployee from "./pages/ConsultantEmployee/ConsultantEmployee";
import Chatbot from "./pages/ConsultantEmployee/ChatBot";
import ResponeSupport from "./pages/ConsultantEmployee/ResponeSupport";
import ResponeDetail from "./pages/ConsultantEmployee/ResponeDetail";
// import { ConsultantSupportProvider } from "./context/ConsultantSupportContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/BusinessEmployee/UserManagement";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <AuthProvider>
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

          <Route path="/businessemployee" element={
            <ProtectedRoute allowedRoles={["Sales"]}>
              <BusinessEmployee />
            </ProtectedRoute>
          }
          >
            <Route path="customer" element={<UserManagement />} />
            <Route path="managetour" element={<TourManagementEmp />} />
            <Route path="managetour/addtour" element={<AddNewTour />} />
            <Route path="promotion" element={<p>Khuyến mãi</p>} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
          <Route path="customer" element={<p>Khách hàng</p>} />
          <Route path="managetour" element={<TourManagementEmp />} />
          <Route path="managetour/addtour" element={<AddNewTour />} />
          <Route path="promotion" element={<p>Khuyến mãi</p>} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <MainLayout />
            </ProtectedRoute>
          }>
            {/* <Route index element={<Dashboard />} /> */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="nhan-vien" element={<StaffManagement />} />
            <Route path="nhan-vien/:id" element={<EmployeeProfile />} />
            <Route path="quan-ly-tour" element={<TourManagement />} />
            <Route path="quan-ly-chi-nhanh" element={<BranchManagement />} />
          </Route>

          {/* </ConsultantSupportProvider> */}
          <Route path="/consultantemployee" element={
            <ProtectedRoute allowedRoles={["Support"]}>
              <ConsultantEmployee />
            </ProtectedRoute>
          }>
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="request-support" element={<ResponeSupport />} />
            <Route path="request-support/:id" element={<ResponeDetail />} />
          </Route>
        </Routes>

      </AuthProvider>
    </div >
  );
}

export default App;

