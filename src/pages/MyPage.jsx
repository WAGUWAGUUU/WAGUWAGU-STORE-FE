import React, {useEffect, useState} from "react";
import axios from "axios";
import {getInfo, updateInfo} from "../config/authApi.js";
import {useNavigate} from "react-router-dom";
import './Mypage.css';
import Vector from "../assets/Vector.png";

const KAKAO_API_KEY = 'f8609808f0ad80f284bc679eb3d80315';

const MyPage = () => {
    const navigate = useNavigate();

    const [modify, setModify] = useState(false);
    const [ownerEmail, setOwnerEmail] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerAddress, setOwnerAddress] = useState('');
    const [ownerBusinessNumber, setOwnerBusinessNumber] = useState('');
    const [ownerLatitude, setOwnerLatitude] = useState('');
    const [ownerLongitude, setOwnerLongitude] = useState('');

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

                    console.log(res.data.ownerName);
                    if (ownerAddress === null) {
                        setOwnerEmail(ownerEmail);
                        setOwnerName(ownerName);
                    } else {
                        localStorage.setItem('ownerId', ownerId);
                        localStorage.setItem('ownerName', ownerName);
                        localStorage.setItem('ownerEmail', ownerEmail);
                        localStorage.setItem('ownerAddress', ownerAddress);
                        localStorage.setItem('ownerLatitude', ownerLatitude);
                        localStorage.setItem('ownerLongitude', ownerLongitude);
                        localStorage.setItem('ownerBusinessNumber', ownerBusinessNumber);
                        setOwnerEmail(ownerEmail);
                        setOwnerName(ownerName);
                        setOwnerAddress(ownerAddress);
                        setOwnerLatitude(ownerLatitude);
                        setOwnerLongitude(ownerLongitude);
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
                localStorage.setItem('ownerAddress', ownerAddress);
                try {
                    const res = await updateInfo({ ownerName, ownerAddress, ownerLatitude, ownerLongitude, ownerBusinessNumber });
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
                        <div className="info-row">
                            <label className="label">주소</label>
                            <input
                                className="input"
                                value={ownerAddress}
                                onChange={(e) => setOwnerAddress(e.target.value)}
                                style={{ textAlign: 'right' }}
                            />
                        </div>
                        <button onClick={handleAddressChange} className="address-button">
                            주소 확인
                        </button>
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
                        <div className="info-row">
                            <label className="label">주소</label>
                            <p className="value">{ownerAddress}</p>
                        </div>
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
