import React from "react";
import styles from "../assets/styles/Footer.module.scss"; // Import CSS Module
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { FaGithub } from "react-icons/fa";
function Footer() {
  return (
    <div className={styles.footer}>

      <Container fluid>
        {/* Phần Links */}
        <Row className={styles.footerLink}>
          {/* Chọn Ngôn Ngữ */}
          <Col xs={12} md={4} className="mb-3 mb-md-0">
            <p>Language</p>
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                🇻🇳 Viet Nam
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">🇺🇸 English</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>

          {/* Company */}
          <Col xs={6} md={4}>
            <p>Company</p>
            <ul>
              <li>About Us</li>
              <li>Blog</li>
              <li>Press Room</li>
              <li>Careers</li>
            </ul>
          </Col>

          {/* Help */}
          <Col xs={6} md={4}>
            <p>Help</p>
            <ul>
              <li>Contact us</li>
              <li>FAQs</li>
              <li>Terms and conditions</li>
              <li>Privacy policy</li>
              <li>Sitemap</li>
            </ul>
          </Col>
        </Row>

        {/* Phần Mạng Xã Hội và Mô tả */}
        <Row className={styles.footerDescription}>
          <Col xs={12} md={4} className="mb-3 mb-md-0">
            Đồ án nhóm
          </Col>
          <Col xs={12} md={4} className="text-md-left ">
            <FaGithub size={30} style={{ margin: "0" }} />
            {/* <span className={styles.circle} style={{ backgroundColor: "#33C3F0" }}></span>
            <span className={styles.circle} style={{ backgroundColor: "#E44D93" }}></span>
            <span className={styles.circle} style={{ backgroundColor: "#F0473C" }}></span> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Footer;
