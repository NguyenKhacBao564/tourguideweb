import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import FormInput from '../../components/FormInput/FormInput';
import SocialLogin from '../../components/SocialLogin/SocialLogin';
import authInputs from '../../utils/AuthInput';
import "../../styles/pages/Auth.scss";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
function AuthForm({mode}) {
    
    const {login, regist, user} = useContext(AuthContext);
    const navigate = useNavigate();
    console.log("user token: ",user)
    const isRegister = mode === "register";

    const [values, setValues] = useState(
        isRegister 
        ? { username: '', phone: '', email: '', password: '', confirmPassword: '' } 
        : { email: '', password: '' }
    );
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    console.log("value",values)
    
    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegister) {
            setShowAlert(true);
            // Xử lý đăng ký
            try {
                await regist(values.username, values.email, values.password, values.phone);
                setValues({ username: '', phone: '', email: '', password: '', confirmPassword: '' });
                setShowAlert(true);
            } catch (error) {
                console.error("Đăng ký thất bại [Auth Form]:", error);
            }
        } else if (!isChecked) {
            alert("Vui lòng đồng ý với chính sách trước khi tiếp tục.");
        }else{
            // Xử lý đăng nhập
            try{
                //Lấy user sau khi đăng nhập thành công
                const getUser = await login(values.email, values.password);
                console.log("user token: ",user)
                console.log("getUser: ",getUser)
                setSuccess("Đăng nhập thành công!");
                
                setTimeout(() => {switch (getUser.role) {
                    case "customer":
                      navigate("/", {replace: true});
                      break;
                    case "Support":
                      navigate("/support", {replace: true});
                      break;
                    case "Sales":
                      navigate("/sale",{replace: true});
                      break;
                    case "Admin":
                      navigate("/BusinessEmployee/khachhang",{replace: true});
                      break;
                    default:
                      console.error("Unknown role:", user.role);
                  }},1000);
            }catch(error){
                setError("Tên đăng nhập hoặc mật khẩu không đúng!");
            }
        }
    };

    return (
        <div className={`authPage ${isRegister?"register":""}`}>
        <div className={`containerAuth ${isRegister?"":"login"} flex`}>
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

            <div className={`formDiv ${isRegister?"register":"login"} flex`}>
                <div className="header--AuthForm">
                    <img src="./logo.png" alt="Logo" />
                    <h2>{isRegister ? "Đăng ký" : "Đăng nhập"}</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form grid">
                    {authInputs[isRegister ? "register" : "login"].map(input => (
                        <FormInput key={input.id} {...input} 
                        value={values[input.name]} 
                        onChange={onChange} 
                        valueconfirm = {input.name === "confirmPassword" ? values.password : ""}
                        />
                    ))}
                    
                    {isRegister ? null : (
                        <div className="checkbox-container">
                            <label>
                            <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                            Đồng ý với điều khoản</label>
                            <a href="#" className="forgotPassword">Quên mật khẩu</a>
                        </div>
                    )}
                    
                    <button type="submit" className="btn--submit" >{isRegister ? "Đăng ký" : "Đăng nhập"}</button>
                    
                    <span className="or">Hoặc</span>
                    <SocialLogin/>
                    <div className="switch--auth">
                        {isRegister?<p>Đã có tài khoản? <Link to="/login" ><span style={{color:"#4461F2"}}>Đăng nhập ngay</span></Link></p> : <p>Chưa có tài khoản? <Link to="/register" ><span style={{color:"#4461F2"}}>Đăng kí ngay</span></Link></p>}
                    </div>
                    
                </form>
            </div>
        </div>
    </div>
    );
}

export default AuthForm;