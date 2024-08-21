import React from "react";
import kakao_login_medium_wide from '../assets/kakao_login_medium_wide.png';
import finger from "../assets/KakaoTalk_20240821_164552577.png"
import "./Login.css"
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
        <>
            <div>
                <h2 className="gradient-text-1">와구와구 사장님 가게 관리 서비스</h2>
                <h2 className="gradient-text-2">와구와구 사장님 가게 관리 서비스</h2>
                <h2 className="gradient-text-3">와구와구 사장님 가게 관리 서비스</h2>
                <h2 className="gradient-text-4">와구와구 사장님 가게 관리 서비스</h2>
                <br/>
                <br/>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px'}}>
                    {/*<img src={finger} className="animated-image" style={{paddingRight: "10px"}} alt="손가락 이미지"/>*/}
                    <button onClick={kakaoLogin} style={{border: 'none', background: 'none'}}>
                        {/*<img src={kakao_login_medium_wide} className="hover-spin-image" alt="카카오 로그인"/>*/}
                        <img src={kakao_login_medium_wide} alt="카카오 로그인"/>
                    </button>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
