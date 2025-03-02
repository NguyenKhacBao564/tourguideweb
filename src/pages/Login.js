import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "../assets/styles/login.scss";
import Validator from "../feature/validator";
import FormInput from '../components/FormInput';
function Login() {
    
    useEffect(() => {
        document.body.style.overflow = "hidden"; // Ẩn thanh cuộn khi vào trang đăng nhập
        return () => {
            document.body.style.overflow = "auto"; // Hiện lại thanh cuộn khi rời trang đăng nhập
        };
    }, []);
    
    // Validator({
    //     form: '#form-1',
    //     rules: [
    //         Validator.isRequire('#username'),
    //         Validator.isEmail('#password')
    //     ]
    // });
    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    const inputs = [
        {
            id: 1,
            name: "mail",
            type: "text",
            placeholder: "Nhập email",
            label: "Nhập email",
        },
        {
            id: 2,
            name: "password",
            type: "password",
            placeholder: "Nhập mật khẩu",
            label: "Nhập mật khẩu",
        },
    ]

    const onChange = (a) =>{
        setValues({...values, [a.target.name]: a.target.value});
    }

    return (
        <div className="loginPage flex">
             {/* <Link to="/" className="btn--backhome">Back to home</Link> */}
            <div className="containterLogin flex">
                <div className="introduceDiv flex">
                    <div className="introduceDiv--header">
                        <h1 className="title">Chào mừng dến với </h1>
                        <h2>Tour Guide</h2>
                        <p>Chào mừng bạn đến với hệ thống đặt tour du lịch số 1 PTIT! Hãy khám phá những chuyến đi tuyệt vời và lên kế hoạch cho hành trình sắp tới của bạn ngay hôm nay!</p>
                        <Link to="/register" className="btn--login">Đăng ký</Link>
                    </div>
                    <img src="/img1.png" alt="Illustration"/>
                </div>

                <div className="formDiv flex">
                    <div className="header--LoginForm">
                        <img src="./logo.png" alt="Logo" />
                        <h2>Đăng nhập</h2>
                    </div>
                    <form action="" className="login-form grid">
                        <span>Login fail</span>
                        {inputs.map((input) => (<FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange}/>))}
                        <a href="#" className="forgotPassword">Quên mật khẩu</a>
                        <button type="submit" className="btn--login">Đăng nhập</button>
                        <span className="or">Hoặc</span>
                        <div className="footer--LoginForm">
                            <button className="btn--loginWithGoogle">
                                <img src="./google.png" className='icon-large'/>
                            </button>
                            <button className="btn--loginWithFacebook">
                                <img src="./facebook.png" className='icon-large'/>
                            </button>
                        </div>
                    </form>     
                </div>
            </div>
        </div>
    );
}

export default Login;
