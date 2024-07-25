import React from "react";
import { Navigate } from "react-router-dom";

const RedirectToDefaultMenu = () => {
  return <Navigate to="/my-menu/1" />;
};

export default RedirectToDefaultMenu;
