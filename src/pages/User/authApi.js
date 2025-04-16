import AuthForm from './Login';
// import axios from 'axios';

// const API_URL = 'http://localhost:3001/api/auth';
// export async function loginApi(email, password) {
//     const response = await axios.post(`${API_URL}/login`, { email, password });
//     return response.data;
// }

function Login() {
    return <AuthForm mode="login" />;
}

export default Login;
