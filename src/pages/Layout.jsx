import { Link, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import waguwagu from "../assets/waguwagu6.png";
import "./Layout.css";

const Layout = () => {
  return (
    <>
      <header>
        <Link to="/">
          <div
            className="logo"
            style={{ textAlign: "center", margin: "30px 0" }}
          >
            <img src={waguwagu} alt="waguwagu" />
          </div>
        </Link>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
