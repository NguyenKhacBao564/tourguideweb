import React from 'react';
import { Link } from "react-router-dom";
import SocialLogin from '../../components/SocialLogin/SocialLogin';
import "../../styles/pages/Auth.scss";

// Thành phần cơ sở cho trang đăng nhập/đăng ký
const AuthBase = ({ 
  isRegister, 
  children, 
  error, 
  success, 
  handleSubmit
}) => {
  return (
    <div className={`authPage ${isRegister ? "register" : ""}`}>
      <div className={`containerAuth ${isRegister ? "" : "login"} flex`}>
        <div className="introduceDiv flex">
          <Link to="/">Trở lại trang chủ</Link>
          <div className="introduceDiv--header">
            <h1 className="title">Chào mừng đến với </h1>
            <h2>Tour Guide</h2>
            <p>Chào mừng bạn đến với hệ thống đặt tour du lịch số 1 PTIT! Hãy khám phá những chuyến đi tuyệt vời và lên kế hoạch cho hành trình sắp tới của bạn ngay hôm nay!</p>
            <Link to={isRegister ? "/login" : "/register"} className="btn--switch">
              {isRegister ? "Đăng nhập" : "Đăng ký"}
            </Link>
          </div>
          <img src="/illus_Login_Regis.png" alt="Illustration" />
        </div>

        <div className={`formDiv ${isRegister ? "register" : "login"} flex`}>
          <div className="header--AuthForm">
            <img src="./logo.png" alt="Logo" />
            <h2>{isRegister ? "Đăng ký" : "Đăng nhập"}</h2>
            {error && <div className="alert alert-danger">{error}</div>} 
            {success && <div className="alert alert-success">{success}</div>}
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form grid">
            {children}
            
            <span className="or">Hoặc</span>
            <SocialLogin />
            <div className="switch--auth">
              {isRegister 
                ? <p>Đã có tài khoản? <Link to="/login"><span style={{color:"#4461F2"}}>Đăng nhập ngay</span></Link></p> 
                : <p>Chưa có tài khoản? <Link to="/register"><span style={{color:"#4461F2"}}>Đăng kí ngay</span></Link></p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthBase; 