import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  return (
    <div className="nav-container">
      <nav className="nav-item">
        <button className="nav-button">주문 내역</button>
      </nav>
      <nav className="nav-item">
        <Link
          to="/my-menu"
          style={{ textDecoration: "none" }}
          className="nav-button"
        >
          마이 메뉴
        </Link>
      </nav>
      <nav className="nav-item">
        <button className="nav-button">마이 스토어 설정</button>
      </nav>
      <nav className="nav-item">
        <button className="nav-button">내 계정 정보</button>
      </nav>
    </div>
  );
};

export default NavBar;
