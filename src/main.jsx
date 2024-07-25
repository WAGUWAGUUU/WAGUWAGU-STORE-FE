import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Layout from './pages/Layout.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import MyStore from './pages/MyStore.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // 예시
      { path: "/mystore", element: <MyStore /> },
      // { path: "/join", element: <Signup /> }, 
      // { path: "/login", element: <Login /> },
      // { path: "/board", element: <Boards /> },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
