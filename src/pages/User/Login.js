import React, { useContext, useState } from 'react';
import FormInput from '../../components/Common/FormInput/FormInput';
import AuthBase from '../../components/Common/Auth/AuthBase';
import authInputs from '../../utils/authInput';
import { AuthContext } from '../../context/AuthContext';

function Login() {
  const { login } = useContext(AuthContext);

  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isChecked) {
      alert("Vui lòng đồng ý với chính sách trước khi tiếp tục.");
      return;
    }
    
    try {
      //Reset lại các state
      setError(null);
      setErrorCode(null);
      const getUser = await login(values.email, values.password);
      console.log("getUser: ", getUser)
      setSuccess("Đăng nhập thành công!");   
    } catch(error) {
      setSuccess(null);
      setErrorCode(error.code);
      setError(error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <AuthBase 
      isRegister={false} 
      error={error} 
      errorCode={errorCode}
      success={success} 
      handleSubmit={handleSubmit}
    >
      {/* Form inputs specific to login */}
      {authInputs.login.map(input => (
        <FormInput 
          key={input.id} 
          {...input} 
          value={values[input.name]} 
          onChange={onChange} 
        />
      ))}
      
      <div className="checkbox-container">
        <label>
          <input 
            type="checkbox" 
            checked={isChecked} 
            onChange={() => setIsChecked(!isChecked)} 
          />
          Đồng ý với điều khoản
        </label>
        <a href="#" className="forgotPassword">Quên mật khẩu</a>
      </div>
      
      <button type="submit" className="btn--submit">Đăng nhập</button>
    </AuthBase>
  );
}

export default Login;
