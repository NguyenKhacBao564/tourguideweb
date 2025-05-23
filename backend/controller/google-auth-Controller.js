require('dotenv').config();
const express = require('express');

const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client("678561996244-dhafh8drnjs1ku0dj79ohre8d23nqh47.apps.googleusercontent.com");

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

const getGoogleUserInfo = async (req, res) => {
   console.log("get success");
    return "success";
}

const loginGoogle = async (req, res) => {
    const { credential } = req.query;
   
     console.log("data", req);
    if(!credential) {
        return res.status(400).json({
            message: "Missing Credential"
        })
    }
    
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];
        const picture = payload['picture'];
        // req.session.user = payload;
        // res.redirect('/');
        // Xử lý thông tin người dùng ở đây (lưu vào cơ sở dữ liệu, tạo phiên làm việc, v.v.)
        return res.status(200).json({
            message: "Login success",
            user: {
                id: userid,
                email,
                name,
                picture
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
}

module.exports = {
    loginGoogle,
    getGoogleUserInfo
}