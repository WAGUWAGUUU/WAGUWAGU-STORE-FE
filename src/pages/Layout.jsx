import { Link, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import waguwagu from "../assets/waguwagu6.png";
import "./Layout.css";

const Layout = () => {
    return (
        <>
            <header>
                <NavBar />
            </header>
            <header>
                <Link to="/">
                    <div className="logo-container">
                        <img src={waguwagu} alt="waguwagu" className="logo" />
                    </div>
                </Link>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
