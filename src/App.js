import { Routes, Route} from "react-router-dom";

import Page from "./pages/User/Home";
import Register from "./pages/User/Register";
import Login from "./pages/User/Login";
import ScrollToTop from "./feature/scrollToTop";
import Contact from "./pages/User/Contact";
import TourManagement from "./pages/Admin/TourManagement";
import EmployeeBussiness from "./pages/Admin/EmployeeBussiness";
import Dashboard from "./pages/Admin/Dashboard";
import MainLayout from "./components/admin/layout/MainLayout";
import StaffManagement from "./pages/Admin/StaffManagement";
import BranchManagement from "./pages/Admin/BranchManagement";

function App() {
  return (
    <div className="App">
        <ScrollToTop /> 
        <Routes>
          <Route path="/" element={<Page /> } />
          <Route path="/contact" element={<Contact/> } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="nhan-vien" element={<StaffManagement />} />
              <Route path="quan-ly-tour" element={<TourManagement />} />
              <Route path="quan-ly-chi-nhanh" element={<BranchManagement />} />
          </Route>

          {/* Employee Routes */}
          <Route path="/employee" element={<EmployeeBussiness />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="khachhang" element={<p>Khách hàng</p>} />
              <Route path="lichdat" element={<TourManagement />} />
              <Route path="khuyenmai" element={<p>Khuyến mãi</p>} />
          </Route>
        </Routes>
    </div>
  );
}

export default App;

