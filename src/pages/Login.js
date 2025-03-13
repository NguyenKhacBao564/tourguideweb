import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import "../assets/styles/pages/Login.scss";

import FormInput from '../components/FormInput';
import SocialLogin from '../components/SocialLogin';



function Login() {
    
    useEffect(() => {
        document.body.style.overflow = "hidden"; // Ẩn thanh cuộn khi vào trang đăng nhập
        return () => {
            document.body.style.overflow = "auto"; // Hiện lại thanh cuộn khi rời trang đăng nhập
        };
    }, []);

    const [values, setValues] = useState({
        mail: '',
        password: '',
    });

    const [check, setCheck] = useState(false); // Kiểm tra đăng nhập thành công hay không
    const [isChecked, setIsChecked] = useState(false); // Kiểm tra đã đồng ý chính sách bảo mật hay chưa
    const inputs = [
        {
            id: 1,
            name: "mail",
            type: "text",
            placeholder: "Nhập email",
            label: "Nhập email",
            errorMessage: {},
            required: true,
        },
        {
            id: 2,
            name: "password",
            type: "password",
            placeholder: "Nhập mật khẩu",
            label: "Nhập mật khẩu",
            errorMessage: {},
            required: true,
        },
    ]

    const onChange = (e) =>{
        setValues({...values, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e) => {  
        e.preventDefault();
        if (isChecked) {
            alert("Bạn đã đồng ý với chính sách!");
          } else {
            alert("Vui lòng đồng ý với chính sách trước khi tiếp tục.");
          }
        // var username = data.find(user => user.username === values.mail);
        // console.log(data);
        // console.log(username);
        
        // if(username && username.password === values.password){ 
        //     setCheck(false);
        //     console.log("Đăng nhập thành công!");
        // }else{
        //     setCheck(true);
        //     console.log("Sai tên đăng nhập hoặc mật khẩu!");
        // }
        
    }

    
    return (
        <div className="loginPage">
             {/* <Link to="/" className="btn--backhome">Back to home</Link> */}
            <div className="containterLogin flex">
                <div className="introduceDiv flex">
                    <div className="introduceDiv--header">
                        <h1 className="title">Chào mừng dến với </h1>
                        <h2>Tour Guide</h2>
                        <p>Chào mừng bạn đến với hệ thống đặt tour du lịch số 1 PTIT! Hãy khám phá những chuyến đi tuyệt vời và lên kế hoạch cho hành trình sắp tới của bạn ngay hôm nay!</p>
                        <Link to="/register" className="btn--login">Đăng ký</Link>
                    </div>
                    <img src="/illus_Login_Regis.png" alt="Illustration"/>
                </div>

                <div className="formDiv flex">
                    <div className="header--LoginForm">
                        <img src="./logo.png" alt="Logo" />
                        <h2>Đăng nhập</h2>
                    </div>
                    <form action="" onSubmit={handleSubmit} className="login-form grid">
                        {/* Thất bại thì hiện ra */}
                        <p>{check && <span className="alertLoginFail">Tên đăng nhập hoặc mật khẩu không đúng</span>}</p>

                        {inputs.map((input) => (
                            <FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange}/>
                            ))}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height:"fit-content"}}>
                        <label >
                            <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={(e) => setIsChecked(e.target.checked)}
                            />
                            Ghi nhớ đăng nhập.
                        </label>
                        
                        <a className="forgotPassword">Quên mật khẩu</a>
                        </div>
                        <button type="submit" className="btn--login">Đăng nhập</button>
                       
                        <span className="or">Hoặc</span>
                        <SocialLogin />
                        <p>Chưa có tài khoản? <a>Đăng kí ngay</a></p>
                    </form>     
                </div>
            </div>
        </div>
    );
}

export default Login;
