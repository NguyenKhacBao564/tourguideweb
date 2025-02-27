
import { Routes, Router, Route, Link} from "react-router-dom";

import Page from "./page";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ScrollToTop from "./feature/scrollToTop";
function App() {
  return (
    <div className="App">
        <ScrollToTop /> 
        <Routes>
          <Route path="/" element={<Page /> } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </div>
  );
}

export default App;
