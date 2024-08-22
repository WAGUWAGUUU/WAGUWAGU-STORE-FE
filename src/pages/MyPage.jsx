import React, {useEffect, useState} from "react";
import {getInfo, updateInfo} from "../config/authApi.js";
import './Mypage.css';
import Vector from "../assets/Vector.png";


const MyPage = () => {

    const [modify, setModify] = useState(false);
    const [ownerEmail, setOwnerEmail] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerBusinessNumber, setOwnerBusinessNumber] = useState('');


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

                    console.log(res.data.ownerName);
                    if (ownerBusinessNumber === null) {
                        setOwnerEmail(ownerEmail);
                        setOwnerName(ownerName);
                    } else {
                        localStorage.setItem('ownerId', ownerId);
                        localStorage.setItem('ownerName', ownerName);
                        localStorage.setItem('ownerEmail', ownerEmail);
                        localStorage.setItem('ownerBusinessNumber', ownerBusinessNumber);
                        setOwnerEmail(ownerEmail);
                        setOwnerName(ownerName);
                        setOwnerBusinessNumber(ownerBusinessNumber);
                    }
                }
            } catch (error) {
                console.log("Error fetching owner info:", error);
                alert("Error fetching owner info");
            }
        };

        fetchOwnerInfo();
    },[]);

    const handleModify = async () => {
        if (modify) {
            try {
                localStorage.setItem('ownerName', ownerName);
                try {
                    const res = await updateInfo({ ownerName, ownerBusinessNumber });
                    if (res.status === 200) {
                        alert('정보 수정 성공', '정보 수정이 완료되었습니다!');
                        // navigation.replace('Main');
                    } else {
                        alert('정보 수정 실패', '정보 수정에 실패했습니다. 다시 시도해주세요.');
                    }
                } catch (error) {
                    console.log("정보 수정 중 에러", error);
                    alert('Error', '정보 수정 중 에러가 발생했습니다.');
                }
            } catch (error) {
                console.error('Failed to save user data:', error);
            }
            setModify(false); // Exit edit mode
        } else {
            setModify(true); // Enter edit mode
        }
    };
    return (
        <div className="container">
            <div className="profile">
                <img
                    src={Vector}
                    alt="Profile"
                    className="profile-image"
                />
                <p className="greeting">장사의 신! {ownerName}</p>
            </div>
            <div className="info-box">
                {modify ? (
                    <>
                        <div className="info-row">
                            <label className="label">이름</label>
                            <input
                                className="input"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                style={{ textAlign: 'right' }}
                            />
                        </div>
                        <div className="separator" />
                    </>
                ) : (
                    <>
                        <div className="info-row">
                            <label className="label">이메일</label>
                            <p className="value">{ownerEmail}</p>
                        </div>
                        <div className="separator" />
                        <div className="info-row">
                            <label className="label">사업자번호</label>
                            <p className="value">{ownerBusinessNumber}</p>
                        </div>
                        <div className="separator" />
                    </>
                )}
            </div>
            <div className="button-container">
                <button onClick={handleModify} className="modify-button">
                    {modify ? "저장하기" : "수정하기"}
                </button>
            </div>
            <div className="button-container">
                <button className="action-button">로그아웃</button>
            </div>
        </div>
    );
};
export default MyPage;
