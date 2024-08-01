import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Layout from "./pages/Layout.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MyStore from "./pages/MyStore.jsx";
import OrderNotification from "./pages/OrderNotification.jsx";
import HistoryInquiry from "./pages/HistoryInquiry.jsx";
import MyMenuPage from "./pages/MyMenuPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import CallbackPage from "./pages/CallbackPage.jsx";
import MyPage from "./pages/MyPage.jsx";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://192.168.0.17:8080/graphql",
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // { path: "/", element: <Counter /> },
      // { path: "/join", element: <Signup /> },
      { path: "/mystore", element: <MyStore /> },
      { path: "/OrderNotification", element: <OrderNotification /> },
      { path: "/HistoryInquiry", element: <HistoryInquiry /> },
      { path: "/Login", element: <LoginPage /> },
      { path: "/owners/callback", element: <CallbackPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/mypage", element: <MyPage /> },
      // { path: "/board", element: <Boards /> },
      { path: "/my-menu", element: <MyMenuPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
