import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import "../assets/styles/register.scss";

function Register() {
    
    useEffect(() => {
        document.body.style.overflow = "hidden"; // Ẩn thanh cuộn khi vào trang đăng nhập
        return () => {
            document.body.style.overflow = "auto"; // Hiện lại thanh cuộn khi rời trang đăng nhập
        };
    }, []);
    
    return (
        <div className="registerPage flex">
            {/* <Link to="/" className="btn--backhome">Back to home</Link> */}
            <div className="containterRegister flex">
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

                    <form action="" className="register-form grid">
                        <span>Register fail</span>
                        <div className='name--phone--input flex'>
                            <div className='inputDiv'>
                                <label htmlFor="name">Nhập họ và tên</label>
                                <input type="text" id="name" name="name" placeholder="Nhập họ tên" />
                            </div>
                            <div className='inputDiv'>
                                <label htmlFor="phone">Số điện thoại</label>
                                <input type="text" id="phone" name="phone" placeholder="Nhập số điện thoại" />
                            </div>
                        </div>
                        <div className='inputDiv'>
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" name="email" placeholder="Nhập email" />
                        </div>
                        <div className='inputDiv'>
                            <label htmlFor="password">Mật khẩu</label>
                            <input type="password" id="password" name="password" placeholder="Nhập mật khẩu" />
                        </div>
                        <div className='inputDiv'>
                            <label htmlFor="repassword">Nhập lại mật khẩu</label>
                            <input type="password" id="repassword" name="repassword" placeholder="Nhập lại mật khẩu" />
                        </div>
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
