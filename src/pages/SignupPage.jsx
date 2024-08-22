import React, { useEffect, useState } from 'react';
import { getInfo, updateInfo } from "../config/authApi.js";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const [ownerEmail, setOwnerEmail] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerBusinessNumber, setOwnerBusinessNumber] = useState('');
    const [error, setError] = useState(null);


    const navigate = useNavigate();


    useEffect(() => {
        const fetchOwnerInfo = async () => {
            try {
                const res = await getInfo();
                if (res.status === 200) {
                    const {
                        ownerEmail,
                        ownerName,
                        ownerId,
                        ownerBusinessNumber
                    } = res.data;

                    if (ownerBusinessNumber === null) {
                        setOwnerEmail(ownerEmail);
                        setOwnerName(ownerName);
                        localStorage.setItem('ownerId', ownerId);
                    } else {
                        navigate("/mystore");
                        localStorage.setItem('ownerId', ownerId);
                        localStorage.setItem('ownerName', ownerName);
                        localStorage.setItem('ownerEmail', ownerEmail);
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


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!ownerEmail || !ownerName || !ownerBusinessNumber) {
            setError('Please fill in all fields.');
            return;
        }
        try {
            const res = await updateInfo(
                { ownerName, ownerBusinessNumber });
            if (res.status === 200) {
                alert('가입 완료');
                localStorage.setItem('ownerName', ownerName);
                localStorage.setItem('ownerEmail', ownerEmail);
                localStorage.setItem('ownerBusinessNumber', ownerBusinessNumber);
                navigate('/mystore');
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
            <div className="content-area" style={{
                backgroundColor: '#ffe6ed',
                padding: '30px',
                borderRadius: '10px',
                margin: '20px',
                textAlign: 'center'
            }}>
                <h2 style={{ fontSize: '2em', color: '#FF8FB1', marginBottom: '20px' }}>회원가입</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            value={ownerEmail}
                            onChange={(e) => setOwnerEmail(e.target.value)} // This will not trigger when readOnly
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            readOnly // Add this attribute to make the input read-only
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="name">이름</label>
                        <input
                            type="text"
                            id="name"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
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
                    <button type="submit" style={{
                        padding: '10px 20px',
                        backgroundColor: '#FF8FB1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em'
                    }}>가입완료</button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
