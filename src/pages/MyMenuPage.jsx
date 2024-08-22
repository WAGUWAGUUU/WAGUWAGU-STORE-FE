import React, { useEffect, useState } from "react";
import ShowMenuList from "../components/ShowMenuList";
import ShowMenuDetail from "../components/ShowMenuDetail";
import { getStoreByOwnerId } from "../config/storeApi";
import Lottie from "lottie-react";
import loadingLottie from "../assets/Animation - 1724243583826.json";

import { useQuery } from "@apollo/client";
import { GET_STORE_BY_OWNERID } from "../config/storeRoles.jsx";
import {useNavigate} from "react-router-dom";

const MyMenuPage = () => {
  const [store, setStore] = useState(null);
  const [menu, setMenu] = useState(null);
  const [onMenuInfoModal, setOnMenuInfoModal] = useState(false);
  const [menuDetailChange, setMenuDetailChange] = useState(false);
  const { data, loading, error } = useQuery(GET_STORE_BY_OWNERID, {
    variables: { ownerId: localStorage.getItem("ownerId") },
  });
  const navigate = useNavigate();

  if (loading) return (<div style={{height: "500px"}}>
      <Lottie animationData={loadingLottie} style={{height: "250px"}}/>
  </div>);
    if (error) {
      navigate("/");
      alert("로그인 후 이용해주세요!");
      return (
          <p>Error: {error.message}</p>
      );
    }

    console.log("Data" + data.getStoreByOwnerId);

    return (
        <div style={{display: "flex", justifyContent: "space-evenly" }}>
      <ShowMenuList
        store={data.getStoreByOwnerId}
        setMenu={setMenu}
        onMenuInfoModal={onMenuInfoModal}
        menuDetailChange={menuDetailChange}
      />
      <ShowMenuDetail
        menu={menu}
        setMenu={setMenu}
        onMenuInfoModal={onMenuInfoModal}
        setOnMenuInfoModal={setOnMenuInfoModal}
        menuDetailChange={menuDetailChange}
        setMenuDetailChange={setMenuDetailChange}
      />
    </div>
  );
};
export default MyMenuPage;
