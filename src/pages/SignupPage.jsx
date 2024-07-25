import React, { useEffect, useState } from 'react';
import {getInfo, updateInfo} from "../config/authApi.js";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
    const [ownerEmail, setOwnerEmail] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerAddress, setOwnerAddress] = useState('');
    const [ownerBusinessNumber, setOwnerBusinessNumber] = useState('');
    const [ownerLatitude, setOwnerLatitude] = useState('');
    const [ownerLongitude, setOwnerLongitude] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const KAKAO_API_KEY = 'f8609808f0ad80f284bc679eb3d80315';

    useEffect(() => {
        const fetchOwnerInfo = async () => {
            try {
                const res = await getInfo();
                if (res.status === 200) {
                    const {
                        ownerEmail,
                        ownerName,
                        ownerAddress,
                        ownerLatitude,
                        ownerLongitude,
                        ownerId,
                        ownerBusinessNumber
                    } = res.data;

                    if (ownerAddress === null) {
                        setOwnerEmail(ownerEmail);
                        setOwnerName(ownerName);
                    } else {
                        navigate("/signup");
                        localStorage.setItem('ownerId', ownerId);
                        localStorage.setItem('ownerName', ownerName);
                        localStorage.setItem('ownerEmail', ownerEmail);
                        localStorage.setItem('ownerAddress', ownerAddress);
                        localStorage.setItem('ownerLatitude', ownerLatitude);
                        localStorage.setItem('ownerLongitude', ownerLongitude);
                        localStorage.setItem('ownerBusinessNumber', ownerBusinessNumber);
                    }
                }
            } catch (error) {
                console.log("Error fetching owner info:", error);
                alert("Error fetching owner info");
            }
        };

        fetchOwnerInfo();
    }, []);

    const handleAddressChange = async () => {
        if (!ownerAddress.trim()) {
            alert("주소를 입력하세요");
            return;
        }

        try {
            const response = await axios.get(`https://dapi.kakao.com/v2/local/search/address.json`, {
                params: {
                    query: ownerAddress,
                },
                headers: {
                    Authorization: `KakaoAK ${KAKAO_API_KEY}`,
                },
            });

            const { documents } = response.data;
            if (documents.length > 0) {
                const { x, y } = documents[0].address;
                setOwnerLatitude(parseFloat(y));
                setOwnerLongitude(parseFloat(x));
                alert("주소 입력 완료");
            } else {
                alert("잘못된 주소입니다");
            }
        } catch (error) {
            console.error("Error converting address:", error);
            alert("An error occurred while converting the address.");
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Simple validation
        if (!ownerEmail || !ownerName || !ownerAddress || !ownerBusinessNumber) {
            setError('Please fill in all fields.');
            return;
        }
        try {
            const res = await updateInfo(
                { ownerName, ownerAddress, ownerBusinessNumber, ownerLatitude, ownerLongitude });
            if (res.status === 200) {
                alert('가입 완료');
                navigate('/');
            } else {
                alert('가입 실패');
            }
        } catch (error) {
            console.error("Error during signup", error);
            alert('An error occurred during signup.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>회원가입</h1>
            <br/>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '15px'}}>
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)} // This will not trigger when readOnly
                        required
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                        readOnly // Add this attribute to make the input read-only
                    />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label htmlFor="name">이름</label>
                    <input
                        type="text"
                        id="name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        required
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label htmlFor="address">가게 주소</label>
                    <input
                        type="text"
                        id="address"
                        value={ownerAddress}
                        onChange={(e) => setOwnerAddress(e.target.value)}
                        required
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                    <button onClick={handleAddressChange}>
                        주소확인
                    </button>
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label htmlFor="businessNumber">사업자번호</label>
                    <input
                        type="text"
                        id="businessNumber"
                        value={ownerBusinessNumber}
                        onChange={(e) => setOwnerBusinessNumber(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
                <button type="submit" style={{ padding: '10px 20px' }}>가입완료</button>
            </form>
        </div>
    );
};

export default SignupPage;
