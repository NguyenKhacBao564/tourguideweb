import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/Common/FormInput/FormInput';
import AuthBase from '../../components/Auth/AuthBase';
import authInputs from '../../utils/AuthInput';
import { AuthContext } from '../../context/AuthContext';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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
      setError(null);
      setErrorCode(null);
      
      const getUser = await login(values.email, values.password);
      
      setSuccess("Đăng nhập thành công!");
      
      setTimeout(() => {
        switch (getUser.role) {
          case "customer":
            navigate("/", {replace: true});
            break;    
          case "Support":
            navigate("/support", {replace: true});
            break;
          case "Sales":
            navigate("/businessemployee/customer", {replace: true});
            break;
          case "Admin":
            navigate("/admin/dashboard", {replace: true});
            break;
          default:
            console.error("Unknown role:", getUser.role);
        }
      }, 1000);
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
