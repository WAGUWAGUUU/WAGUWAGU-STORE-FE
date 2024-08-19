import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  return (
    <div className="nav-container">
      <nav className="nav-item">
        <Link
          to="/OrderNotification"
          style={{ textDecoration: "none" }}
          className="nav-button"
        >
          내 주문창
        </Link>
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
        <Link
          to="/mystore"
          style={{ textDecoration: "none" }}
          className="nav-button"
        >
          마이 스토어 설정
        </Link>
      </nav>
      <nav className="nav-item">
        {/*<button className="nav-button">내 계정 정보</button>*/}
        <Link
          to="/mypage"
          style={{ textDecoration: "none" }}
          className="nav-button"
        >
          마이페이지
        </Link>
      </nav>
      <nav className="nav-item">
        <Link
          to="/HistoryInquiry"
          style={{ textDecoration: "none" }}
          className="nav-button"
        >
          가게 내역
        </Link>
      </nav>
      {/* <nav className="nav-item">
        <Link
          to="/my-sales"
          style={{ textDecoration: "none" }}
          className="nav-button"
        >
          가게 매출
        </Link>
      </nav> */}
    </div>
  );
};

export default NavBar;
