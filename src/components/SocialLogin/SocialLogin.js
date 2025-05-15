import React from 'react';
import { useEffect, useRef } from 'react';

function SocialLogin(props) {

    // useEffect(() => {
    //     /* global google */
    //     google.accounts.id.initialize({
    //         client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com",
    //         callback: handleCredentialResponse
    //     });

    //     google.accounts.id.renderButton(
    //         document.getElementById("buttonDiv"),
    //         { theme: "outline", size: "large" }  // customization attributes
    //     );

    //     google.accounts.id.prompt(); // also display the One Tap dialog
    // }, []);
    // Tích hợp Google Identity Services
    useEffect(() => {
      // Tải script Google Identity Services
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      document.body.appendChild(script);

      // Khởi tạo Google Sign-In khi script tải xong
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: '678561996244-dhafh8drnjs1ku0dj79ohre8d23nqh47.apps.googleusercontent.com', // Thay bằng Client ID của bạn
          callback: handleCredentialResponse,
        });
        // window.google.accounts.id.prompt(); // Hiển thị One Tap prompt
      };

      // Dọn dẹp script khi component unmount
      return () => {
        document.body.removeChild(script);
      };
    }, []); // Chạy một lần khi component mount


    function decodeJWT(token) {

        let base64Url = token.split(".")[1];
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        let jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        return JSON.parse(jsonPayload);
      }

      function handleCredentialResponse(response) {

        console.log("Encoded JWT ID token: " + response.credential);

        const responsePayload = decodeJWT(response.credential);

        console.log("Decoded JWT ID token fields:");
        console.log("  Full Name: " + responsePayload.name);
        console.log("  Given Name: " + responsePayload.given_name);
        console.log("  Family Name: " + responsePayload.family_name);
        console.log("  Unique ID: " + responsePayload.sub);
        console.log("  Profile image URL: " + responsePayload.picture);
        console.log("  Email: " + responsePayload.email);
      }


    return (
        <div className="socialLogin">
          {/* <div
            id="g_id_onload"
            data-auto_prompt="false"
            data-callback="handleCredentialResponse"
            data-client_id="PUT_YOUR_WEB_CLIENT_ID_HERE"
          ></div> */}
            {/* <button>
                <img alt="anh1" src="./google.png" />
            </button>
            <button>
                <img alt="anh2" src="./facebook.png"/>
            </button> */}
            {/* <div
              id="g_id_onload"
              data-auto_prompt="false"
              data-callback="handleCredentialResponse"
              data-client_id="678561996244-dhafh8drnjs1ku0dj79ohre8d23nqh47.apps.googleusercontent.com"
            ></div> */}
             <div className="g_id_signin"></div>
        </div>
    );
}

export default SocialLogin;