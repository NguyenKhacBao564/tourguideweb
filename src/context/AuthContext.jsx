// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Creat context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    // Initial auth state
    const [auth, setAuth] = useState({
        isAuthenticated: false, 
        user: null,
        token: null,
    });

    // Load information from localStorge if available (for page reloads)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            setAuth({
                isAuthenticated: true,
                token,
                user: JSON.parse(user),
            })
        }
        }, []);  

    // Login function : save infomation to state and localStorage
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuth({
            isAuthenticated: true,
            token,
            user: userData,
        });
    };
    
    // Logout function : clear infomation from state and localStorage
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({
            isAuthenticated: false,
            user: null,
            token: null,
        });
    };    

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};