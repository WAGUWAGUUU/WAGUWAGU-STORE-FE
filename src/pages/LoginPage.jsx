import React from "react";
import kakao_login_medium_wide from '../assets/kakao_login_medium_wide.png';

const LoginPage = () => {
    const kakaoLogin = () => {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
        const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

        // Construct the Kakao authorization URL
        const loginUrl = `${baseUrl}?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

        // Redirect to the Kakao login page
        window.location.href = loginUrl;
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <button onClick={kakaoLogin} style={{ border: 'none', background: 'none' }}>
                <img src={kakao_login_medium_wide} alt="카카오 로그인" />
            </button>
        </div>
    );
};

export default LoginPage;
