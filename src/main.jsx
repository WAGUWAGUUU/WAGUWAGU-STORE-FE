import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Layout from "./pages/Layout.jsx";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import OrderNotification from "./pages/OrderNotification.jsx";
import HistoryInquiry from "./pages/HistoryInquiry.jsx";
import MyMenuPage from "./pages/MyMenuPage.jsx";
import RedirectToDefaultMenu from "./pages/RedirectToDefaultMenu.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import CallbackPage from "./pages/CallbackPage.jsx";
import MyPage from "./pages/MyPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // { path: "/", element: <Counter /> },
      // { path: "/join", element: <Signup /> },
      { path: "/OrderNotification", element: <OrderNotification /> },
      { path: "/HistoryInquiry", element: <HistoryInquiry /> },
      { path: "/Login", element: <LoginPage /> },
      { path: "/api/v1/owners/callback", element: <CallbackPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/mypage", element: <MyPage /> },
      { path: "/my-menu", element: <RedirectToDefaultMenu /> },
      { path: "/my-menu/:menuId", element: <MyMenuPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
