import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
import styles from "../../styles/pages/ContactUs.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneVolume,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebookF as fabFacebookF, faInstagram as fabInstagram, faDiscord as fabDiscord } from "@fortawesome/free-brands-svg-icons";
import Footer from "../../layouts/Footer";
import { createSupportRequest } from "../../api/supportAPI";
import { AuthContext } from "../../context/AuthContext";

// Hàm tách fullname thành firstName và lastName
const splitFullName = (fullName) => {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(" ");
  const lastName = parts.pop();
  const firstName = parts.join(" ");
  return { firstName: firstName || lastName, lastName: lastName || "" };
};
function Contact() {
  const { user } = useContext(AuthContext); // Lấy user từ AuthContext
  const navigate = useNavigate();

  // Kiểm tra đăng nhập, nếu không có user thì chuyển hướng đến login
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/contact" } });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: user?.phone || "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cập nhật formData khi user thay đổi
  useEffect(() => {
    if (user) {
      const { firstName, lastName } = splitFullName(user.name);
      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      subject: "",
      message: "",
    };

    if (!formData.subject) {
      newErrors.subject = "Vui lòng chọn một chủ đề";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập tin nhắn";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await createSupportRequest(formData);
      setSuccess(response.message);
      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));
      setErrors({
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Nếu không có user, không render form
  if (!user) {
    return null;
  }

  return (
    <div>
      <div className={styles.header}>
        <h2>Liên Hệ Với Chúng Tôi</h2>
        <p>Có câu hỏi hoặc ý kiến? Hãy gửi tin nhắn cho chúng tôi!</p>
      </div>

      <div className={styles.contactContainer}>
        <div className={styles.contactInfo}>
          <h4>Thông Tin Liên Hệ</h4>
          <p>Hãy nói gì đó để bắt đầu trò chuyện trực tiếp!</p>
          <p><FontAwesomeIcon icon={faPhoneVolume} /> +012 3456 789</p>
          <p><FontAwesomeIcon icon={faEnvelope} /> demo@gmail.com</p>
          <p><FontAwesomeIcon icon={faLocationDot} /> 97 Man Thiện, Phường Hiệp Phú, TP. Thủ Đức, TPHCM</p>

          <div className={styles.circleContainer}>
            <svg className={styles.customCircle} width="300" height="300">
              <defs>
                <clipPath id="quarterCircle">
                  <path d="M 200 200 L 200 0 A 125 125 0 0 0 0 200 Z" />
                </clipPath>
              </defs>
              <circle cx="150" cy="150" r="150" fill="#36BED7" clipPath="url(#quarterCircle)" />
            </svg>
            <div className={styles.smallCircle}></div>
          </div>

          <div className={styles.socialIcons}>
            <a href="http://facebook.com/phan.tuan.anh.917546" target="_blank" rel="noreferrer" className={styles.iconCircle}>
              <FontAwesomeIcon icon={fabFacebookF} />
            </a>
            <a href="https://www.instagram.com/bean.284/" target="_blank" rel="noreferrer" className={styles.iconCircle}>
              <FontAwesomeIcon icon={fabInstagram} />
            </a>
            <a href="https://discord.com/users/yourprofile" target="_blank" rel="noreferrer" className={styles.iconCircle}>
              <FontAwesomeIcon icon={fabDiscord} />
            </a>
          </div>
        </div>

        <div className={styles.contactForm}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <div>
                <label>Họ</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  disabled
                />
                {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
              </div>
              <div>
                <label>Tên</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  disabled
                />
                {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
              </div>
            </div>
            <div className={styles.inputGroup}>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
                {errors.email && <p className={styles.error}>{errors.email}</p>}
              </div>
              <div>
                <label>Số Điện Thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  disabled
                />
                {errors.phone && <p className={styles.error}>{errors.phone}</p>}
              </div>
            </div>
            <label>Chọn Chủ Đề:</label>
            <div className={styles.radioGroup}>
              {[
                "Yêu Cầu Chung",
                "Yêu Cầu Đặt Lịch",
                "Hỗ Trợ/Kỹ Thuật",
                "Phản Hồi",
              ].map((subject, index) => (
                <label key={index} className={styles.customRadio}>
                  <input
                    type="radio"
                    name="subject"
                    value={subject.toLowerCase()}
                    checked={formData.subject === subject.toLowerCase()}
                    onChange={handleChange}
                    required
                  />
                  <span>{subject}</span>
                </label>
              ))}
            </div>
            {errors.subject && <p className={styles.error}>{errors.subject}</p>}
            <label>Tin Nhắn</label>
            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              required
            />
            {errors.message && <p className={styles.error}>{errors.message}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Đang Gửi..." : "Gửi Tin Nhắn"}
            </button>
          </form>
          {success && <p className={styles.success}>{success}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
      <div>
        <Navbar />
        <Footer />
      </div>
    </div>
  );
}

export default Contact;