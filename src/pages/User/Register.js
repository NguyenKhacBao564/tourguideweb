import React, { useContext, useState } from 'react';
import FormInput from '../../components/Common/FormInput/FormInput';
import AuthBase from '../../components/Auth/AuthBase';
import authInputs from '../../utils/AuthInput';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
function Register() {
  const navigate = useNavigate();
  const { regist } = useContext(AuthContext);
  
  const [values, setValues] = useState({ 
    username: '', 
    phone: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu xác nhận
    if (values.password !== values.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    try {
      await regist(values.username, values.email, values.password, values.phone);
      setSuccess("Đăng ký thành công! Chuyển hướng về trang chủ.");
      setTimeout(() => {
        navigate("/", {replace: true});
      }, 1000);
      setValues({ username: '', phone: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      setErrorCode(error.code);
      setError(error.message);
    }
  };

  return (
    <AuthBase 
      isRegister={true} 
      error={error}
      errorCode={errorCode}
      success={success} 
      handleSubmit={handleSubmit}
    >
      {/* Form inputs specific to register */}
      {authInputs.register.map(input => (
        <FormInput 
          key={input.id} 
          {...input} 
          value={values[input.name]} 
          onChange={onChange} 
          valueconfirm={input.name === "confirmPassword" ? values.password : ""}
        />
      ))}
      
      <button type="submit" className="btn--submit">Đăng ký</button>
    </AuthBase>
  );
}

export default Register;
