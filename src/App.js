
import { Routes, Route} from "react-router-dom";

import Page from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ScrollToTop from "./feature/scrollToTop";
import Contact from "./pages/Contact";
function App() {
  return (
    <div className="App">
        <ScrollToTop /> 
        <Routes>
          <Route path="/" element={<Page /> } />
          <Route path="/contact" element={<Contact/> } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </div>
  );
}

export default App;
