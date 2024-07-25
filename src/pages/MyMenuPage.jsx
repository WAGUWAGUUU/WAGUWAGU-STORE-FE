import React from "react";
import ShowMenuList from "../components/ShowMenuList";
import ShowMenuDetail from "../components/ShowMenuDetail";
const MyMenuPage = () => {
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <ShowMenuList />
      <ShowMenuDetail />
    </div>
  );
};
export default MyMenuPage;
