import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "../assets/styles/register.scss";
import FormInput from "../components/FormInput";
import AlertUI from '../components/AlertUI';

function Register() {
    
    useEffect(() => {
        document.body.style.overflow = "hidden"; // Ẩn thanh cuộn khi vào trang đăng nhập
        return () => {
            document.body.style.overflow = "auto"; // Hiện lại thanh cuộn khi rời trang đăng nhập
        };
    }, []);
    
    const [values, setValues] = useState({
        username: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [show, setShow] = useState(false);


    const inputs = [
        {
            id: 1,
            name: "username",
            type: "text",
            placeholder: "Nhập họ và tên",
            errorMessage: {
                Default: "Họ và tên không được để trống",
                Constraint: "Họ và tên không chứa kí tự đặc biệt hoặc số"},
            label: "Nhập họ và tên",
            required: true,
        },
        {
            id: 2,
            name: "phone",
            type: "text",
            placeholder: "Nhập số điện thoại",
            errorMessage: {
                Default: "Số điện thoại không được để trống",
                Constraint: "Vui lòng nhập đúng định dạng số điện thoại"},
            label: "Nhập số điện thoại",
            required: true,
        },
        {
            id: 3,
            name: "email",
            type: "text",
            placeholder: "Email",
            errorMessage: {
                Default: "Email không được để trống",
                Constraint: "Email không hợp lệ"},
            label: "Email", 
            required: true,
           
        },
        {
            id: 4,
            name: "password",
            type: "password",
            placeholder: "Nhập mật khẩu",
            errorMessage: {
                Default: "Mật khẩu không được để trống",
                Constraint: "Mật khẩu chứa ít nhất 8 kí từ và ít nhất một chữ cái, một số và một kí tự đặc biệt "},
            label: "Nhập mật khẩu",
            required: true,
        },
        {
            id: 5,
            name: "confirmPassword",
            type: "password",
            placeholder: "Nhập lại mật khẩu",
            errorMessage: {
                Default: "Mật khẩu không được để trống",
                Constraint: "Mật khẩu không khớp"},
            label: "Nhập lại mật khẩu",
            required: true,
        },
    ]


    const onChange = (e) => {
        const { name, value } = e.target;
       
        setValues((prev) => {
            const newValues = { ...prev, [name]: value };
            //Kiểm tra xác nhận mật khẩu ngay khi người dùng nhập
            // if (name === "confirmPassword") {
            //     if (newValues.password !== value) {
            //         e.target.setCustomValidity("Mật khẩu không khớp!");
            //     } else {
            //         e.target.setCustomValidity("");
            //     }
            // }
            return newValues;
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 3000);
    }

    return (
        <div className="registerPage flex">
            {/* <Link to="/" className="btn--backhome">Back to home</Link> */}
            
            <div className="containterRegister flex">
                <AlertUI variant="success" show={show} text="Bạn đã đăng kí thành công" className="alert" />
                <div className="introduceDiv flex">
                    <div className="introduceDiv--header">
                        <h1 className="title">Chào mừng dến với </h1>
                        <h2>Tour Guide</h2>
                        <p>Chào mừng bạn đến với hệ thống đặt tour du lịch số 1 PTIT! Hãy khám phá những chuyến đi tuyệt vời và lên kế hoạch cho hành trình sắp tới của bạn ngay hôm nay!</p>
                        <Link to="/login" className="btn--register">Đăng nhập</Link>
                    </div>
                    <img src="/img1.png" alt="Illustration"/>
                </div>
               
                <div className="formDiv flex">
                   
                    <div className="header--RegisterForm">
                        <img src="./logo.png" alt="Logo" />
                        <h2>Đăng kí</h2>
                    </div>
                    <form action="" onSubmit={handleSubmit} className="register-form grid">
                        <span>Register fail</span>
                        {inputs.map((input)=> (<FormInput key={input.id} {...input}  value={values[input.name]} 
                            onChange={onChange} 
                            valueconfirm={input.name === "confirmPassword"? values["password"]:""}
                            usepattern={true}
                            />
                        ))}
                        <button type="submit" className="btn--register">Đăng kí</button>
                        <span className="or">Hoặc</span>
                        <div className="footer--RegisterForm">
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

export default Register;
