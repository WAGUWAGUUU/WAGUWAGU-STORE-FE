import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    return (
        <div className="nav-container">
            {!menuVisible && (
                <button className="hamburger-button" onClick={toggleMenu}>
                    &#9776;
                </button>
            )}
            <div className={`side-menu ${menuVisible ? "visible" : ""}`}>
                <button className="close-button" onClick={closeMenu}>
                    &times;
                </button>
                <nav className="nav-item">
                    <Link
                        to="/OrderNotification"
                        style={{ textDecoration: "none" }}
                        className="nav-button"
                        onClick={closeMenu}
                    >
                        내 주문창
                    </Link>
                </nav>
                <nav className="nav-item">
                    <Link
                        to="/my-menu"
                        style={{ textDecoration: "none" }}
                        className="nav-button"
                        onClick={closeMenu}
                    >
                        마이 메뉴
                    </Link>
                </nav>
                <nav className="nav-item">
                    <Link
                        to="/mystore"
                        style={{ textDecoration: "none" }}
                        className="nav-button"
                        onClick={closeMenu}
                    >
                        마이 스토어 설정
                    </Link>
                </nav>
                <nav className="nav-item">
                    <Link
                        to="/mypage"
                        style={{ textDecoration: "none" }}
                        className="nav-button"
                        onClick={closeMenu}
                    >
                        마이페이지
                    </Link>
                </nav>
                <nav className="nav-item">
                    <Link
                        to="/HistoryInquiry"
                        style={{ textDecoration: "none" }}
                        className="nav-button"
                        onClick={closeMenu}
                    >
                        가게 내역
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default NavBar;
