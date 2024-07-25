import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import waguwagu from "../assets/waguwagu.png";

const Layout = () => {
  return (
    <>
      <header>
        <div className="logo" style={{ textAlign: "center", margin: "30px 0" }}>
          <img src={waguwagu} alt="waguwagu" />
        </div>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
