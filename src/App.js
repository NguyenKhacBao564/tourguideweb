
import { Routes, Route } from "react-router-dom";

import Page from "./pages/User/Home";
import Register from "./pages/User/Register";
import Login from "./pages/User/Login";
import ScrollToTop from "./feature/scrollToTop";
import Contact from "./pages/User/Contact";
import TourManagement from "./pages/Admin/Employee_Bussiness/TourManagement";
import Employee_Bussiness from "./pages/Admin/Employee_Bussiness/Employee_Bussiness";
import AddTourArea from "./components/AddTourArea/AddTourArea";
import TourHistory from "./pages/User/TourHistory";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addtour" element={<AddTourArea />} />

        <Route path="/admin" element={<Employee_Bussiness />}>
          <Route path="khachhang" element={<p>Khách hàng</p>} />
          <Route path="lichdat" element={<TourManagement />} />
          <Route path="khuyenmai" element={<p>Khuyến mãi</p>} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;
