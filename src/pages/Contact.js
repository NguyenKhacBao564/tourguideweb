import React from "react";
import styles from "../assets/styles/ContactUs.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Contact() {
  return (
    <div>
      <div className={styles.header}>
        <h2>Contact Us</h2>
        <p>Any question or remarks? Just write us a message!</p>
      </div>

      <div className={styles.contactContainer}>
        {/* Contact Info */}
        <div className={styles.contactInfo}>
          <h4>Contact Information</h4>
          <p>Say something to start a live chat!</p>
          <p><i className="fa-solid fa-phone-volume"></i> +012 3456 789</p>
          <p><i className="fa-sharp fa-solid fa-envelope fa-flip-horizontal"></i> demo@gmail.com</p>
          <p><i className="fa-solid fa-location-dot"></i> 97 Man Thiện, Phường Hiệp Phú, TP.Thủ Đức, TPHCM</p>

          {/* Circle Decoration */}
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

          {/* Social Icons */}
          <div className={styles.socialIcons}>
            <a href="http://facebook.com/phan.tuan.anh.917546" target="_blank" className={styles.iconCircle}>
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/bean.284/" target="_blank" className={styles.iconCircle}>
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://discord.com/users/yourprofile" target="_blank" className={styles.iconCircle}>
              <i className="fa-brands fa-discord"></i>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className={styles.contactForm}>
          <form>
            <div className={styles.inputGroup}>
              <div>
                <label>First Name</label>
                <input type="text" placeholder="First Name" />
              </div>
              <div>
                <label>Last Name</label>
                <input type="text" placeholder="Last Name" />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <div>
                <label>Email</label>
                <input type="email" placeholder="Email" />
              </div>
              <div>
                <label>Phone Number</label>
                <input type="text" placeholder="Phone Number" />
              </div>
            </div>
            <label>Select Subject:</label>
            <div className={styles.radioGroup}>
              {['General Inquiry', 'Booking Request', 'Support/Assistance', 'Feedback'].map((subject, index) => (
                <label key={index} className={styles.customRadio}>
                  <input type="radio" name="subject" value={subject.toLowerCase()} />
                  <span>{subject}</span>
                </label>
              ))}
            </div>
            <label>Message</label>
            <input type="text" placeholder="Write your message..." />
            <button type="submit">Send Message</button>
          </form>

          {/* Image */}
          <div className={styles.imageContainer}>
            <img src="https://s3-alpha-sig.figma.com/img/5e52/eb20/ee9158ca0835b430d0b6ef56e2d7385e?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=gqUbetUKXujAA7cq56fiM2N1TnXCdejPsMi28rh7h08pUzwM7ZbgJcwA4-Vyb-EWSvPEE~TPBP2CaLSta1B7oqjUlWTjkngYrbuf3closVW6IbAYZcN03aXDwnzP6-usdZXzf57lzjtJuATo6qLAmgQoQp~QN5GV62ilaDf7n9yziEy~-SoTSeDZJqnX03XFUb~KCvjkyGK3NyB1vCqXgpNpkhpmGGGaEZNT00NkfFXSh7kTue~2Oo68EXTwucRYvqkrvmLNSvfb0sfCvL~7cr3wEOuy-0pTqUXZUmcjD4HcT45kiVWD6fhH1e14oNmQwivApVglYw8Wpj2awN8~DQ__" 
                 alt="send-letter" width="200" height="100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
